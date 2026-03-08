import type { InstrumentMethodologyConfig } from '@compute-atlas/types';

export const methodologyVersion = '2026-03-mvp';

export const instrumentConfigs: Record<string, InstrumentMethodologyConfig> = {
  H100_GLOBAL_SPOT: {
    symbol: 'H100_GLOBAL_SPOT',
    gpuModel: 'H100',
    region: 'global',
    regionScope: 'global',
    priceType: 'spot',
    allowedProviders: ['aws', 'gcp', 'runpod', 'custom-json'],
    staleAfterMinutes: 180,
    outlierThresholdPercent: 25,
    minimumSampleSize: 2,
    providerWeights: {
      aws: 1,
      gcp: 1,
      runpod: 1.1,
      'custom-json': 0.8,
    },
  },
  H100_EU_SPOT: {
    symbol: 'H100_EU_SPOT',
    gpuModel: 'H100',
    region: 'eu',
    regionScope: 'regional',
    priceType: 'spot',
    allowedProviders: ['gcp', 'custom-json'],
    staleAfterMinutes: 240,
    outlierThresholdPercent: 20,
    minimumSampleSize: 2,
    providerWeights: {
      gcp: 1,
      'custom-json': 0.8,
    },
  },
  A100_GLOBAL_SPOT: {
    symbol: 'A100_GLOBAL_SPOT',
    gpuModel: 'A100',
    region: 'global',
    regionScope: 'global',
    priceType: 'spot',
    allowedProviders: ['vast'],
    staleAfterMinutes: 240,
    outlierThresholdPercent: 30,
    minimumSampleSize: 1,
    providerWeights: {
      vast: 1,
    },
  },
};
