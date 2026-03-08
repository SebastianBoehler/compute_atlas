import { instrumentSchema } from '@compute-atlas/api-contract';

import { getInstrumentsData } from '../../../../lib/data';
import { apiJson } from '../../../../lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getInstrumentsData();
  instrumentSchema.array().parse(data);
  return apiJson(data);
}
