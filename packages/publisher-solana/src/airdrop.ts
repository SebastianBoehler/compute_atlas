import { address, lamports } from '@solana/kit';

import { getEnv } from '@compute-atlas/config';

import { getDevnetClients } from './connection';

const LAMPORTS_PER_SOL = 1_000_000_000;

export const getBalanceSol = async (accountAddress: string) => {
  const { rpc } = getDevnetClients();
  const result = await rpc.getBalance(address(accountAddress)).send();
  return Number(result.value) / LAMPORTS_PER_SOL;
};

export const requestAirdropIfLow = async (accountAddress: string) => {
  const env = getEnv();
  const { requestAirdrop, rpc } = getDevnetClients();
  const currentBalance = await getBalanceSol(accountAddress);

  if (currentBalance >= env.SOLANA_AIRDROP_MIN_BALANCE_SOL) {
    return {
      balanceSol: currentBalance,
      airdropSignature: undefined,
    };
  }

  const neededSol = Math.max(
    env.SOLANA_AIRDROP_TARGET_BALANCE_SOL - currentBalance,
    0.1,
  );
  const lamportAmount = lamports(
    BigInt(Math.ceil(neededSol * LAMPORTS_PER_SOL)),
  );
  let signature: string;

  try {
    const requested = await requestAirdrop({
      recipientAddress: address(accountAddress),
      lamports: lamportAmount,
      commitment: env.SOLANA_COMMITMENT,
    });
    signature = requested.toString();
  } catch {
    const requested = await rpc
      .requestAirdrop(address(accountAddress), lamportAmount)
      .send();
    signature = requested.toString();
  }

  const updatedBalance = await getBalanceSol(accountAddress);

  return {
    balanceSol: updatedBalance,
    airdropSignature: signature,
  };
};
