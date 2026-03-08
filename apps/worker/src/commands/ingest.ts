import { eq } from 'drizzle-orm';

import {
  db,
  ingestionRuns,
  insertProviderMarkets,
  insertProviders,
  insertRawObservations,
} from '@compute-atlas/db';
import { logger } from '@compute-atlas/observability';
import { providers } from '@compute-atlas/providers';

export const runIngest = async () => {
  const providerRecords = providers.map((provider) => ({
    id: provider.id,
    slug: provider.slug,
    name: provider.name,
    category: provider.slug === 'custom-json' ? 'custom_feed' : 'cloud_compute',
    metadata: {
      capabilities: provider.capabilities,
      mock: true,
    },
  }));

  await insertProviders(providerRecords);

  for (const provider of providers) {
    const startedAt = new Date();
    const ingestionRunId = crypto.randomUUID();

    await db.insert(ingestionRuns).values({
      id: ingestionRunId,
      providerId: provider.id,
      jobType: 'ingest',
      status: 'running',
      startedAt,
      metadata: {
        provider: provider.slug,
      },
    });

    try {
      const [markets, spotPrices, onDemandPrices] = await Promise.all([
        provider.fetchMarkets?.() ?? [],
        provider.fetchSpotPrices?.() ?? [],
        provider.fetchOnDemandPrices?.() ?? [],
      ]);

      await insertProviderMarkets(
        markets.map((market) => ({
          id: market.id,
          providerId: market.providerId,
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
      await insertRawObservations([...spotPrices, ...onDemandPrices]);

      await db
        .update(ingestionRuns)
        .set({
          status: 'completed',
          completedAt: new Date(),
          recordsRead:
            markets.length + spotPrices.length + onDemandPrices.length,
          recordsWritten:
            markets.length + spotPrices.length + onDemandPrices.length,
        })
        .where(eq(ingestionRuns.id, ingestionRunId));

      logger.info(
        {
          provider: provider.slug,
          markets: markets.length,
          spotPrices: spotPrices.length,
          onDemandPrices: onDemandPrices.length,
        },
        'Completed provider ingestion',
      );
    } catch (error) {
      await db
        .update(ingestionRuns)
        .set({
          status: 'failed',
          completedAt: new Date(),
          errorMessage:
            error instanceof Error ? error.message : 'Unknown ingestion error',
        })
        .where(eq(ingestionRuns.id, ingestionRunId));

      throw error;
    }
  }
};
