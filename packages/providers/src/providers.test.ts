import { describe, expect, it } from 'vitest';

import { providers } from './index';

describe('provider adapters', () => {
  it('satisfy the shared contract', async () => {
    for (const provider of providers) {
      await expect(provider.healthCheck()).resolves.toMatchObject({ ok: true });
      if (provider.fetchMarkets) {
        await expect(provider.fetchMarkets()).resolves.not.toHaveLength(0);
      }
      if (provider.fetchSpotPrices) {
        await expect(provider.fetchSpotPrices()).resolves.toEqual(
          expect.any(Array),
        );
      }
      if (provider.fetchOnDemandPrices) {
        await expect(provider.fetchOnDemandPrices()).resolves.toEqual(
          expect.any(Array),
        );
      }
    }
  });
});
