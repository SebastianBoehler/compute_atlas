import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href }, children),
}));

vi.mock('../lib/data', () => ({
  getDashboardSummary: vi.fn(async () => ({
    providerCount: 7,
    instrumentCount: 3,
    publicationCount: 2,
  })),
  getInstrumentsData: vi.fn(async () => [
    {
      id: 'instrument-1',
      symbol: 'H100_GLOBAL_SPOT',
      gpuModel: 'H100',
      region: 'global',
      priceType: 'spot',
    },
  ]),
  getPublicationExplorerData: vi.fn(async () => [
    {
      id: 'publication-1',
      instrumentSymbol: 'H100_GLOBAL_SPOT',
      txSignature: 'signature-1',
      status: 'confirmed',
    },
  ]),
}));

describe('HomePage', () => {
  it('renders summary content', async () => {
    const { default: HomePage } = await import('./page');
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain('Transparent GPU price discovery');
    expect(html).toContain('H100_GLOBAL_SPOT');
  });
});
