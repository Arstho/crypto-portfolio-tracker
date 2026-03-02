import React from 'react';

interface PriceChangeProps {
  value: number;
  showArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  showArrow = true,
  size = 'md',
}) => {
  const isPositive = value >= 0;

  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} font-medium ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {showArrow && (
        <svg
          className={`${iconSizes[size]} ${isPositive ? '' : 'transform rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      )}
      <span>
        {isPositive ? '+' : ''}
        {value.toFixed(2)}%
      </span>
    </span>
  );
};
