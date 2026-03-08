import crypto from 'node:crypto';

import { getAddMemoInstruction } from '@solana-program/memo';
import {
  appendTransactionMessageInstruction,
  assertIsSendableTransaction,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';

import { getEnv } from '@compute-atlas/config';
import { logger } from '@compute-atlas/observability';
import type { MethodologyResult } from '@compute-atlas/types';

import { getDevnetClients } from './connection';
import { loadPublisherSigner } from './keypair';

export const buildPublicationPayload = (result: MethodologyResult) => {
  const payload = {
    symbol: result.symbol,
    observedAt: result.observedAt,
    priceUsdPerHour: result.priceUsdPerHour,
    confidenceScore: result.confidenceScore,
    intervalLow: result.intervalLow,
    intervalHigh: result.intervalHigh,
    methodologyVersion: result.methodologyVersion,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadHash = crypto
    .createHash('sha256')
    .update(payloadJson)
    .digest('hex');

  return { payload, payloadHash, payloadJson };
};

export const publishMemoIndex = async (result: MethodologyResult) => {
  const env = getEnv();
  const { rpc, sendAndConfirmTransaction } = getDevnetClients();
  const signer = await loadPublisherSigner();
  const { value: latestBlockhash } = await rpc
    .getLatestBlockhash({ commitment: env.SOLANA_COMMITMENT })
    .send();
  const { payload, payloadHash, payloadJson } = buildPublicationPayload(result);

  if (payloadJson.length > env.SOLANA_MEMO_MAX_BYTES) {
    throw new Error(`Memo payload exceeds ${env.SOLANA_MEMO_MAX_BYTES} bytes`);
  }

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(signer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) =>
      appendTransactionMessageInstruction(
        getAddMemoInstruction({ memo: payloadJson }),
        tx,
      ),
  );

  const signedTransaction = await signTransactionMessageWithSigners(message);
  assertIsSendableTransaction(signedTransaction);
  assertIsTransactionWithBlockhashLifetime(signedTransaction);
  const txSignature = getSignatureFromTransaction(signedTransaction).toString();
  await sendAndConfirmTransaction(signedTransaction, {
    commitment: env.SOLANA_COMMITMENT,
  });
  logger.info(
    { txSignature, symbol: result.symbol },
    'Published memo transaction to Solana devnet',
  );

  return {
    txSignature,
    payload,
    payloadHash,
    explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
  };
};
