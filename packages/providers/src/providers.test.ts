import { describe, expect, it } from 'vitest';

import { resolveAzureGpuDetails, resolveAzurePriceType } from './azure/catalog';

describe('azure provider helpers', () => {
  it('maps supported sku names to gpu model and count', () => {
    expect(resolveAzureGpuDetails('Standard_NC40ads_H100_v5')).toEqual({
      gpuModel: 'H100',
      gpuCount: 1,
    });
    expect(resolveAzureGpuDetails('Standard_ND96ams_A100_v4')).toEqual({
      gpuModel: 'A100',
      gpuCount: 8,
    });
    expect(resolveAzureGpuDetails('Standard_ND96isr_H200_v5')).toEqual({
      gpuModel: 'H200',
      gpuCount: 8,
    });
  });

  it('classifies spot-style Azure meters', () => {
    expect(
      resolveAzurePriceType('ND96isrH100v5 Spot', 'ND96isrH100v5 Spot'),
    ).toBe('spot');
    expect(resolveAzurePriceType('NC40adsH100v5', 'NC40adsH100v5')).toBe(
      'on_demand',
    );
  });
});
