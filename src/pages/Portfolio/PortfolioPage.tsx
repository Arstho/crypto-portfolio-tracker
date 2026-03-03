import React, { useEffect, useMemo, useState } from 'react';
import { PortfolioGrowthChart } from '../../features/charts/PortfolioGrowthChart';
import { PortfolioPieChart } from '../../features/charts/PortfolioPieChart';
import { PortfolioExport } from '../../features/portfolio/components/PortfolioExport';
import {
  PortfolioFilters,
  type SortDirection,
  type SortField,
} from '../../features/portfolio/components/PortfolioFilters';
import { PortfolioGoals } from '../../features/portfolio/components/PortfolioGoals';
// import { SellCoinModal } from '../../features/portfolio/components/SellCoinModal';
import { useGoals } from '../../features/portfolio/hooks/useGoals';
import { usePortfolio } from '../../features/portfolio/hooks/usePortfolio';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';
import { Notification } from '../../shared/components/Notification/Notification';
import { PriceChange } from '../../shared/components/PriceChange/PriceChange';
import { Skeleton } from '../../shared/components/Skeleton/Skeleton';

export const PortfolioPage: React.FC = () => {
  const {
    itemsWithPrices,
    stats,
    transactions,
    removeTransaction,
    clearAll,
    loading,
  } = usePortfolio();
  const { goals, addNewGoal, removeGoal, checkAndUpdateGoals } = useGoals();

  // const [selectedItem, setSelectedItem] = useState<
  //   (typeof itemsWithPrices)[0] | null
  // >(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showProfitableOnly, setShowProfitableOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAndUpdateGoals(
      stats.totalCurrentValue,
      stats.totalProfitLoss,
      stats.totalProfitLossPercentage
    );
  }, [
    stats.totalCurrentValue,
    stats.totalProfitLoss,
    stats.totalProfitLossPercentage,
    checkAndUpdateGoals,
  ]);

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...itemsWithPrices];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.coinName.toLowerCase().includes(term) ||
          item.coinSymbol.toLowerCase().includes(term)
      );
    }

    if (showProfitableOnly) {
      filtered = filtered.filter((item) => item.profitLoss > 0);
    }

    filtered.sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'name':
          aValue = a.coinName;
          bValue = b.coinName;
          break;
        case 'value':
          aValue = a.currentValue;
          bValue = b.currentValue;
          break;
        case 'profit':
          aValue = a.profitLossPercentage;
          bValue = b.profitLossPercentage;
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [
    itemsWithPrices,
    searchTerm,
    showProfitableOnly,
    sortField,
    sortDirection,
  ]);

  const currentValues = itemsWithPrices.map((item) => ({
    coinId: item.coinId,
    value: item.currentValue,
  }));

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setNotification({ message, type });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>

        <div className="card p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>

        <div className="card p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="h-[400px] flex items-center justify-center">
            <Skeleton className="w-[300px] h-[300px] rounded-full" />
          </div>
        </div>

        <div className="card p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>

        <div className="card p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-4 border-b border-[var(--border-color)] last:border-0"
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--bg-card)] mb-4 border border-[var(--border-color)]">
          <svg
            className="w-10 h-10 text-[var(--text-secondary)]"
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
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Your portfolio is empty
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Start by adding some cryptocurrencies to your portfolio
        </p>
        <a href="/" className="btn-primary inline-flex items-center gap-2">
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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          My Portfolio
        </h1>
        <div className="flex gap-2">
          <PortfolioExport
            transactions={transactions}
            items={itemsWithPrices}
            stats={stats}
          />
          <button
            onClick={async () => {
              await clearAll();
              showNotification('Portfolio cleared successfully', 'success');
            }}
            className="px-4 py-2 text-red-500 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            Clear Portfolio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="text-sm text-[var(--text-secondary)] mb-1">
            Total Invested
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            <FormatPrice value={stats.totalInvested} />
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm text-[var(--text-secondary)] mb-1">
            Current Value
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            <FormatPrice value={stats.totalCurrentValue} />
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm text-[var(--text-secondary)] mb-1">
            Total Profit/Loss
          </div>
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
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            Realized: <FormatPrice value={Math.abs(stats.realizedProfitLoss)} />
            {stats.realizedProfitLoss >= 0 ? ' profit' : ' loss'}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm text-[var(--text-secondary)] mb-1">
            Best Performer
          </div>
          {stats.topPerformer ? (
            <>
              <div className="text-lg font-semibold text-[var(--text-primary)]">
                {stats.topPerformer.coinName}
              </div>
              <div className="text-green-500 font-medium">
                +{stats.topPerformer.profitLossPercentage.toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="text-[var(--text-secondary)]">No data</div>
          )}
        </div>
      </div>

      <PortfolioGoals
        currentValue={stats.totalCurrentValue}
        totalProfit={stats.totalProfitLoss}
        profitPercentage={stats.totalProfitLossPercentage}
        goals={goals}
        onAddGoal={addNewGoal}
        onRemoveGoal={removeGoal}
        onGoalReached={(goal) => {
          showNotification(`🎉 Goal reached: ${goal.name}!`, 'success');
        }}
      />

      <PortfolioPieChart data={stats.diversification} />

      <PortfolioGrowthChart
        transactions={transactions}
        currentValues={currentValues}
      />

      <PortfolioFilters
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        showProfitableOnly={showProfitableOnly}
        onShowProfitableOnlyChange={setShowProfitableOnly}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Your Assets{' '}
            {filteredAndSortedItems.length !== itemsWithPrices.length &&
              `(${filteredAndSortedItems.length} of ${itemsWithPrices.length})`}
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.coinId}
              className="p-6 hover:bg-[var(--hover-bg)] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.coinImage}
                    alt={item.coinName}
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {item.coinName}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {item.coinSymbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Sell
                  </button>
                </div> */}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-center">
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Amount
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {item.totalAmount.toFixed(4)}{' '}
                    {item.coinSymbol.toUpperCase()}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Avg. Buy Price
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">
                    <FormatPrice value={item.avgBuyPrice} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Current Price
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">
                    <FormatPrice value={item.currentPrice} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Total Value
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">
                    <FormatPrice value={item.currentValue} />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Profit/Loss
                  </div>
                  <PriceChange value={item.profitLossPercentage} />
                  <div className="text-xs text-[var(--text-secondary)]">
                    <FormatPrice value={Math.abs(item.profitLoss)} />
                  </div>
                </div>
              </div>

              {item.transactions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                  <details>
                    <summary className="text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]">
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
                            className="flex items-center justify-between text-sm p-2 bg-[var(--hover-bg)] rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  t.type === 'buy'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                }`}
                              >
                                {t.type.toUpperCase()}
                              </span>
                              <span className="text-[var(--text-secondary)]">
                                {new Date(t.date).toLocaleDateString()}
                              </span>
                              <span className="text-[var(--text-primary)]">
                                {t.amount} {item.coinSymbol.toUpperCase()}
                              </span>
                              <span className="text-[var(--text-secondary)]">
                                @ <FormatPrice value={t.price} />
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--text-primary)]">
                                <FormatPrice value={t.total} />
                              </span>
                              <button
                                onClick={() => {
                                  removeTransaction(t.id);
                                  showNotification(
                                    'Transaction deleted',
                                    'info'
                                  );
                                }}
                                className="text-[var(--text-secondary)] hover:text-red-500"
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

          {filteredAndSortedItems.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[var(--text-secondary)]">
                No assets match your filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* {selectedItem && (
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
      )} */}
    </div>
  );
};
