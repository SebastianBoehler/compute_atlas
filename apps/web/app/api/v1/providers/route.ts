import { providerSchema } from '@compute-atlas/api-contract';

import { getProvidersData } from '../../../../lib/data';
import { apiJson } from '../../../../lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getProvidersData();
  providerSchema.array().parse(data);
  return apiJson(data);
}
