import type { PriceType } from '@compute-atlas/types';

export interface AzureRetailPriceItem {
  armRegionName: string;
  armSkuName: string;
  currencyCode: string;
  isPrimaryMeterRegion: boolean;
  location: string;
  meterId: string;
  meterName: string;
  productName: string;
  retailPrice: number;
  serviceName: string;
  skuId: string;
  skuName: string;
  type: string;
  unitOfMeasure: string;
}

export const azureGpuSearchTerms = ['H100', 'H200', 'A100'] as const;

const gpuCountMatchers: Array<{
  pattern: RegExp;
  gpuCount: number;
  gpuModel: 'H100' | 'H200' | 'A100';
}> = [
  { pattern: /^Standard_NC24ads_A100_v4$/i, gpuCount: 1, gpuModel: 'A100' },
  { pattern: /^Standard_NC48ads_A100_v4$/i, gpuCount: 2, gpuModel: 'A100' },
  { pattern: /^Standard_NC96ads_A100_v4$/i, gpuCount: 4, gpuModel: 'A100' },
  { pattern: /^Standard_ND96.*A100_v4$/i, gpuCount: 8, gpuModel: 'A100' },
  { pattern: /^Standard_NC40ads_H100_v5$/i, gpuCount: 1, gpuModel: 'H100' },
  { pattern: /^Standard_NC80adis_H100_v5$/i, gpuCount: 2, gpuModel: 'H100' },
  { pattern: /^Standard_ND96.*H100_v5$/i, gpuCount: 8, gpuModel: 'H100' },
  { pattern: /^Standard_ND96isr_H200_v5$/i, gpuCount: 8, gpuModel: 'H200' },
];

export const resolveAzureGpuDetails = (
  armSkuName: string,
): { gpuModel: 'H100' | 'H200' | 'A100'; gpuCount: number } | null => {
  for (const matcher of gpuCountMatchers) {
    if (matcher.pattern.test(armSkuName)) {
      return {
        gpuModel: matcher.gpuModel,
        gpuCount: matcher.gpuCount,
      };
    }
  }

  return null;
};

export const resolveAzurePriceType = (
  meterName: string,
  skuName: string,
): PriceType => {
  const normalized = `${meterName} ${skuName}`.toLowerCase();
  if (normalized.includes('spot') || normalized.includes('low priority')) {
    return 'spot';
  }

  return 'on_demand';
};

export const isSupportedAzureRetailItem = (
  item: AzureRetailPriceItem,
): boolean => {
  if (item.serviceName !== 'Virtual Machines') {
    return false;
  }

  if (item.currencyCode !== 'USD') {
    return false;
  }

  if (item.type !== 'Consumption') {
    return false;
  }

  if (item.unitOfMeasure !== '1 Hour') {
    return false;
  }

  if (item.retailPrice <= 0) {
    return false;
  }

  if (item.productName.toLowerCase().includes('windows')) {
    return false;
  }

  return resolveAzureGpuDetails(item.armSkuName) !== null;
};
