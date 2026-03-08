import { getPublishSymbols } from '@compute-atlas/config';
import {
  getRecentSignatures,
  requestAirdropIfLow,
  verifyDevnetConnectivity,
} from '@compute-atlas/publisher-solana';

import { runCompute } from './compute';
import { runIngest } from './ingest';
import { runPublish } from './publish';

export const runVerifyDevnet = async () => {
  const connectivity = await verifyDevnetConnectivity();
  const airdrop = await requestAirdropIfLow(connectivity.publisherAddress);
  await runIngest();
  await runCompute();
  const published = await runPublish(getPublishSymbols());
  const recentSignatures = await getRecentSignatures(
    connectivity.publisherAddress,
    10,
  );

  return {
    ...connectivity,
    balanceSol: airdrop.balanceSol,
    airdropSignature: airdrop.airdropSignature ?? connectivity.airdropSignature,
    publishSignature: published[0]?.signature,
    recentSignatures,
    status: 'success' as const,
    message:
      published.length > 0
        ? 'Devnet verification completed'
        : 'Devnet connectivity verified but nothing was published',
  };
};
