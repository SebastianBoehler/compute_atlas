import {
  airdropFactory,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  sendAndConfirmTransactionFactory,
} from '@solana/kit';

import { getEnv } from '@compute-atlas/config';

export const getDevnetClients = () => {
  const env = getEnv();
  const rpc = createSolanaRpc(env.SOLANA_RPC_URL);
  const rpcSubscriptions = createSolanaRpcSubscriptions(env.SOLANA_RPC_WS_URL);
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions,
  });
  const requestAirdrop = airdropFactory({ rpc, rpcSubscriptions });

  return {
    rpc,
    rpcSubscriptions,
    sendAndConfirmTransaction,
    requestAirdrop,
  };
};
