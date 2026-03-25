import type { ProviderAdapter } from '@compute-atlas/provider-sdk';
import type { ProviderMarket, RawPriceObservation } from '@compute-atlas/types';

import {
  isSupportedAzureRetailItem,
  resolveAzureGpuDetails,
  resolveAzurePriceType,
} from './catalog';
import { fetchAzureRetailItems } from './client';

const providerId = 'provider-azure';
const providerSlug = 'azure';
const provenanceUrl = 'https://prices.azure.com/api/retail/prices';

interface AzurePriceSnapshot {
  markets: ProviderMarket[];
  onDemandPrices: RawPriceObservation[];
  spotPrices: RawPriceObservation[];
}

const createAzureSnapshot = async (): Promise<AzurePriceSnapshot> => {
  const fetchedAt = new Date().toISOString();
  const items = (await fetchAzureRetailItems()).filter(
    isSupportedAzureRetailItem,
  );
  const markets = new Map<string, ProviderMarket>();
  const spotPrices: RawPriceObservation[] = [];
  const onDemandPrices: RawPriceObservation[] = [];

  for (const item of items) {
    const gpuDetails = resolveAzureGpuDetails(item.armSkuName);
    if (!gpuDetails) {
      continue;
    }

    const priceType = resolveAzurePriceType(item.meterName, item.skuName);
    const marketId = [
      'market',
      providerSlug,
      item.armSkuName.toLowerCase(),
      item.armRegionName.toLowerCase(),
      priceType,
    ].join('-');

    markets.set(marketId, {
      id: marketId,
      providerId,
      providerSlug,
      externalId: `${item.skuId}:${item.armRegionName}:${priceType}`,
      displayName: `${gpuDetails.gpuModel} ${item.armRegionName} ${priceType.replace('_', ' ')} (${item.armSkuName})`,
      region: item.armRegionName,
      gpuModel: gpuDetails.gpuModel,
      priceType,
      currency: 'USD',
      unit: 'instance_hour',
      metadata: {
        armSkuName: item.armSkuName,
        gpuCount: gpuDetails.gpuCount,
        isPrimaryMeterRegion: item.isPrimaryMeterRegion,
        location: item.location,
        meterId: item.meterId,
        meterName: item.meterName,
        productName: item.productName,
        skuName: item.skuName,
        source: 'azure-retail-api',
      },
    });

    const observation = {
      id: crypto.randomUUID(),
      providerId,
      providerSlug,
      marketId,
      observedAt: fetchedAt,
      fetchedAt,
      region: item.armRegionName,
      gpuModel: gpuDetails.gpuModel,
      priceType,
      currency: 'USD' as const,
      unit: 'instance_hour' as const,
      price: item.retailPrice,
      confidenceScore: 0.94,
      provenanceUrl,
      metadata: {
        armSkuName: item.armSkuName,
        gpuCount: gpuDetails.gpuCount,
        isPrimaryMeterRegion: item.isPrimaryMeterRegion,
        meterId: item.meterId,
        meterName: item.meterName,
        productName: item.productName,
        skuName: item.skuName,
        source: 'azure-retail-api',
      },
      rawPayload: item as unknown as Record<string, unknown>,
    };

    if (priceType === 'spot') {
      spotPrices.push(observation);
    } else {
      onDemandPrices.push(observation);
    }
  }

  return {
    markets: [...markets.values()],
    spotPrices,
    onDemandPrices,
  };
};

let snapshotPromise: Promise<AzurePriceSnapshot> | undefined;

const loadAzureSnapshot = async () => {
  if (!snapshotPromise) {
    snapshotPromise = createAzureSnapshot().finally(() => {
      snapshotPromise = undefined;
    });
  }

  return snapshotPromise;
};

export const azureLiveAdapter: ProviderAdapter = {
  id: providerId,
  slug: providerSlug,
  name: 'Microsoft Azure',
  capabilities: [
    'fetchMarkets',
    'fetchSpotPrices',
    'fetchOnDemandPrices',
    'normalizeRawObservation',
    'healthCheck',
  ],
  fetchMarkets: async () => (await loadAzureSnapshot()).markets,
  fetchSpotPrices: async () => (await loadAzureSnapshot()).spotPrices,
  fetchOnDemandPrices: async () => (await loadAzureSnapshot()).onDemandPrices,
  normalizeRawObservation: async (rawObservation: RawPriceObservation) =>
    rawObservation,
  healthCheck: async () => {
    const snapshot = await loadAzureSnapshot();

    return {
      ok: snapshot.markets.length > 0,
      providerSlug,
      message: `Fetched ${snapshot.markets.length} Azure GPU markets`,
      checkedAt: new Date().toISOString(),
      metadata: {
        markets: snapshot.markets.length,
        onDemandPrices: snapshot.onDemandPrices.length,
        spotPrices: snapshot.spotPrices.length,
      },
    };
  },
};
