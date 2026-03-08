import type {
  ProviderCapability,
  ProviderHealth,
  ProviderMarket,
  RawPriceObservation,
} from '@compute-atlas/types';

export interface ProviderAdapter {
  id: string;
  slug: string;
  name: string;
  capabilities: ProviderCapability[];
  fetchMarkets?: () => Promise<ProviderMarket[]>;
  fetchSpotPrices?: () => Promise<RawPriceObservation[]>;
  fetchOnDemandPrices?: () => Promise<RawPriceObservation[]>;
  normalizeRawObservation?: (
    rawObservation: RawPriceObservation,
  ) => Promise<RawPriceObservation>;
  healthCheck: () => Promise<ProviderHealth>;
}
