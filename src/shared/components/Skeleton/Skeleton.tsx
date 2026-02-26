import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
};

export const PriceSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
  </div>
);

export const ProfitLossSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-6 w-28" />
  </div>
);
