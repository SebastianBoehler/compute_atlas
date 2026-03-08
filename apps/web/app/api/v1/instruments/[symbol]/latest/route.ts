import { pricePointSchema } from '@compute-atlas/api-contract';

import { getInstrumentLatest } from '../../../../../../lib/data';
import { apiJson } from '../../../../../../lib/http';

export const dynamic = 'force-dynamic';

export async function GET(
  _: Request,
  context: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await context.params;
  const data = await getInstrumentLatest(symbol);
  pricePointSchema.nullable().parse(data);
  return apiJson(data);
}
