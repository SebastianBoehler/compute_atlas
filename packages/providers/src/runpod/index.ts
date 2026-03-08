import { createFixtureAdapter } from '../factory';

export const runpodAdapter = createFixtureAdapter({
  id: 'provider-runpod',
  slug: 'runpod',
  name: 'RunPod',
  capabilities: [
    'fetchMarkets',
    'fetchSpotPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
});
