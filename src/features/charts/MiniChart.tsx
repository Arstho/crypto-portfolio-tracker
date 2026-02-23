import React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: [number, number][];
  isPositive: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, isPositive }) => {
  const chartData = data.map(([timestamp, price]) => ({
    price,
  }));

  return (
    <div className="w-24 h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
