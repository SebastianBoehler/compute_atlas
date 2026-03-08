import { createFixtureAdapter } from '../factory';

export const vastAdapter = createFixtureAdapter({
  id: 'provider-vast',
  slug: 'vast',
  name: 'Vast.ai',
  capabilities: [
    'fetchMarkets',
    'fetchSpotPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
