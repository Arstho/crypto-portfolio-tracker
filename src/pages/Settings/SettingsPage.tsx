import React, { useState } from 'react';
import { useGoals } from '../../features/portfolio/hooks/useGoals';
import { usePortfolio } from '../../features/portfolio/hooks/usePortfolio';
import { useTheme } from '../../shared/context/ThemeContext';

interface Settings {
  defaultCurrency: string;
  showBalance: boolean;
  compactMode: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { clearAll, transactions, itemsWithPrices, addTransaction } =
    usePortfolio();
  const { addNewGoal } = useGoals();

  const [showConfirm, setShowConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved
      ? JSON.parse(saved)
      : {
          defaultCurrency: 'USD',
          showBalance: true,
          compactMode: false,
          notifications: true,
          autoRefresh: true,
          refreshInterval: 30,
        };
  });

  const saveSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('userSettings', JSON.stringify(updated));
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      settings,
      transactions,
      portfolio: itemsWithPrices,
      goals: localStorage.getItem('portfolioGoals')
        ? JSON.parse(localStorage.getItem('portfolioGoals')!)
        : [],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (!importedData.version || !importedData.transactions) {
          throw new Error('Invalid backup file format');
        }

        if (importedData.settings) {
          localStorage.setItem(
            'userSettings',
            JSON.stringify(importedData.settings)
          );
          setSettings(importedData.settings);
        }

        if (
          importedData.transactions &&
          Array.isArray(importedData.transactions)
        ) {
          localStorage.removeItem('portfolioTransactions');

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          importedData.transactions.forEach((tx: any) => {
            addTransaction({
              type: tx.type,
              coinId: tx.coinId,
              coinName: tx.coinName,
              coinSymbol: tx.coinSymbol,
              coinImage: tx.coinImage || '',
              amount: tx.amount,
              price: tx.price,
              date: tx.date,
              notes: tx.notes || '',
            });
          });
        }

        if (importedData.goals && Array.isArray(importedData.goals)) {
          localStorage.setItem(
            'portfolioGoals',
            JSON.stringify(importedData.goals)
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          importedData.goals.forEach((goal: any) => {
            addNewGoal({
              type: goal.type,
              target: goal.target,
              deadline: goal.deadline,
              name: goal.name,
            });
          });
        }

        setImportStatus({
          type: 'success',
          message: `Successfully imported ${importedData.transactions?.length || 0} transactions and ${importedData.goals?.length || 0} goals`,
        });

        event.target.value = '';

        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        setImportStatus({
          type: 'error',
          message:
            error instanceof Error ? error.message : 'Invalid backup file',
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">
        Settings
      </h1>

      {importStatus && (
        <div
          className={`p-4 rounded-lg border ${
            importStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800'
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800'
          }`}
        >
          {importStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-2xl">🎨</span> Appearance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Theme</span>
              <button
                onClick={toggleTheme}
                className="btn-secondary flex items-center gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <span className="text-xl">🌞</span>
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🌙</span>
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Compact Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) =>
                    saveSettings({ compactMode: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-2xl">💱</span> Currency
          </h2>

          <select
            value={settings.defaultCurrency}
            onChange={(e) => saveSettings({ defaultCurrency: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CNY">CNY - Chinese Yuan</option>
          </select>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Show Balance</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showBalance}
                onChange={(e) =>
                  saveSettings({ showBalance: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-2xl">🔔</span> Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">
                Enable Notifications
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) =>
                    saveSettings({ notifications: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Auto-refresh</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) =>
                    saveSettings({ autoRefresh: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.autoRefresh && (
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">
                  Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) =>
                    saveSettings({
                      refreshInterval: parseInt(e.target.value) || 30,
                    })
                  }
                  min="10"
                  max="300"
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-2xl">💾</span> Data Management
          </h2>

          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full btn-primary flex items-center justify-center gap-2"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Backup
            </button>

            <label className="w-full btn-secondary flex items-center justify-center gap-2 cursor-pointer">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset All Data
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  Are you sure? This cannot be undone!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      clearAll();
                      localStorage.removeItem('portfolioGoals');
                      localStorage.removeItem('userSettings');
                      setShowConfirm(false);
                      setTimeout(() => window.location.reload(), 1000);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-[var(--text-secondary)]">
                Total Transactions
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {transactions.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-secondary)]">Assets</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {itemsWithPrices.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-secondary)]">Buys</div>
              <div className="text-2xl font-bold text-green-500">
                {transactions.filter((t) => t.type === 'buy').length}
              </div>
            </div>
            {/* <div>
              <div className="text-sm text-[var(--text-secondary)]">Sells</div>
              <div className="text-2xl font-bold text-red-500">
                {transactions.filter((t) => t.type === 'sell').length}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
