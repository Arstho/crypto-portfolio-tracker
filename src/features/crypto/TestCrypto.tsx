import React, { useState } from 'react';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';
import { useGetCoinsQuery } from './cryptoApi';

const TestCrypto: React.FC = () => {
  const [page, setPage] = useState(1);
  const {
    data: coins,
    isLoading,
    error,
  } = useGetCoinsQuery({ page, perPage: 10 });

  if (isLoading)
    return (
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-[var(--text-secondary)]">
          Loading cryptocurrencies...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="text-center p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        Error loading data
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        Top Cryptocurrencies
      </h2>

      <div className="grid gap-4">
        {coins?.map((coin) => (
          <div
            key={coin.id}
            className="card p-4 flex items-center gap-4 hover:bg-[var(--hover-bg)] transition-all hover:shadow-md"
          >
            <img src={coin.image} alt={coin.name} className="w-8 h-8" />

            <div className="flex-1">
              <span className="font-semibold text-[var(--text-primary)]">
                {coin.name}
              </span>
              <span className="text-[var(--text-secondary)] ml-2">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="text-[var(--text-secondary)] text-xs ml-2 opacity-60">
                Rank #{coin.market_cap_rank}
              </span>
            </div>

            <div className="text-right">
              <div className="font-bold text-[var(--text-primary)]">
                <FormatPrice value={coin.current_price} />
              </div>
              <div
                className={`text-sm ${
                  coin.price_change_percentage_24h > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {coin.price_change_percentage_24h > 0 ? '+' : ''}
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-4 py-2 text-[var(--text-primary)]">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= 10}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestCrypto;
