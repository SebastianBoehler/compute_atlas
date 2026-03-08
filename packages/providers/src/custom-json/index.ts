import { createFixtureAdapter } from '../factory';

export const customJsonAdapter = createFixtureAdapter({
  id: 'provider-custom-json',
  slug: 'custom-json',
  name: 'Custom JSON Feed',
  capabilities: [
    'fetchMarkets',
    'fetchSpotPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
