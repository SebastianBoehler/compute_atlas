import { describe, expect, it } from 'vitest';

import type { RawPriceObservation } from '@compute-atlas/types';

import { instrumentConfigs } from './config';
import { computeIndex } from './index-calc';
import { normalizeObservation } from './normalize';

const baseObservation = (
  overrides: Partial<RawPriceObservation>,
): RawPriceObservation => ({
  id: crypto.randomUUID(),
  providerId: 'provider-1',
  providerSlug: 'aws',
  observedAt: '2026-03-08T12:00:00.000Z',
  fetchedAt: '2026-03-08T12:05:00.000Z',
  region: 'us-east-1',
  gpuModel: 'H100',
  priceType: 'spot',
  currency: 'USD',
  unit: 'gpu_hour',
  price: 2.5,
  priceUsdPerHour: 2.5,
  confidenceScore: 0.9,
  metadata: {},
  rawPayload: {},
  ...overrides,
});

describe('normalizeObservation', () => {
  it('converts instance hour pricing into gpu hour pricing', () => {
    const normalized = normalizeObservation(
      baseObservation({
        unit: 'instance_hour',
        price: 16,
        metadata: { gpuCount: 8 },
      }),
    );

    expect(normalized.priceUsdPerHour).toBe(2);
  });
});

describe('computeIndex', () => {
  it('filters outliers and computes a robust median', () => {
    const config = instrumentConfigs.H100_GLOBAL_SPOT;
    const result = computeIndex(config, [
      baseObservation({
        providerId: 'provider-aws',
        providerSlug: 'aws',
        price: 2.5,
      }),
      baseObservation({
        providerId: 'provider-gcp',
        providerSlug: 'gcp',
        region: 'eu-west4',
        price: 2.6,
      }),
      baseObservation({
        providerId: 'provider-runpod',
        providerSlug: 'runpod',
        region: 'global',
        price: 2.4,
      }),
      baseObservation({
        providerId: 'provider-custom',
        providerSlug: 'custom-json',
        region: 'eu-central',
        price: 9.9,
      }),
    ]);

    expect(result).not.toBeNull();
    expect(result?.priceUsdPerHour).toBeGreaterThan(2.4);
    expect(result?.priceUsdPerHour).toBeLessThan(2.7);
    expect(
      result?.excludedSources.some((source) => source.includes('outlier')),
    ).toBe(true);
  });
});
