import { z } from 'zod';

export const providerSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  isActive: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
  updatedAt: z.string(),
});

export const instrumentSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  gpuModel: z.string(),
  region: z.string(),
  priceType: z.string(),
  quoteCurrency: z.string(),
  unit: z.string(),
  methodologyKey: z.string(),
  metadata: z.record(z.string(), z.unknown()),
});

export const pricePointSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  observedAt: z.string(),
  priceUsdPerHour: z.number(),
  confidenceScore: z.number(),
  sourceCount: z.number(),
  methodologyVersion: z.string(),
  metadata: z.record(z.string(), z.unknown()),
});

export const publicationSchema = z.object({
  id: z.string(),
  chain: z.string(),
  publisher: z.string(),
  instrumentSymbol: z.string(),
  txSignature: z.string(),
  slot: z.number().nullable(),
  status: z.string(),
  payloadHash: z.string(),
  publishedAt: z.string(),
  confirmedAt: z.string().nullable(),
  explorerUrl: z.string().nullable(),
  payload: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()),
});

export const methodologyReportSchema = z.object({
  symbol: z.string(),
  methodologyVersion: z.string(),
  config: z.record(z.string(), z.unknown()),
  latest: z
    .object({
      priceUsdPerHour: z.number(),
      confidenceScore: z.number(),
      intervalLow: z.number(),
      intervalHigh: z.number(),
      sourceCount: z.number(),
      includedObservationIds: z.array(z.string()),
      excludedSources: z.array(z.string()),
    })
    .nullable(),
});
