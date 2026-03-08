import {
  getInstrumentBySymbol,
  getRecentRawObservations,
  upsertInstrumentPricePoint,
} from '@compute-atlas/db';
import { computeIndex, instrumentConfigs } from '@compute-atlas/methodology';
import { logger } from '@compute-atlas/observability';

export const runCompute = async (symbols = Object.keys(instrumentConfigs)) => {
  const results = [];

  for (const symbol of symbols) {
    const config = instrumentConfigs[symbol];
    if (!config) {
      continue;
    }

    const instrument = await getInstrumentBySymbol(symbol);
    if (!instrument) {
      logger.warn({ symbol }, 'Skipping compute for missing instrument');
      continue;
    }

    const observations = await getRecentRawObservations(config);
    const result = computeIndex(
      config,
      observations.map((entry) => ({
        id: entry.id,
        providerId: entry.providerId,
        providerSlug: entry.providerSlug,
        marketId: entry.marketId ?? undefined,
        observedAt: entry.observedAt.toISOString(),
        fetchedAt: entry.fetchedAt.toISOString(),
        region: entry.region,
        gpuModel: entry.gpuModel,
        priceType: entry.priceType as 'spot' | 'on_demand' | 'auction',
        currency: entry.currency as 'USD' | 'EUR' | 'GBP',
        unit: entry.unit as 'gpu_hour' | 'instance_hour',
        price: entry.price,
        priceUsdPerHour: entry.normalizedPriceUsdPerHour ?? undefined,
        confidenceScore: entry.confidenceScore,
        provenanceUrl: entry.provenanceUrl ?? undefined,
        metadata: entry.metadata,
        rawPayload: entry.rawPayload,
      })),
    );

    if (!result) {
      logger.warn({ symbol }, 'Methodology returned no result');
      continue;
    }

    await upsertInstrumentPricePoint(instrument.id, result, {
      contributions: result.contributions,
    });
    results.push(result);
  }

  return results;
};
