import type { InstrumentMethodologyConfig } from '@compute-atlas/types';

export const methodologyVersion = '2026-03-mvp';

export const instrumentConfigs: Record<string, InstrumentMethodologyConfig> = {
  H100_GLOBAL_ON_DEMAND: {
    symbol: 'H100_GLOBAL_ON_DEMAND',
    gpuModel: 'H100',
    region: 'global',
    regionScope: 'global',
    priceType: 'on_demand',
    allowedProviders: ['azure'],
    staleAfterMinutes: 24 * 60,
    outlierThresholdPercent: 35,
    minimumSampleSize: 1,
    providerWeights: {
      azure: 1,
    },
  },
  H100_GLOBAL_SPOT: {
    symbol: 'H100_GLOBAL_SPOT',
    gpuModel: 'H100',
    region: 'global',
    regionScope: 'global',
    priceType: 'spot',
    allowedProviders: ['azure'],
    staleAfterMinutes: 24 * 60,
    outlierThresholdPercent: 35,
    minimumSampleSize: 1,
    providerWeights: {
      azure: 1,
    },
  },
  A100_GLOBAL_ON_DEMAND: {
    symbol: 'A100_GLOBAL_ON_DEMAND',
    gpuModel: 'A100',
    region: 'global',
    regionScope: 'global',
    priceType: 'on_demand',
    allowedProviders: ['azure'],
    staleAfterMinutes: 24 * 60,
    outlierThresholdPercent: 35,
    minimumSampleSize: 1,
    providerWeights: {
      azure: 1,
    },
  },
  A100_GLOBAL_SPOT: {
    symbol: 'A100_GLOBAL_SPOT',
    gpuModel: 'A100',
    region: 'global',
    regionScope: 'global',
    priceType: 'spot',
    allowedProviders: ['azure'],
    staleAfterMinutes: 24 * 60,
    outlierThresholdPercent: 35,
    minimumSampleSize: 1,
    providerWeights: {
      azure: 1,
    },
  },
  H200_GLOBAL_ON_DEMAND: {
    symbol: 'H200_GLOBAL_ON_DEMAND',
    gpuModel: 'H200',
    region: 'global',
    regionScope: 'global',
    priceType: 'on_demand',
    allowedProviders: ['azure'],
    staleAfterMinutes: 24 * 60,
    outlierThresholdPercent: 35,
    minimumSampleSize: 1,
    providerWeights: {
      azure: 1,
    },
  },
  H200_GLOBAL_SPOT: {
    symbol: 'H200_GLOBAL_SPOT',
    gpuModel: 'H200',
    region: 'global',
    regionScope: 'global',
    priceType: 'spot',
    allowedProviders: ['azure'],
    staleAfterMinutes: 24 * 60,
    outlierThresholdPercent: 35,
    minimumSampleSize: 1,
    providerWeights: {
      azure: 1,
    },
  },
};
