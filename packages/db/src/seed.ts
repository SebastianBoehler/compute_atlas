import 'dotenv/config';

import { instrumentConfigs } from '@compute-atlas/methodology';
import { providers as providerAdapters } from '@compute-atlas/providers';

import { db, pgPool } from './client';
import { normalizedInstruments, providers } from './schema';

const providerRows = providerAdapters.map((provider) => ({
  id: provider.id,
  slug: provider.slug,
  name: provider.name,
  category: 'cloud_compute',
  metadata: {
    capabilities: provider.capabilities,
  },
}));

const instrumentRows = Object.values(instrumentConfigs).map((config) => ({
  id: `instrument-${config.symbol.toLowerCase()}`,
  symbol: config.symbol,
  name: `${config.gpuModel} ${config.region.toUpperCase()} ${config.priceType.toUpperCase()}`,
  gpuModel: config.gpuModel,
  region: config.region,
  regionScope: config.regionScope,
  priceType: config.priceType,
  quoteCurrency: 'USD',
  unit: 'gpu_hour',
  methodologyKey: config.symbol.toLowerCase(),
  metadata: {
    allowedProviders: config.allowedProviders,
  },
}));

const run = async () => {
  await db.insert(providers).values(providerRows).onConflictDoNothing();
  await db
    .insert(normalizedInstruments)
    .values(instrumentRows)
    .onConflictDoNothing();

  console.log('Database catalog seed completed.');
  await pgPool.end();
};

run().catch(async (error) => {
  console.error(error);
  await pgPool.end();
  process.exit(1);
});
