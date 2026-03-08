import { pricePointSchema } from '@compute-atlas/api-contract';

import { getInstrumentHistory } from '../../../../../../lib/data';
import { apiJson } from '../../../../../../lib/http';
import { parseRange } from '../../../../../../lib/ranges';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await context.params;
  const { searchParams } = new URL(request.url);
  const range = parseRange(searchParams.get('range'));
  const data = await getInstrumentHistory(symbol, range);
  pricePointSchema.array().parse(data);
  return apiJson(data);
}
