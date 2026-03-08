import type {
  CurrencyCode,
  PriceUnit,
  RawPriceObservation,
} from '@compute-atlas/types';

const fxRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
};

export const normalizeCurrencyToUsd = (value: number, currency: CurrencyCode) =>
  Number((value * fxRates[currency]).toFixed(6));

export const normalizeUnitToGpuHour = (
  value: number,
  unit: PriceUnit,
  metadata: Record<string, unknown>,
) => {
  if (unit === 'gpu_hour') {
    return value;
  }

  const gpuCount =
    typeof metadata.gpuCount === 'number' && metadata.gpuCount > 0
      ? Number(metadata.gpuCount)
      : 8;

  return Number((value / gpuCount).toFixed(6));
};

export const normalizeObservation = (
  observation: RawPriceObservation,
): RawPriceObservation => {
  const usd = normalizeCurrencyToUsd(observation.price, observation.currency);
  const perGpuHour = normalizeUnitToGpuHour(
    usd,
    observation.unit,
    observation.metadata,
  );

  return {
    ...observation,
    currency: 'USD',
    unit: 'gpu_hour',
    priceUsdPerHour: perGpuHour,
  };
};
