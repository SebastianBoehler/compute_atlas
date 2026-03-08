import 'dotenv/config';

import { getPublishSymbols } from '@compute-atlas/config';
import {
  getBalanceSol,
  loadPublisherSigner,
} from '@compute-atlas/publisher-solana';

import { runCompute } from './commands/compute';
import { runIngest } from './commands/ingest';
import { runPipeline } from './commands/pipeline';
import { runPublish } from './commands/publish';
import { runVerifyDevnet } from './commands/verify-devnet';

const main = async () => {
  const command = process.argv[2];

  switch (command) {
    case 'dev':
    case 'pipeline': {
      console.log(JSON.stringify(await runPipeline(), null, 2));
      break;
    }
    case 'ingest': {
      await runIngest();
      console.log('Ingestion complete');
      break;
    }
    case 'compute': {
      const result = await runCompute();
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'publish': {
      const result = await runPublish(getPublishSymbols());
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'verify-devnet': {
      const report = await runVerifyDevnet();
      console.log(JSON.stringify(report, null, 2));
      break;
    }
    case 'solana:keypair:create': {
      const signer = await loadPublisherSigner();
      console.log(signer.address.toString());
      break;
    }
    case 'solana:keypair:balance': {
      const signer = await loadPublisherSigner();
      const balance = await getBalanceSol(signer.address.toString());
      console.log(
        `${signer.address.toString()} balance: ${balance.toFixed(4)} SOL`,
      );
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
