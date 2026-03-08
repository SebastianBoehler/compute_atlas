import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createKeyPairSignerFromBytes } from '@solana/kit';
import { Keypair } from '@solana/web3.js';

import { getEnv } from '@compute-atlas/config';

const findWorkspaceRoot = (startDir: string) => {
  let currentDir = startDir;

  while (true) {
    if (existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return startDir;
    }
    currentDir = parentDir;
  }
};

const getKeypairPath = () => {
  const baseDir = process.env.INIT_CWD
    ? findWorkspaceRoot(process.env.INIT_CWD)
    : findWorkspaceRoot(process.cwd());
  return path.resolve(baseDir, getEnv().SOLANA_KEYPAIR_PATH);
};

export const createOrLoadKeypairFile = async () => {
  const keypairPath = getKeypairPath();
  await fs.mkdir(path.dirname(keypairPath), { recursive: true });

  try {
    await fs.access(keypairPath);
  } catch {
    const keypair = Keypair.generate();
    await fs.writeFile(
      keypairPath,
      JSON.stringify(Array.from(keypair.secretKey), null, 2),
      'utf8',
    );
  }

  return keypairPath;
};

export const loadPublisherSigner = async () => {
  const keypairPath = await createOrLoadKeypairFile();
  const raw = JSON.parse(await fs.readFile(keypairPath, 'utf8')) as number[];
  return createKeyPairSignerFromBytes(new Uint8Array(raw));
};
