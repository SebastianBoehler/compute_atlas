import type { Signature } from '@solana/kit';
import { address } from '@solana/kit';

import { getEnv } from '@compute-atlas/config';
import type { DevnetVerificationReport } from '@compute-atlas/types';

import { getBalanceSol, requestAirdropIfLow } from './airdrop';
import { getDevnetClients } from './connection';
import { loadPublisherSigner } from './keypair';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForSignatureConfirmation = async (
  signature: string,
  maxAttempts = 20,
) => {
  const env = getEnv();
  const { rpc } = getDevnetClients();

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { value } = await rpc
      .getSignatureStatuses([signature as Signature], {
        searchTransactionHistory: true,
      })
      .send();

    const status = value[0];
    if (
      status?.confirmationStatus === env.SOLANA_COMMITMENT ||
      status?.confirmationStatus === 'finalized'
    ) {
      return status;
    }
    if (status?.err) {
      throw new Error(
        `Transaction ${signature} failed: ${JSON.stringify(status.err)}`,
      );
    }

    await sleep(1_500);
  }

  throw new Error(`Timed out waiting for confirmation of ${signature}`);
};

export const getRecentSignatures = async (
  accountAddress: string,
  limit = 10,
) => {
  const { rpc } = getDevnetClients();
  const signatures = await rpc
    .getSignaturesForAddress(address(accountAddress), {
      limit,
    })
    .send();

  return signatures.map((entry) => ({
    signature: entry.signature.toString(),
    slot: Number(entry.slot),
    err: entry.err,
    blockTime: entry.blockTime ? Number(entry.blockTime) : null,
  }));
};

export const verifyDevnetConnectivity =
  async (): Promise<DevnetVerificationReport> => {
    const env = getEnv();
    const signer = await loadPublisherSigner();
    const accountAddress = signer.address.toString();
    const { rpc } = getDevnetClients();

    await rpc.getLatestBlockhash({ commitment: env.SOLANA_COMMITMENT }).send();

    const airdrop = await requestAirdropIfLow(accountAddress);
    const balanceSol = await getBalanceSol(accountAddress);
    const recentSignatures = await getRecentSignatures(accountAddress, 10);

    return {
      rpcUrl: env.SOLANA_RPC_URL,
      publisherAddress: accountAddress,
      balanceSol,
      airdropSignature: airdrop.airdropSignature,
      status: 'success',
      message: 'Devnet connectivity verified',
      recentSignatures,
    };
  };
