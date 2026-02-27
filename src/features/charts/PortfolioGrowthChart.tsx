import React, { useMemo, useState } from 'react';
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
import type { Transaction } from '../portfolio/types';

interface PortfolioGrowthChartProps {
  transactions: Transaction[];
  currentValues: Array<{
    coinId: string;
    value: number;
  }>;
}

interface TimePeriod {
  label: string;
  days: number;
}

const periods: TimePeriod[] = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'ALL', days: 9999 },
];

interface ChartDataPoint {
  date: string;
  timestamp: number;
  value: number;
  invested: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length > 0) {
    const value = payload.find((p) => p.dataKey === 'value')?.value || 0;
    const invested = payload.find((p) => p.dataKey === 'invested')?.value || 0;
    const profit = value - invested;
    const profitPercentage = invested > 0 ? (profit / invested) * 100 : 0;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-gray-600 mb-2">{label}</p>
        <p className="text-gray-600">
          Value: <FormatPrice value={value} />
        </p>
        <p className="text-gray-600">
          Invested: <FormatPrice value={invested} />
        </p>
        <p
          className={`font-semibold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          P&L: {profit >= 0 ? '+' : '-'}
          <FormatPrice value={Math.abs(profit)} />
          <span className="text-sm ml-1">
            ({profitPercentage >= 0 ? '+' : ''}
            {profitPercentage.toFixed(2)}%)
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const PortfolioGrowthChart: React.FC<PortfolioGrowthChartProps> = ({
  transactions,
  currentValues,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(periods[1]); // 1M по умолчанию

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];

    const sortedTx = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - selectedPeriod.days);
    const startTimestamp = startDate.getTime();

    const dailyData = new Map<
      string,
      { buys: number; sells: number; date: Date }
    >();

    sortedTx.forEach((tx) => {
      const date = new Date(tx.date);
      if (selectedPeriod.days !== 9999 && date.getTime() < startTimestamp)
        return;

      const dateKey = date.toISOString().split('T')[0];
      const existing = dailyData.get(dateKey) || { buys: 0, sells: 0, date };

      if (tx.type === 'buy') {
        existing.buys += tx.total;
      } else {
        existing.sells += tx.total;
      }

      dailyData.set(dateKey, existing);
    });

    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    if (!dailyData.has(todayKey)) {
      dailyData.set(todayKey, { buys: 0, sells: 0, date: today });
    }

    const sortedDays = Array.from(dailyData.entries())
      .map(([dateKey, data]) => ({
        dateKey,
        ...data,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    let cumulativeInvested = 0;
    let cumulativeValue = 0;
    const result: ChartDataPoint[] = [];

    sortedDays.forEach((day) => {
      cumulativeInvested += day.buys - day.sells;

      if (day.dateKey === todayKey) {
        cumulativeValue = currentValues.reduce(
          (sum, item) => sum + item.value,
          0
        );
      } else {
        cumulativeValue = cumulativeInvested;
      }

      result.push({
        date: day.date.toLocaleDateString(),
        timestamp: day.date.getTime(),
        value: cumulativeValue,
        invested: cumulativeInvested,
      });
    });

    return result;
  }, [transactions, currentValues, selectedPeriod]);

  if (transactions.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-400">No transaction history to display</p>
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value}`;
  };

  const minValue = Math.min(
    ...chartData.map((d) => Math.min(d.value, d.invested))
  );
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.value, d.invested))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Portfolio Growth
        </h2>
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period.label}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod.label === period.label
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval="preserveStartEnd"
              minTickGap={50}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={[minValue * 0.95, maxValue * 1.05]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="invested"
              stroke="#6b7280"
              strokeWidth={2}
              fill="url(#investedGradient)"
              name="Invested"
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#valueGradient)"
              name="Portfolio Value"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-sm text-gray-600">Portfolio Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full" />
          <span className="text-sm text-gray-600">Total Invested</span>
        </div>
      </div>
    </div>
  );
};
