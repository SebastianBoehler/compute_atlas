import { getLatestPricePoint, insertPublication } from '@compute-atlas/db';
import { instrumentConfigs } from '@compute-atlas/methodology';
import { logger } from '@compute-atlas/observability';
import {
  loadPublisherSigner,
  publishMemoIndex,
  requestAirdropIfLow,
  waitForSignatureConfirmation,
} from '@compute-atlas/publisher-solana';
import type { MethodologyResult } from '@compute-atlas/types';

export const runPublish = async (symbols: string[]) => {
  const signer = await loadPublisherSigner();
  await requestAirdropIfLow(signer.address.toString());
  const published = [];

  for (const symbol of symbols) {
    const latest = await getLatestPricePoint(symbol);
    if (!latest) {
      logger.warn(
        { symbol },
        'Skipping publication because no normalized point exists',
      );
      continue;
    }

    const config = instrumentConfigs[symbol];
    const result: MethodologyResult = {
      symbol,
      observedAt: latest.observedAt.toISOString(),
      priceUsdPerHour: latest.priceUsdPerHour,
      confidenceScore: latest.confidenceScore,
      intervalLow: Math.max(latest.priceUsdPerHour - 0.05, 0),
      intervalHigh: latest.priceUsdPerHour + 0.05,
      includedObservationIds: latest.includedObservationIds,
      excludedSources: latest.excludedSources,
      contributions: [],
      methodologyVersion: latest.methodologyVersion,
    };

    const publishedResult = await publishMemoIndex(result);
    const confirmedStatus = await waitForSignatureConfirmation(
      publishedResult.txSignature,
    );

    await insertPublication({
      id: crypto.randomUUID(),
      chain: 'solana-devnet',
      publisher: signer.address.toString(),
      instrumentSymbol: symbol,
      txSignature: publishedResult.txSignature,
      slot: confirmedStatus.slot ? Number(confirmedStatus.slot) : null,
      status: confirmedStatus.err ? 'failed' : 'confirmed',
      payload: publishedResult.payload,
      payloadHash: publishedResult.payloadHash,
      publishedAt: new Date(result.observedAt),
      confirmedAt: new Date(),
      explorerUrl: publishedResult.explorerUrl,
      metadata: {
        methodologyRegion: config?.region ?? 'global',
      },
    });

    published.push({
      symbol,
      signature: publishedResult.txSignature,
    });
  }

  return published;
};
