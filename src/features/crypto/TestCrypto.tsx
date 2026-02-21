import React, { useState } from 'react';
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
        <p className="mt-2 text-gray-600">Loading cryptocurrencies...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg">
        Error loading data
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Top Cryptocurrencies</h2>
      <div className="grid gap-4">
        {coins?.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center gap-4 p-4 border rounded-lg shadow hover:shadow-md transition-shadow bg-white"
          >
            <img src={coin.image} alt={coin.name} className="w-8 h-8" />

            <div className="flex-1">
              <span className="font-semibold">{coin.name}</span>
              <span className="text-gray-500 ml-2">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                Rank #{coin.market_cap_rank}
              </span>
            </div>

            <div className="text-right">
              <div className="font-bold">
                $
                {coin.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= 10}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestCrypto;
