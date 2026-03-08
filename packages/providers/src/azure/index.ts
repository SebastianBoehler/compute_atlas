import { createFixtureAdapter } from '../factory';

export const azureAdapter = createFixtureAdapter({
  id: 'provider-azure',
  slug: 'azure',
  name: 'Microsoft Azure',
  capabilities: [
    'fetchMarkets',
    'fetchOnDemandPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
