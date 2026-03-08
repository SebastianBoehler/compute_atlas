import type { ProviderAdapter } from '@compute-atlas/provider-sdk';

export const validateProviderContract = async (adapter: ProviderAdapter) => {
  const health = await adapter.healthCheck();
  if (!health.ok) {
    throw new Error(`${adapter.slug} health check failed`);
  }

  if (adapter.fetchMarkets) {
    const markets = await adapter.fetchMarkets();
    if (markets.length === 0) {
      throw new Error(`${adapter.slug} returned no markets`);
    }
  }

  if (adapter.fetchSpotPrices) {
    const observations = await adapter.fetchSpotPrices();
    if (!Array.isArray(observations)) {
      throw new Error(`${adapter.slug} returned invalid spot prices`);
    }
  }

  if (adapter.fetchOnDemandPrices) {
    const observations = await adapter.fetchOnDemandPrices();
    if (!Array.isArray(observations)) {
      throw new Error(`${adapter.slug} returned invalid on-demand prices`);
    }
  }
};
