import Link from 'next/link';

import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Separator } from './ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  signDisplay: 'always',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export interface PriceBoardRow {
  changePercent: number | null;
  confidenceScore: number | null;
  gpuModel: string;
  observedAt: string | null;
  priceType: string;
  sourceCount: number | null;
  symbol: string;
  latestPrice: number | null;
}

const formatObservedAt = (value: string | null) => {
  if (!value) {
    return 'No data';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

const formatChange = (value: number | null) => {
  if (value === null || Number.isNaN(value)) {
    return 'n/a';
  }

  return percentFormatter.format(value);
};

const getChangeVariant = (value: number | null) => {
  if (value === null) {
    return 'outline' as const;
  }

  return value >= 0 ? ('default' as const) : ('secondary' as const);
};

export function PriceBoard({ rows }: { rows: PriceBoardRow[] }) {
  const latestTimestamp = rows
    .map((row) => row.observedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">GPU price board</Badge>
              <Badge variant="secondary">Azure live</Badge>
              <Badge variant="outline">{rows.length} tickers</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Compute Atlas
              </h1>
              <p className="text-sm text-muted-foreground">
                Straight view of current GPU rates and 30 day movement.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground sm:items-end">
            <span>Updated {formatObservedAt(latestTimestamp ?? null)}</span>
            <Link
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href="/sources"
            >
              Source coverage
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <Card key={row.symbol} size="sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle>{row.symbol}</CardTitle>
                  <CardDescription>{row.gpuModel}</CardDescription>
                </div>
                <Badge
                  variant={row.priceType === 'spot' ? 'secondary' : 'outline'}
                >
                  {row.priceType === 'spot' ? 'Spot' : 'On-demand'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-semibold tracking-tight">
                    {row.latestPrice === null
                      ? 'n/a'
                      : priceFormatter.format(row.latestPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    USD / GPU hr
                  </span>
                </div>
                <Badge variant={getChangeVariant(row.changePercent)}>
                  {formatChange(row.changePercent)}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Sources</span>
                  <span className="font-medium">
                    {row.sourceCount === null ? 'n/a' : row.sourceCount}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">
                    {row.confidenceScore === null
                      ? 'n/a'
                      : `${Math.round(row.confidenceScore * 100)}%`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>All tickers</CardTitle>
          <CardDescription>Sorted by current USD per GPU hour.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>GPU</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">30d</TableHead>
                <TableHead className="text-right">Sources</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell className="font-medium">{row.symbol}</TableCell>
                  <TableCell>{row.gpuModel}</TableCell>
                  <TableCell>{row.priceType}</TableCell>
                  <TableCell className="text-right">
                    {row.latestPrice === null
                      ? 'n/a'
                      : priceFormatter.format(row.latestPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatChange(row.changePercent)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.sourceCount === null ? 'n/a' : row.sourceCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
