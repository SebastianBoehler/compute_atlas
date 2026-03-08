import { getPipelineSymbols, getPublishSymbols } from '@compute-atlas/config';

import { runCompute } from './compute';
import { runIngest } from './ingest';
import { runPublish } from './publish';

export const runPipeline = async () => {
  await runIngest();
  const computed = await runCompute(getPipelineSymbols());
  const published = await runPublish(getPublishSymbols());

  return {
    computed,
    published,
  };
};
