import { createFixtureAdapter } from '../factory';

export const awsAdapter = createFixtureAdapter({
  id: 'provider-aws',
  slug: 'aws',
  name: 'Amazon Web Services',
  capabilities: [
    'fetchMarkets',
    'fetchSpotPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
