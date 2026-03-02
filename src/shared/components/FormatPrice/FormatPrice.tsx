import React from 'react';

interface FormatPriceProps {
  value: number;
  className?: string;
  isProfit?: boolean;
}

export const FormatPrice: React.FC<FormatPriceProps> = ({
  value,
  className = '',
  isProfit,
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1_000_000_000) {
      return (
        price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + 'B'
      );
    } else if (price >= 1_000_000) {
      return (
        price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + 'M'
      );
    } else if (price >= 1_000) {
      return (
        price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + 'K'
      );
    } else if (price >= 1) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
    } else {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    }
  };

  const getColorClass = () => {
    if (isProfit === undefined) return '';
    return isProfit ? 'text-green-500' : 'text-red-500';
  };

  return (
    <span className={`${getColorClass()} ${className}`}>
      ${formatPrice(value)}
    </span>
  );
};
