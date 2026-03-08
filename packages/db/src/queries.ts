import { and, desc, eq, gte, sql } from 'drizzle-orm';

import type {
  MethodologyResult,
  OraclePublicationRecord,
  RawPriceObservation,
} from '@compute-atlas/types';

import { db } from './client';
import {
  normalizedInstruments,
  normalizedPricePoints,
  oraclePublications,
  providerMarkets,
  providers,
  rawPriceObservations,
} from './schema';

export const listProviders = () =>
  db.select().from(providers).orderBy(providers.slug);

export const listInstruments = () =>
  db
    .select()
    .from(normalizedInstruments)
    .where(eq(normalizedInstruments.isActive, true));

export const getInstrumentBySymbol = async (symbol: string) => {
  const result = await db
    .select()
    .from(normalizedInstruments)
    .where(eq(normalizedInstruments.symbol, symbol))
    .limit(1);
  return result[0] ?? null;
};

export const getLatestPricePoint = async (symbol: string) => {
  const result = await db
    .select()
    .from(normalizedPricePoints)
    .where(eq(normalizedPricePoints.symbol, symbol))
    .orderBy(desc(normalizedPricePoints.observedAt))
    .limit(1);

  return result[0] ?? null;
};

export const getHistoryForInstrument = async (
  symbol: string,
  hours: number,
) => {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return db
    .select()
    .from(normalizedPricePoints)
    .where(
      and(
        eq(normalizedPricePoints.symbol, symbol),
        gte(normalizedPricePoints.observedAt, cutoff),
      ),
    )
    .orderBy(normalizedPricePoints.observedAt);
};

export const getRecentRawObservations = async (symbolConfig: {
  gpuModel: string;
  priceType: string;
  region: string;
}) =>
  db
    .select({
      id: rawPriceObservations.id,
      providerId: rawPriceObservations.providerId,
      providerSlug: providers.slug,
      marketId: rawPriceObservations.marketId,
      observedAt: rawPriceObservations.observedAt,
      fetchedAt: rawPriceObservations.fetchedAt,
      region: rawPriceObservations.region,
      gpuModel: rawPriceObservations.gpuModel,
      priceType: rawPriceObservations.priceType,
      currency: rawPriceObservations.currency,
      unit: rawPriceObservations.unit,
      price: rawPriceObservations.price,
      normalizedPriceUsdPerHour: rawPriceObservations.normalizedPriceUsdPerHour,
      confidenceScore: rawPriceObservations.confidenceScore,
      provenanceUrl: rawPriceObservations.provenanceUrl,
      metadata: rawPriceObservations.metadata,
      rawPayload: rawPriceObservations.rawPayload,
    })
    .from(rawPriceObservations)
    .innerJoin(providers, eq(providers.id, rawPriceObservations.providerId))
    .where(
      and(
        eq(rawPriceObservations.gpuModel, symbolConfig.gpuModel),
        eq(rawPriceObservations.priceType, symbolConfig.priceType),
      ),
    )
    .orderBy(desc(rawPriceObservations.observedAt));

export const insertProviders = async (
  values: (typeof providers.$inferInsert)[],
) => {
  if (values.length === 0) {
    return;
  }
  await db
    .insert(providers)
    .values(values)
    .onConflictDoUpdate({
      target: providers.id,
      set: {
        slug: sql`excluded.slug`,
        name: sql`excluded.name`,
        category: sql`excluded.category`,
        isActive: sql`excluded.is_active`,
        metadata: sql`excluded.metadata`,
        updatedAt: sql`now()`,
      },
    });
};

export const insertProviderMarkets = async (
  values: (typeof providerMarkets.$inferInsert)[],
) => {
  if (values.length === 0) {
    return;
  }
  await db.insert(providerMarkets).values(values).onConflictDoNothing();
};

export const insertRawObservations = async (values: RawPriceObservation[]) => {
  if (values.length === 0) {
    return;
  }

  await db
    .insert(rawPriceObservations)
    .values(
      values.map((value) => ({
        id: value.id,
        providerId: value.providerId,
        marketId: value.marketId,
        observedAt: new Date(value.observedAt),
        fetchedAt: new Date(value.fetchedAt),
        region: value.region,
        gpuModel: value.gpuModel,
        priceType: value.priceType,
        currency: value.currency,
        unit: value.unit,
        price: value.price,
        normalizedPriceUsdPerHour: value.priceUsdPerHour,
        confidenceScore: value.confidenceScore,
        provenanceUrl: value.provenanceUrl,
        metadata: value.metadata,
        rawPayload: value.rawPayload,
      })),
    )
    .onConflictDoNothing();
};

export const upsertInstrumentPricePoint = async (
  instrumentId: string,
  result: MethodologyResult,
  metadata: Record<string, unknown> = {},
) => {
  await db.insert(normalizedPricePoints).values({
    id: crypto.randomUUID(),
    instrumentId,
    symbol: result.symbol,
    observedAt: new Date(result.observedAt),
    priceUsdPerHour: result.priceUsdPerHour,
    confidenceScore: result.confidenceScore,
    sourceCount: result.includedObservationIds.length,
    includedObservationIds: result.includedObservationIds,
    excludedSources: result.excludedSources,
    methodologyVersion: result.methodologyVersion,
    metadata,
  });
};

export const listPublications = async (): Promise<
  OraclePublicationRecord[]
> => {
  const records = await db
    .select()
    .from(oraclePublications)
    .orderBy(desc(oraclePublications.publishedAt))
    .limit(50);
  return records.map((record) => ({
    id: record.id,
    chain: record.chain,
    publisher: record.publisher,
    instrumentSymbol: record.instrumentSymbol,
    txSignature: record.txSignature,
    slot: record.slot ?? undefined,
    status: record.status as OraclePublicationRecord['status'],
    payload: record.payload,
    payloadHash: record.payloadHash,
    publishedAt: record.publishedAt.toISOString(),
    confirmedAt: record.confirmedAt?.toISOString(),
    explorerUrl: record.explorerUrl ?? undefined,
    metadata: record.metadata,
  }));
};

export const insertPublication = async (
  value: typeof oraclePublications.$inferInsert,
) => {
  await db.insert(oraclePublications).values(value);
};
