export type CurrencyCode = 'USD' | 'EUR' | 'GBP';
export type PriceUnit = 'gpu_hour' | 'instance_hour';
export type PriceType = 'spot' | 'on_demand' | 'auction';
export type ProviderCapability =
  | 'fetchMarkets'
  | 'fetchSpotPrices'
  | 'fetchOnDemandPrices'
  | 'normalizeRawObservation'
  | 'healthCheck';

export type RegionScope = 'global' | 'regional';
export type PublicationStatus =
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'failed';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ProviderMarket {
  id: string;
  providerId: string;
  providerSlug: string;
  externalId: string;
  displayName: string;
  region: string;
  gpuModel: string;
  priceType: PriceType;
  currency: CurrencyCode;
  unit: PriceUnit;
  metadata: Record<string, unknown>;
}

export interface RawPriceObservation {
  id: string;
  providerId: string;
  providerSlug: string;
  marketId?: string;
  observedAt: string;
  fetchedAt: string;
  region: string;
  gpuModel: string;
  priceType: PriceType;
  currency: CurrencyCode;
  unit: PriceUnit;
  price: number;
  priceUsdPerHour?: number;
  confidenceScore: number;
  provenanceUrl?: string;
  metadata: Record<string, unknown>;
  rawPayload: Record<string, unknown>;
}

export interface NormalizedInstrument {
  id: string;
  symbol: string;
  name: string;
  gpuModel: string;
  region: string;
  regionScope: RegionScope;
  priceType: PriceType;
  quoteCurrency: CurrencyCode;
  unit: PriceUnit;
  methodologyKey: string;
  metadata: Record<string, unknown>;
}

export interface NormalizedPricePoint {
  id: string;
  instrumentId: string;
  symbol: string;
  observedAt: string;
  priceUsdPerHour: number;
  confidenceScore: number;
  sourceCount: number;
  includedObservationIds: string[];
  excludedSources: string[];
  methodologyVersion: string;
  metadata: Record<string, unknown>;
}

export interface InstrumentMethodologyConfig {
  symbol: string;
  gpuModel: string;
  region: string;
  regionScope: RegionScope;
  priceType: PriceType;
  allowedProviders: string[];
  staleAfterMinutes: number;
  outlierThresholdPercent: number;
  minimumSampleSize: number;
  providerWeights?: Record<string, number>;
}

export interface MethodologyContribution {
  observationId: string;
  providerSlug: string;
  priceUsdPerHour: number;
  weight: number;
  included: boolean;
  reason?: string;
}

export interface MethodologyResult {
  symbol: string;
  observedAt: string;
  priceUsdPerHour: number;
  confidenceScore: number;
  intervalLow: number;
  intervalHigh: number;
  includedObservationIds: string[];
  excludedSources: string[];
  contributions: MethodologyContribution[];
  methodologyVersion: string;
}

export interface ProviderHealth {
  ok: boolean;
  providerSlug: string;
  message: string;
  checkedAt: string;
  metadata?: Record<string, unknown>;
}

export interface OraclePublicationRecord {
  id: string;
  chain: string;
  publisher: string;
  instrumentSymbol: string;
  txSignature: string;
  slot?: number;
  status: PublicationStatus;
  payload: Record<string, unknown>;
  payloadHash: string;
  publishedAt: string;
  confirmedAt?: string;
  explorerUrl?: string;
  metadata: Record<string, unknown>;
}

export interface DevnetVerificationReport {
  rpcUrl: string;
  publisherAddress: string;
  balanceSol: number;
  airdropSignature?: string;
  publishSignature?: string;
  publishSlot?: number;
  status: 'success' | 'failed';
  message: string;
  recentSignatures: Array<{
    signature: string;
    slot: number;
    err: unknown;
    blockTime?: number | null;
  }>;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    generatedAt: string;
    count: number;
  };
}

export interface ApiItemResponse<T> {
  data: T;
  meta: {
    generatedAt: string;
  };
}
