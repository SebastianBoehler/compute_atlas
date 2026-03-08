'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type ChartPoint = {
  observedAt: string;
  priceUsdPerHour: number;
};

export function PriceChart({ data }: { data: ChartPoint[] }) {
  return (
    <div aria-label="Historical price chart" className="chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#167a72" stopOpacity={0.38} />
              <stop offset="95%" stopColor="#167a72" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(26, 32, 41, 0.09)"
          />
          <XAxis
            dataKey="observedAt"
            tickFormatter={(value: string) =>
              dateFormatter.format(new Date(value))
            }
            stroke="#5d6b79"
          />
          <YAxis stroke="#5d6b79" />
          <Tooltip
            formatter={(value: number) => [
              priceFormatter.format(value),
              'USD / GPU hr',
            ]}
            labelFormatter={(label) =>
              dateTimeFormatter.format(new Date(label))
            }
          />
          <Area
            type="monotone"
            dataKey="priceUsdPerHour"
            stroke="#167a72"
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
