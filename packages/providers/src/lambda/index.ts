import { createFixtureAdapter } from '../factory';

export const lambdaAdapter = createFixtureAdapter({
  id: 'provider-lambda',
  slug: 'lambda',
  name: 'Lambda',
  capabilities: [
    'fetchMarkets',
    'fetchOnDemandPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
