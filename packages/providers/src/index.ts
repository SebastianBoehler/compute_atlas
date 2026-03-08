import { ProviderRegistry } from '@compute-atlas/provider-sdk';

import { awsAdapter } from './aws';
import { azureAdapter } from './azure';
import { customJsonAdapter } from './custom-json';
import { gcpAdapter } from './gcp';
import { lambdaAdapter } from './lambda';
import { runpodAdapter } from './runpod';
import { vastAdapter } from './vast';

export const providers = [
  awsAdapter,
  gcpAdapter,
  azureAdapter,
  runpodAdapter,
  vastAdapter,
  lambdaAdapter,
  customJsonAdapter,
];

export const createProviderRegistry = () => {
  const registry = new ProviderRegistry();
  registry.registerMany(providers);
  return registry;
};

export * from './fixtures';
