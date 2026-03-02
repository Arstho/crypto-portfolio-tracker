import React from 'react';

export type TimePeriod = '1' | '7' | '30' | '90' | '365';

interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: '1', label: '24h' },
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
  { value: '365', label: '1y' },
];

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="flex gap-2 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-color)]">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            selected === period.value
              ? 'bg-[var(--bg-card)] text-blue-500 shadow-sm border border-[var(--border-color)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};
