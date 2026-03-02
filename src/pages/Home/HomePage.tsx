import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MiniChart } from '../../features/charts/MiniChart';
import { useGetCoinsQuery } from '../../features/crypto/cryptoApi';
import { ErrorMessage } from '../../shared/components/ErrorMessage/ErrorMessage';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';
import { useDebounce } from '../../shared/components/hooks/useDebounce';
import { useSort } from '../../shared/components/hooks/useSort';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner/LoadingSpinner';
import { PriceChange } from '../../shared/components/PriceChange/PriceChange';
import { SearchInput } from '../../shared/components/SearchInput/SearchInput';
import { Table } from '../../shared/components/Table/Table';
import { getMockChartData } from '../../shared/mocks/cryptos';
import type { Coin } from '../../shared/types/coinGecko';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [chartDataMap, setChartDataMap] = useState<
    Record<string, [number, number][]>
  >({});

  const {
    data: coins,
    isLoading,
    error,
    refetch,
  } = useGetCoinsQuery({
    page,
    perPage: 20,
  });

  useEffect(() => {
    if (coins) {
      coins.forEach((coin) => {
        if (!chartDataMap[coin.id]) {
          const data = getMockChartData(coin.id, 7);
          setChartDataMap((prev) => ({ ...prev, [coin.id]: data.prices }));
        }
      });
    }
  }, [chartDataMap, coins]);

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    if (!debouncedSearch) return coins;

    const searchLower = debouncedSearch.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchLower) ||
        coin.symbol.toLowerCase().includes(searchLower)
    );
  }, [coins, debouncedSearch]);

  const {
    items: sortedCoins,
    requestSort,
    sortConfig,
  } = useSort(filteredCoins);

  const columns = [
    {
      key: 'chart',
      header: 'Last 7d',
      render: (coin: Coin) =>
        chartDataMap[coin.id] ? (
          <MiniChart
            data={chartDataMap[coin.id]}
            isPositive={coin.price_change_percentage_24h >= 0}
          />
        ) : null,
    },
    {
      key: 'market_cap_rank',
      header: '#',
      sortable: true,
      render: (coin: Coin) => (
        <span className="text-[var(--text-secondary)]">
          {coin.market_cap_rank}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (coin: Coin) => (
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-8 h-8" />
          <div>
            <div className="font-medium text-[var(--text-primary)]">
              {coin.name}
            </div>
            <div className="text-[var(--text-secondary)] text-sm">
              {coin.symbol.toUpperCase()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'current_price',
      header: 'Price',
      sortable: true,
      render: (coin: Coin) => <FormatPrice value={coin.current_price} />,
    },
    {
      key: 'price_change_percentage_24h',
      header: '24h %',
      sortable: true,
      render: (coin: Coin) => (
        <PriceChange value={coin.price_change_percentage_24h} />
      ),
    },
    {
      key: 'market_cap',
      header: 'Market Cap',
      sortable: true,
      render: (coin: Coin) => <FormatPrice value={coin.market_cap} />,
    },
    {
      key: 'total_volume',
      header: 'Volume (24h)',
      sortable: true,
      render: (coin: Coin) => <FormatPrice value={coin.total_volume} />,
    },
  ];

  const handleRowClick = (coin: Coin) => {
    navigate(`/coin/${coin.id}`);
  };

  const handleSort = (key: keyof Coin) => {
    requestSort(key);
  };

  if (isLoading && !coins) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load cryptocurrencies"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Cryptocurrency Market
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Click on any row to view detailed information
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or symbol..."
          />
        </div>
      </div>

      <Table
        data={sortedCoins}
        columns={columns}
        onRowClick={handleRowClick}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-[var(--border-color)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-2 text-[var(--text-primary)]"
        >
          <svg
            className="w-4 h-4 text-[var(--text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
        <span className="text-[var(--text-secondary)] font-medium">
          Page {page}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!coins || coins.length < 20}
          className="px-4 py-2 border border-[var(--border-color)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-2 text-[var(--text-primary)]"
        >
          Next
          <svg
            className="w-4 h-4 text-[var(--text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
