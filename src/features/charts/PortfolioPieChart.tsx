import React, { useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type PieLabelRenderProps,
} from 'recharts';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';

interface PortfolioPieChartProps {
  data: Array<{
    coinId: string;
    coinName: string;
    percentage: number;
    value: number;
  }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      coinName: string;
      value: number;
      percentage: number;
    };
  }>;
}

interface LegendPayload {
  color: string;
  payload: {
    coinName: string;
    percentage: number;
  };
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
  '#6b7280',
  '#14b8a6',
];

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-[var(--bg-card)] p-3 border border-[var(--border-color)] rounded-lg shadow-lg">
        <p className="font-semibold text-[var(--text-primary)]">
          {data.coinName}
        </p>
        <p className="text-[var(--text-secondary)]">
          Value: <FormatPrice value={data.value} />
        </p>
        <p className="text-[var(--text-secondary)]">
          Allocation: {data.percentage.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
      {payload.map((entry: LegendPayload, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--text-secondary)]">
            {entry.payload.coinName}
          </span>
          <span className="font-semibold text-[var(--text-primary)]">
            {entry.payload.percentage.toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  );
};

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !payload) {
    return null;
  }

  const percentage = payload.percentage as number;

  if (percentage < 5) return null;

  const RADIAN = Math.PI / 180;
  const radius =
    (innerRadius as number) +
    ((outerRadius as number) - (innerRadius as number)) * 0.5;
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs font-medium"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

export const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({
  data,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-[var(--bg-card)] rounded-lg border-2 border-dashed border-[var(--border-color)]">
        <p className="text-[var(--text-secondary)]">No assets to display</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const onPieEnter = (_: React.MouseEvent, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        Portfolio Distribution
      </h2>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="coinName"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {sortedData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={
                    activeIndex === index ? 'var(--text-primary)' : 'none'
                  }
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[var(--border-color)]">
        <div>
          <div className="text-sm text-[var(--text-secondary)]">
            Total Assets
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {data.length}
          </div>
        </div>
        <div>
          <div className="text-sm text-[var(--text-secondary)]">Most Held</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {sortedData[0]?.coinName || '-'}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {sortedData[0]?.percentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};
