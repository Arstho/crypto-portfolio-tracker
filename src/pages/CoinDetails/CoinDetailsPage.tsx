import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PriceChart } from '../../features/charts/PriceChart';
import {
  TimePeriodSelector,
  type TimePeriod,
} from '../../features/charts/TimePeriodSelector';
import {
  useGetCoinByIdQuery,
  useGetCoinHistoryQuery,
} from '../../features/crypto/cryptoApi';
import { AddToPortfolioModal } from '../../features/portfolio/components/AddToPortfolioModal';
import { ErrorMessage } from '../../shared/components/ErrorMessage/ErrorMessage';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner/LoadingSpinner';
import { PriceChange } from '../../shared/components/PriceChange/PriceChange';

export const CoinDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('30');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: coin,
    isLoading: isLoadingCoin,
    error: coinError,
  } = useGetCoinByIdQuery(id || '');

  const { data: chartData, isLoading: isLoadingChart } = useGetCoinHistoryQuery(
    { id: id || '', days: parseInt(period) },
    { skip: !id }
  );

  if (isLoadingCoin) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (coinError || !coin) {
    return (
      <ErrorMessage
        message="Failed to load coin details"
        onRetry={() => navigate('/')}
      />
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to market
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{coin.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500 text-lg">
                  {coin.symbol.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                  Rank #{coin.market_cap_rank}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-4xl font-bold text-gray-900">
              <FormatPrice value={coin.current_price} />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <PriceChange value={coin.price_change_percentage_24h} />
              <span className="text-gray-500">24h</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Portfolio
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Price Chart</h2>
          <TimePeriodSelector selected={period} onChange={setPeriod} />
        </div>

        {isLoadingChart ? (
          <div className="flex justify-center items-center h-[400px]">
            <LoadingSpinner />
          </div>
        ) : chartData ? (
          <PriceChart
            data={chartData.prices}
            color={
              coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'
            }
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About {coin.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">{coin.description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Statistics
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">All Time High</span>
              <div className="text-right">
                <div className="font-semibold">
                  <FormatPrice value={coin.ath} />
                </div>
                <div className="text-sm text-red-500">
                  {coin.ath_change_percentage?.toFixed(2)}% from ATH
                </div>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">All Time Low</span>
              <div className="text-right">
                <div className="font-semibold">
                  <FormatPrice value={coin.atl} />
                </div>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Price Change (1h)</span>
              <PriceChange value={coin.price_change_percentage_1h} />
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Price Change (7d)</span>
              <PriceChange value={coin.price_change_percentage_7d} />
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Price Change (30d)</span>
              <PriceChange value={coin.price_change_percentage_30d} />
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Price Change (1y)</span>
              <PriceChange value={coin.price_change_percentage_1y} />
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-500">Total Supply</span>
              <span className="font-semibold">
                {coin.total_supply
                  ? coin.total_supply.toLocaleString()
                  : 'Unlimited'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href={coin.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-6h2v6zm0-8h-2V6h2v2z" />
              </svg>
              Website
            </a>
            {coin.github && (
              <a
                href={coin.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.5 18v-2.5c.02-.47.1-.93.25-1.36 1.56-.37 2.75-1.72 2.75-3.34 0-1.06-.39-2.08-1.08-2.86.15-.47.23-.96.22-1.45 0-.99-.33-1.94-.9-2.7-.85-.09-1.7.18-2.4.68-.66-.18-1.35-.27-2.04-.27-.69 0-1.38.09-2.04.27-.7-.5-1.55-.77-2.4-.68-.57.76-.9 1.71-.9 2.7 0 .49.08.98.22 1.45-.69.78-1.08 1.8-1.08 2.86 0 1.62 1.19 2.97 2.75 3.34.15.43.23.89.25 1.36V20c-1.59-.68-2.92-1.88-3.73-3.42-.81-1.54-1.17-3.29-.97-5.01.2-1.72.96-3.32 2.17-4.57.81-.84 1.79-1.48 2.86-1.88 1.07-.4 2.22-.58 3.37-.54 1.15-.04 2.3.14 3.37.54 1.07.4 2.05 1.04 2.86 1.88 1.21 1.25 1.97 2.85 2.17 4.57.2 1.72-.16 3.47-.97 5.01-.81 1.54-2.14 2.74-3.73 3.42z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      <AddToPortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coin={coin}
      />
    </div>
  );
};
