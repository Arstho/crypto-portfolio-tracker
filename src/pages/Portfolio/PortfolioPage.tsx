import React, { useState } from 'react';
import { PortfolioPieChart } from '../../features/charts/PortfolioPieChart';
import { SellCoinModal } from '../../features/portfolio/components/SellCoinModal';
import { usePortfolio } from '../../features/portfolio/hooks/usePortfolio';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';
import { PriceChange } from '../../shared/components/PriceChange/PriceChange';
import { Skeleton } from '../../shared/components/Skeleton/Skeleton';

export const PortfolioPage: React.FC = () => {
  const { itemsWithPrices, stats, removeTransaction, clearAll, loading } =
    usePortfolio();
  const [selectedItem, setSelectedItem] = useState<
    (typeof itemsWithPrices)[0] | null
  >(null);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="h-[400px] flex items-center justify-center">
            <Skeleton className="w-[300px] h-[300px] rounded-full" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-4 border-b last:border-0"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (itemsWithPrices.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your portfolio is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Start by adding some cryptocurrencies to your portfolio
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
          Browse Market
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
        <button
          onClick={clearAll}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Total Invested</div>
          <div className="text-2xl font-bold text-gray-900">
            <FormatPrice value={stats.totalInvested} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Current Value</div>
          <div className="text-2xl font-bold text-gray-900">
            <FormatPrice value={stats.totalCurrentValue} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Total Profit/Loss</div>
          <div
            className={`text-2xl font-bold ${
              stats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {stats.totalProfitLoss >= 0 ? '+' : '-'}
            <FormatPrice value={Math.abs(stats.totalProfitLoss)} />
            <span className="text-sm ml-2">
              ({stats.totalProfitLossPercentage >= 0 ? '+' : ''}
              {stats.totalProfitLossPercentage.toFixed(2)}%)
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Realized: <FormatPrice value={Math.abs(stats.realizedProfitLoss)} />
            {stats.realizedProfitLoss >= 0 ? ' profit' : ' loss'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 mb-1">Best Performer</div>
          {stats.topPerformer ? (
            <>
              <div className="text-lg font-semibold text-gray-900">
                {stats.topPerformer.coinName}
              </div>
              <div className="text-green-500 font-medium">
                +{stats.topPerformer.profitLossPercentage.toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="text-gray-400">No data</div>
          )}
        </div>
      </div>

      <PortfolioPieChart data={stats.diversification} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Assets</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {itemsWithPrices.map((item) => (
            <div
              key={item.coinId}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.coinImage}
                    alt={item.coinName}
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.coinName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.coinSymbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div>
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="font-medium">
                    {item.totalAmount.toFixed(4)}{' '}
                    {item.coinSymbol.toUpperCase()}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Avg. Buy Price</div>
                  <div className="font-medium">
                    <FormatPrice value={item.avgBuyPrice} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Current Price</div>
                  <div className="font-medium">
                    <FormatPrice value={item.currentPrice} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Total Value</div>
                  <div className="font-medium">
                    <FormatPrice value={item.currentValue} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Profit/Loss</div>
                  <PriceChange value={item.profitLossPercentage} />
                  <div className="text-xs text-gray-500">
                    <FormatPrice value={Math.abs(item.profitLoss)} />
                  </div>
                </div>
              </div>

              {item.transactions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <details>
                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                      Transaction History ({item.transactions.length})
                    </summary>
                    <div className="mt-2 space-y-2">
                      {item.transactions
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  t.type === 'buy'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {t.type.toUpperCase()}
                              </span>
                              <span>
                                {new Date(t.date).toLocaleDateString()}
                              </span>
                              <span>
                                {t.amount} {item.coinSymbol.toUpperCase()}
                              </span>
                              <span>
                                @ <FormatPrice value={t.price} />
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                <FormatPrice value={t.total} />
                              </span>
                              <button
                                onClick={() => removeTransaction(t.id)}
                                className="text-gray-400 hover:text-red-500"
                                title="Delete transaction"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <SellCoinModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          coinId={selectedItem.coinId}
          coinName={selectedItem.coinName}
          coinSymbol={selectedItem.coinSymbol}
          coinImage={selectedItem.coinImage}
          maxAmount={selectedItem.totalAmount}
          avgBuyPrice={selectedItem.avgBuyPrice}
          currentPrice={selectedItem.currentPrice}
        />
      )}
    </div>
  );
};
