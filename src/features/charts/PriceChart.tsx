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

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  color = '#3b82f6',
}) => {
  const chartData = data.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price,
    fullDate: new Date(timestamp).toLocaleString(),
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    return `$${value.toFixed(4)}`;
  };

  const formatTooltipPrice = (value: number) => {
    return <FormatPrice value={value} />;
  };

  const minPrice = Math.min(...data.map((d) => d[1]));
  const maxPrice = Math.max(...data.map((d) => d[1]));
  const priceChange =
    ((data[data.length - 1][1] - data[0][1]) / data[0][1]) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-500">From</div>
          <div className="font-semibold">
            <FormatPrice value={minPrice} />
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">To</div>
          <div className="font-semibold">
            <FormatPrice value={maxPrice} />
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Change</div>
          <div
            className={`font-semibold ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)}%
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

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={['auto', 'auto']}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#111827', fontWeight: '600' }}
              formatter={(value: number) => [
                formatTooltipPrice(value),
                'Price',
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
