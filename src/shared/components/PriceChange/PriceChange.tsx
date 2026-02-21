import React from 'react';

interface PriceChangeProps {
  value: number;
  showArrow?: boolean;
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  showArrow = true,
}) => {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {showArrow && (
        <svg
          className={`w-4 h-4 ${isPositive ? '' : 'transform rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      )}
      {isPositive ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  );
};
