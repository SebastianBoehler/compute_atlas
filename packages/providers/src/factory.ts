import type { ProviderAdapter } from '@compute-atlas/provider-sdk';
import type {
  ProviderHealth,
  ProviderMarket,
  RawPriceObservation,
} from '@compute-atlas/types';

import { fixtureMarkets, fixtureObservations } from './fixtures';

const createHealthCheck =
  (providerSlug: string) => async (): Promise<ProviderHealth> => ({
    ok: true,
    providerSlug,
    message: 'Fixture-backed mock adapter is healthy',
    checkedAt: new Date().toISOString(),
    metadata: {
      mock: true,
    },
  });

const identityNormalize = async (rawObservation: RawPriceObservation) =>
  rawObservation;

const readMarkets = async (
  providerSlug: keyof typeof fixtureMarkets,
): Promise<ProviderMarket[]> => fixtureMarkets[providerSlug];

const readObservations = async (
  providerSlug: keyof typeof fixtureObservations,
  priceType: 'spot' | 'on_demand',
): Promise<RawPriceObservation[]> =>
  fixtureObservations[providerSlug].filter(
    (entry) => entry.priceType === priceType,
  );

export const createFixtureAdapter = (
  config: Pick<ProviderAdapter, 'id' | 'slug' | 'name' | 'capabilities'>,
): ProviderAdapter => ({
  ...config,
  fetchMarkets: config.capabilities.includes('fetchMarkets')
    ? () => readMarkets(config.slug as keyof typeof fixtureMarkets)
    : undefined,
  fetchSpotPrices: config.capabilities.includes('fetchSpotPrices')
    ? () =>
        readObservations(
          config.slug as keyof typeof fixtureObservations,
          'spot',
        )
    : undefined,
  fetchOnDemandPrices: config.capabilities.includes('fetchOnDemandPrices')
    ? () =>
        readObservations(
          config.slug as keyof typeof fixtureObservations,
          'on_demand',
        )
    : undefined,
  normalizeRawObservation: identityNormalize,
  healthCheck: createHealthCheck(config.slug),
});
