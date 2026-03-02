import React, { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';

interface DCAResult {
  totalInvested: number;
  totalCoins: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  simulations: Array<{
    date: string;
    invested: number;
    coins: number;
    value: number;
  }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: {
      date: string;
      invested: number;
      value: number;
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
    const invested = payload.find((p) => p.dataKey === 'invested')?.value || 0;
    const value = payload.find((p) => p.dataKey === 'value')?.value || 0;

    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg p-3">
        <p className="text-[var(--text-secondary)] mb-1">{label}</p>
        <p className="text-[var(--text-secondary)]">
          Invested: <FormatPrice value={invested} />
        </p>
        <p className="text-[var(--text-secondary)]">
          Value: <FormatPrice value={value} />
        </p>
        <p
          className={`text-sm font-medium ${value >= invested ? 'text-green-500' : 'text-red-500'}`}
        >
          P&L: {value >= invested ? '+' : '-'}
          <FormatPrice value={Math.abs(value - invested)} />
        </p>
      </div>
    );
  }
  return null;
};

export const DCACalculator: React.FC = () => {
  const [coinPrice, setCoinPrice] = useState<string>('50000');
  const [monthlyAmount, setMonthlyAmount] = useState<string>('1000');
  const [months, setMonths] = useState<string>('12');
  const [priceGrowth, setPriceGrowth] = useState<string>('10');
  const [result, setResult] = useState<DCAResult | null>(null);

  const calculateDCA = () => {
    const monthly = parseFloat(monthlyAmount) || 0;
    const monthsNum = parseInt(months) || 0;
    const startPrice = parseFloat(coinPrice) || 0;
    const growthPerMonth = (parseFloat(priceGrowth) || 0) / 100 / 12;

    let totalInvested = 0;
    let totalCoins = 0;
    const simulations = [];
    let currentPrice = startPrice;

    for (let i = 0; i < monthsNum; i++) {
      const coinsBought = monthly / currentPrice;
      totalInvested += monthly;
      totalCoins += coinsBought;

      simulations.push({
        date: new Date(
          Date.now() + i * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        invested: totalInvested,
        coins: totalCoins,
        value: totalCoins * currentPrice,
      });

      currentPrice *= 1 + growthPerMonth;
    }

    const finalValue = totalCoins * currentPrice;
    const profitLoss = finalValue - totalInvested;
    const profitLossPercentage =
      totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    setResult({
      totalInvested,
      totalCoins,
      averagePrice: totalCoins > 0 ? totalInvested / totalCoins : 0,
      currentValue: finalValue,
      profitLoss,
      profitLossPercentage,
      simulations,
    });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        📊 DCA Calculator (Dollar Cost Averaging)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Current Coin Price ($)
            </label>
            <input
              type="number"
              value={coinPrice}
              onChange={(e) => setCoinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Monthly Investment ($)
            </label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Investment Period (months)
            </label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
              placeholder="12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Expected Annual Growth (%)
            </label>
            <input
              type="number"
              value={priceGrowth}
              onChange={(e) => setPriceGrowth(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
              placeholder="10"
            />
          </div>

          <button
            onClick={calculateDCA}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Calculate DCA Strategy
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <div className="text-sm text-[var(--text-secondary)]">
                  Total Invested
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  <FormatPrice value={result.totalInvested} />
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <div className="text-sm text-[var(--text-secondary)]">
                  Final Value
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  <FormatPrice value={result.currentValue} />
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <div className="text-sm text-[var(--text-secondary)]">
                  Total Coins
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {result.totalCoins.toFixed(4)}
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <div className="text-sm text-[var(--text-secondary)]">
                  Avg. Price
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  <FormatPrice value={result.averagePrice} />
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-primary)] rounded-lg col-span-2">
                <div className="text-sm text-[var(--text-secondary)]">
                  Profit/Loss
                </div>
                <div
                  className={`text-2xl font-bold ${
                    result.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {result.profitLoss >= 0 ? '+' : '-'}
                  <FormatPrice value={Math.abs(result.profitLoss)} />
                  <span className="text-sm ml-2">
                    ({result.profitLossPercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.simulations}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  />
                  <YAxis
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#6b7280"
                    strokeWidth={2}
                    name="Invested"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Value"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-[var(--text-secondary)]">
                  Portfolio Value
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                <span className="text-[var(--text-secondary)]">
                  Total Invested
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
