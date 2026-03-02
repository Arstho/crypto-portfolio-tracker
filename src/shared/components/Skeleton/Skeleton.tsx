import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--border-color)' }}
    />
  );
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

export const CardSkeleton: React.FC = () => (
  <div className="card p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)]">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-8 w-16" />
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="card p-6">
    <Skeleton className="h-6 w-48 mb-4" />
    <Skeleton className="h-[300px] w-full" />
    <div className="flex justify-center gap-4 mt-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);
