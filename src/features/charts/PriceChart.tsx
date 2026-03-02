import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';

interface PriceChartProps {
  data: [number, number][];
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: {
      date: string;
      price: number;
      fullDate: string;
    };
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-[var(--bg-card)] p-3 border border-[var(--border-color)] rounded-lg shadow-lg">
        <p className="text-[var(--text-secondary)] mb-1">{label}</p>
        <p className="font-semibold text-[var(--text-primary)]">
          Price: <FormatPrice value={payload[0].value} />
        </p>
      </div>
    );
  }
  return null;
};

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  color = '#3b82f6',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-[var(--bg-card)] rounded-lg border-2 border-dashed border-[var(--border-color)]">
        <p className="text-[var(--text-secondary)]">No chart data available</p>
      </div>
    );
  }

  const chartData = data.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price,
    fullDate: new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    }),
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    return `$${value.toFixed(4)}`;
  };

  const prices = data.map((d) => d[1]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const priceChange = firstPrice
    ? ((lastPrice - firstPrice) / firstPrice) * 100
    : 0;
  const isPositive = priceChange >= 0;

  const pricePadding = (maxPrice - minPrice) * 0.05;
  const yDomainMin = Math.max(0, minPrice - pricePadding);
  const yDomainMax = maxPrice + pricePadding;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
        <div>
          <div className="text-sm text-[var(--text-secondary)]">From</div>
          <div className="font-semibold text-[var(--text-primary)]">
            <FormatPrice value={minPrice} />
          </div>
          <div className="text-xs text-[var(--text-secondary)] opacity-75">
            {new Date(data[0][0]).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-[var(--text-secondary)]">To</div>
          <div className="font-semibold text-[var(--text-primary)]">
            <FormatPrice value={maxPrice} />
          </div>
          <div className="text-xs text-[var(--text-secondary)] opacity-75">
            {new Date(data[data.length - 1][0]).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-[var(--text-secondary)]">Change</div>
          <div
            className={`font-semibold ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)}%
          </div>
          <div className="text-xs text-[var(--text-secondary)] opacity-75">
            {isPositive ? '▲' : '▼'} over period
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`gradient-${color}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              tickLine={{ stroke: 'var(--border-color)' }}
              axisLine={{ stroke: 'var(--border-color)' }}
              interval="preserveStartEnd"
              minTickGap={50}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              tickLine={{ stroke: 'var(--border-color)' }}
              axisLine={{ stroke: 'var(--border-color)' }}
              domain={[yDomainMin, yDomainMax]}
              width={80}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
              isAnimationActive={true}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
