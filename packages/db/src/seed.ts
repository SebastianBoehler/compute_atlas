import 'dotenv/config';

import {
  instrumentConfigs,
  methodologyVersion,
} from '@compute-atlas/methodology';
import {
  fixtureMarkets,
  fixtureObservations,
  providers as providerAdapters,
} from '@compute-atlas/providers';

import { db, pgPool } from './client';
import {
  normalizedInstruments,
  normalizedPricePoints,
  oraclePublications,
  providerMarkets,
  providers,
  rawPriceObservations,
} from './schema';

const providerRows = providerAdapters.map((provider) => ({
  id: provider.id,
  slug: provider.slug,
  name: provider.name,
  category: provider.slug === 'custom-json' ? 'custom_feed' : 'cloud_compute',
  metadata: {
    mock: true,
    capabilities: provider.capabilities,
  },
}));

const instrumentRows = Object.values(instrumentConfigs).map((config) => ({
  id: `instrument-${config.symbol.toLowerCase()}`,
  symbol: config.symbol,
  name: `${config.gpuModel} ${config.regionScope === 'global' ? 'Global' : config.region.toUpperCase()} ${config.priceType.toUpperCase()}`,
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

const seededPoints = instrumentRows.flatMap((instrument, instrumentIndex) =>
  Array.from({ length: 30 }).map((_, dayOffset) => {
    const observedAt = new Date(
      Date.now() - (29 - dayOffset) * 24 * 60 * 60 * 1000,
    );
    const base =
      instrument.symbol === 'A100_GLOBAL_SPOT'
        ? 1.45
        : instrument.symbol === 'H100_EU_SPOT'
          ? 2.72
          : 2.58;
    const variation = Math.sin(dayOffset / 4) * 0.06 + instrumentIndex * 0.015;
    const price = Number((base + variation).toFixed(4));
    return {
      id: crypto.randomUUID(),
      instrumentId: instrument.id,
      symbol: instrument.symbol,
      observedAt,
      priceUsdPerHour: price,
      confidenceScore: 0.82 + instrumentIndex * 0.04,
      sourceCount: instrument.symbol === 'A100_GLOBAL_SPOT' ? 1 : 3,
      includedObservationIds: [`seed-${instrument.symbol}-${dayOffset}`],
      excludedSources: dayOffset % 7 === 0 ? ['custom-json:outlier'] : [],
      methodologyVersion,
      metadata: {
        seeded: true,
      },
    };
  }),
);

const publicationRows = instrumentRows.slice(0, 2).map((instrument, index) => ({
  id: crypto.randomUUID(),
  chain: 'solana-devnet',
  publisher: 'seeded-publisher',
  instrumentSymbol: instrument.symbol,
  txSignature: `seeded-signature-${index + 1}`,
  slot: 100_000 + index,
  status: 'confirmed',
  payloadHash: `seeded-hash-${index + 1}`,
  payload: {
    symbol: instrument.symbol,
    priceUsdPerHour:
      seededPoints.find((point) => point.symbol === instrument.symbol)
        ?.priceUsdPerHour ?? 0,
  },
  publishedAt: new Date(Date.now() - index * 60 * 60 * 1000),
  confirmedAt: new Date(Date.now() - index * 60 * 60 * 1000 + 5_000),
  explorerUrl: `https://explorer.solana.com/tx/seeded-signature-${index + 1}?cluster=devnet`,
  metadata: {
    seeded: true,
  },
}));

const run = async () => {
  await db.insert(providers).values(providerRows).onConflictDoNothing();
  await db
    .insert(normalizedInstruments)
    .values(instrumentRows)
    .onConflictDoNothing();

  const marketRows = Object.entries(fixtureMarkets).flatMap(
    ([providerSlug, markets]) =>
      markets.map((market) => ({
        id: market.id,
        providerId: `provider-${providerSlug}`,
        externalId: market.externalId,
        displayName: market.displayName,
        region: market.region,
        gpuModel: market.gpuModel,
        priceType: market.priceType,
        currency: market.currency,
        unit: market.unit,
        metadata: market.metadata,
      })),
  );

  await db.insert(providerMarkets).values(marketRows).onConflictDoNothing();

  const observations = Object.values(fixtureObservations).flatMap((entries) =>
    entries.map((entry) => ({
      id: entry.id,
      providerId: entry.providerId,
      marketId: entry.marketId,
      observedAt: new Date(entry.observedAt),
      fetchedAt: new Date(entry.fetchedAt),
      region: entry.region,
      gpuModel: entry.gpuModel,
      priceType: entry.priceType,
      currency: entry.currency,
      unit: entry.unit,
      price: entry.price,
      normalizedPriceUsdPerHour: entry.priceUsdPerHour,
      confidenceScore: entry.confidenceScore,
      provenanceUrl: entry.provenanceUrl,
      metadata: entry.metadata,
      rawPayload: entry.rawPayload,
    })),
  );

  await db
    .insert(rawPriceObservations)
    .values(observations)
    .onConflictDoNothing();
  await db
    .insert(normalizedPricePoints)
    .values(seededPoints)
    .onConflictDoNothing();
  await db
    .insert(oraclePublications)
    .values(publicationRows)
    .onConflictDoNothing();

  console.log('Database seed completed.');
  await pgPool.end();
};

run().catch(async (error) => {
  console.error(error);
  await pgPool.end();
  process.exit(1);
});
