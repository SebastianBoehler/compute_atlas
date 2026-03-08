import type {
  InstrumentMethodologyConfig,
  MethodologyContribution,
  MethodologyResult,
  RawPriceObservation,
} from '@compute-atlas/types';

import { calculateConfidenceScore } from './confidence';
import { methodologyVersion } from './config';
import { normalizeObservation } from './normalize';

const percentile = (values: number[], p: number) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sorted[lower];
  }
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const weightedMedian = (values: Array<{ value: number; weight: number }>) => {
  const sorted = [...values].sort((a, b) => a.value - b.value);
  const totalWeight = sorted.reduce((sum, item) => sum + item.weight, 0);
  let cumulative = 0;

  for (const item of sorted) {
    cumulative += item.weight;
    if (cumulative >= totalWeight / 2) {
      return item.value;
    }
  }

  return sorted[sorted.length - 1]?.value ?? 0;
};

const isRegionalMatch = (region: string, scope: string) =>
  scope === 'global'
    ? true
    : region.toLowerCase().includes(scope.toLowerCase());

export const computeIndex = (
  config: InstrumentMethodologyConfig,
  observations: RawPriceObservation[],
  referenceTime = new Date(),
): MethodologyResult | null => {
  const normalized = observations
    .filter((observation) =>
      config.allowedProviders.includes(observation.providerSlug),
    )
    .map(normalizeObservation)
    .filter(
      (observation) =>
        observation.gpuModel === config.gpuModel &&
        observation.priceType === config.priceType &&
        isRegionalMatch(observation.region, config.region),
    );

  const cutoff = referenceTime.getTime() - config.staleAfterMinutes * 60 * 1000;
  const contributions: MethodologyContribution[] = [];
  const fresh = normalized.filter((observation) => {
    const included = new Date(observation.observedAt).getTime() >= cutoff;
    contributions.push({
      observationId: observation.id,
      providerSlug: observation.providerSlug,
      priceUsdPerHour: observation.priceUsdPerHour ?? 0,
      weight: config.providerWeights?.[observation.providerSlug] ?? 1,
      included,
      reason: included ? undefined : 'stale',
    });
    return included;
  });

  if (fresh.length < config.minimumSampleSize) {
    return null;
  }

  const values = fresh.map((observation) => observation.priceUsdPerHour ?? 0);
  const median = percentile(values, 0.5);
  const filtered = fresh.filter((observation) => {
    const value = observation.priceUsdPerHour ?? 0;
    const deltaPercent =
      median === 0 ? 0 : (Math.abs(value - median) / median) * 100;
    const included = deltaPercent <= config.outlierThresholdPercent;
    const entry = contributions.find(
      (item) => item.observationId === observation.id,
    );
    if (entry) {
      entry.included = included;
      entry.reason = included ? undefined : 'outlier';
    }
    return included;
  });

  if (filtered.length < config.minimumSampleSize) {
    return null;
  }

  const weightedValues = filtered.map((observation) => ({
    value: observation.priceUsdPerHour ?? 0,
    weight: config.providerWeights?.[observation.providerSlug] ?? 1,
  }));
  const robustMedian = weightedMedian(weightedValues);
  const spreadLow = percentile(
    filtered.map((item) => item.priceUsdPerHour ?? 0),
    0.25,
  );
  const spreadHigh = percentile(
    filtered.map((item) => item.priceUsdPerHour ?? 0),
    0.75,
  );
  const spreadPercent =
    robustMedian === 0 ? 0 : ((spreadHigh - spreadLow) / robustMedian) * 100;
  const confidenceScore = calculateConfidenceScore({
    sampleSize: filtered.length,
    spreadPercent,
    medianPrice: robustMedian,
  });

  return {
    symbol: config.symbol,
    observedAt: referenceTime.toISOString(),
    priceUsdPerHour: Number(robustMedian.toFixed(6)),
    confidenceScore,
    intervalLow: Number(spreadLow.toFixed(6)),
    intervalHigh: Number(spreadHigh.toFixed(6)),
    includedObservationIds: filtered.map((item) => item.id),
    excludedSources: contributions
      .filter((item) => !item.included)
      .map((item) => `${item.providerSlug}:${item.reason ?? 'excluded'}`),
    contributions,
    methodologyVersion,
  };
};
