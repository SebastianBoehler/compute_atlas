import { createFixtureAdapter } from '../factory';

export const gcpAdapter = createFixtureAdapter({
  id: 'provider-gcp',
  slug: 'gcp',
  name: 'Google Cloud Platform',
  capabilities: [
    'fetchMarkets',
    'fetchSpotPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
