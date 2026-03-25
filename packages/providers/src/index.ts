import { ProviderRegistry } from '@compute-atlas/provider-sdk';

import { azureLiveAdapter } from './azure';

export const providers = [azureLiveAdapter];

export const createProviderRegistry = () => {
  const registry = new ProviderRegistry();
  registry.registerMany(providers);
  return registry;
};
