import React from 'react';

interface FormatPriceProps {
  value: number;
  className?: string;
}

export const FormatPrice: React.FC<FormatPriceProps> = ({
  value,
  className,
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
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

  return <span className={className}>${formatPrice(value)}</span>;
};
