import React from 'react';

export type SortField = 'name' | 'value' | 'profit' | 'amount';
export type SortDirection = 'asc' | 'desc';

interface PortfolioFiltersProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  showProfitableOnly: boolean;
  onShowProfitableOnlyChange: (value: boolean) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  sortField,
  sortDirection,
  onSortChange,
  showProfitableOnly,
  onShowProfitableOnlyChange,
  searchTerm,
  onSearchChange,
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by coin name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSortChange('name')}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-1 ${
              sortField === 'name'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Name {getSortIcon('name')}
          </button>

          <button
            onClick={() => onSortChange('value')}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-1 ${
              sortField === 'value'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Value {getSortIcon('value')}
          </button>

          <button
            onClick={() => onSortChange('profit')}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-1 ${
              sortField === 'profit'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Profit {getSortIcon('profit')}
          </button>

          <button
            onClick={() => onSortChange('amount')}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-1 ${
              sortField === 'amount'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Amount {getSortIcon('amount')}
          </button>

          <button
            onClick={() => onShowProfitableOnlyChange(!showProfitableOnly)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showProfitableOnly
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showProfitableOnly ? 'Profitable ✓' : 'Show Profitable'}
          </button>
        </div>
      </div>
    </div>
  );
};
