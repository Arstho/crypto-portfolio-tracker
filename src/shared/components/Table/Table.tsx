import React from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  sortConfig?: {
    key: keyof T | null;
    direction: 'asc' | 'desc';
  } | null;
  onSort?: (key: keyof T) => void;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  sortConfig,
  onSort,
}: TableProps<T>) {
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortConfig?.key === column.key;

    return (
      <span className="ml-2 inline-flex">
        {isActive ? (
          sortConfig.direction === 'asc' ? (
            <svg
              className="w-4 h-4 text-[var(--text-primary)]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-[var(--text-primary)]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )
        ) : (
          <svg
            className="w-4 h-4 text-[var(--text-secondary)]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] shadow-xs">
      <table className="min-w-full divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
        <thead className="bg-[var(--hover-bg)]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                onClick={() =>
                  column.sortable && onSort?.(column.key as keyof T)
                }
                className={`
                  px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:bg-[var(--border-color)] select-none' : ''}
                `}
                title={column.sortable ? `Sort by ${column.header}` : undefined}
              >
                <div className="flex items-center">
                  {column.header}
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={
                onRowClick
                  ? 'cursor-pointer hover:bg-[var(--hover-bg)] transition-colors'
                  : ''
              }
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]"
                >
                  {column.render
                    ? column.render(item)
                    : (item[column.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
