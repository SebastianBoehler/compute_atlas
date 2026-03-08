import { cache } from 'react';

import { getEnv } from '@compute-atlas/config';
import {
  getHistoryForInstrument,
  getInstrumentBySymbol,
  getLatestPricePoint,
  listInstruments,
  listProviders,
  listPublications,
} from '@compute-atlas/db';
import { instrumentConfigs } from '@compute-atlas/methodology';

import { getCached } from './cache';

const listProvidersRequest = cache(() => listProviders());
const listInstrumentsRequest = cache(() => listInstruments());
const listPublicationsRequest = cache(() => listPublications());
const getInstrumentBySymbolRequest = cache((symbol: string) =>
  getInstrumentBySymbol(symbol),
);
const getLatestPricePointRequest = cache((symbol: string) =>
  getLatestPricePoint(symbol),
);
const getHistoryForInstrumentRequest = cache((symbol: string, hours: number) =>
  getHistoryForInstrument(symbol, hours),
);

const serializeProvider = (
  provider: Awaited<ReturnType<typeof listProviders>>[number],
) => ({
  ...provider,
  createdAt: provider.createdAt.toISOString(),
  updatedAt: provider.updatedAt.toISOString(),
});

const serializePricePoint = (
  point: Awaited<ReturnType<typeof getHistoryForInstrument>>[number],
) => ({
  ...point,
  observedAt: point.observedAt.toISOString(),
  createdAt: point.createdAt.toISOString(),
});

const rangeMap = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
  '1y': 24 * 365,
} as const;

export const getDashboardSummary = async () => {
  const [providers, instruments, publications] = await Promise.all([
    listProvidersRequest(),
    listInstrumentsRequest(),
    listPublicationsRequest(),
  ]);
  return {
    providerCount: providers.length,
    instrumentCount: instruments.length,
    publicationCount: publications.length,
  };
};

export const getProvidersData = () =>
  getCached('providers', getEnv().API_CACHE_TTL_MS, async () =>
    (await listProvidersRequest()).map(serializeProvider),
  );

export const getInstrumentsData = () =>
  getCached('instruments', getEnv().API_CACHE_TTL_MS, () =>
    listInstrumentsRequest(),
  );

export const getInstrumentLatest = (symbol: string) =>
  getCached(`latest:${symbol}`, getEnv().API_CACHE_TTL_MS, async () => {
    const latest = await getLatestPricePointRequest(symbol);
    return latest ? serializePricePoint(latest) : null;
  });

export const getInstrumentHistory = (
  symbol: string,
  range: keyof typeof rangeMap,
) =>
  getCached(`history:${symbol}:${range}`, getEnv().API_CACHE_TTL_MS, async () =>
    (await getHistoryForInstrumentRequest(symbol, rangeMap[range])).map(
      serializePricePoint,
    ),
  );

export const getMethodologyReport = async () => {
  const entries = await Promise.all(
    Object.entries(instrumentConfigs).map(async ([symbol, config]) => {
      const latest = await getLatestPricePointRequest(symbol);
      return {
        symbol,
        methodologyVersion: latest?.methodologyVersion ?? '2026-03-mvp',
        config,
        latest: latest
          ? {
              priceUsdPerHour: latest.priceUsdPerHour,
              confidenceScore: latest.confidenceScore,
              intervalLow: Math.max(latest.priceUsdPerHour - 0.05, 0),
              intervalHigh: latest.priceUsdPerHour + 0.05,
              sourceCount: latest.sourceCount,
              includedObservationIds: latest.includedObservationIds,
              excludedSources: latest.excludedSources,
            }
          : null,
      };
    }),
  );

  return entries;
};

export const getPublicationExplorerData = () =>
  getCached('publications', getEnv().API_CACHE_TTL_MS, () =>
    listPublicationsRequest(),
  );

export const getInstrumentPageData = async (
  symbol: string,
  range: keyof typeof rangeMap = '30d',
) => {
  const [instrument, latest, history] = await Promise.all([
    getInstrumentBySymbolRequest(symbol),
    getInstrumentLatest(symbol),
    getInstrumentHistory(symbol, range),
  ]);

  return {
    instrument,
    latest,
    history,
  };
};
