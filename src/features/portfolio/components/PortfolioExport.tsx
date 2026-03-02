import React, { useState } from 'react';
import type { PortfolioItem, Transaction } from '../types';

interface PortfolioExportProps {
  transactions: Transaction[];
  items: PortfolioItem[];
  stats: {
    totalInvested: number;
    totalCurrentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
    realizedProfitLoss: number;
  };
}

export const PortfolioExport: React.FC<PortfolioExportProps> = ({
  transactions,
  items,
  stats,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const generateCSV = (type: 'transactions' | 'holdings' | 'full') => {
    let csv = '';
    let filename = '';

    if (type === 'transactions' || type === 'full') {
      csv += 'Date,Type,Coin,Amount,Price,Total,Notes\n';

      transactions.forEach((t) => {
        csv += `${new Date(t.date).toLocaleDateString()},${t.type},${t.coinName},${t.amount},${t.price},${t.total},${t.notes || ''}\n`;
      });

      if (type === 'transactions') {
        filename = 'portfolio-transactions.csv';
      }
    }

    if (type === 'holdings' || type === 'full') {
      if (type === 'full') {
        csv += '\n\n';
      }

      csv +=
        'Coin,Symbol,Amount,Avg Buy Price,Current Price,Value,Profit/Loss,Profit %\n';

      items.forEach((item) => {
        const buys = item.transactions.filter((t) => t.type === 'buy');
        const totalSpent = buys.reduce((sum, t) => sum + t.total, 0);
        const avgPrice = totalSpent / item.totalAmount;
        const currentPrice = item.transactions[0]?.price || 0;
        const currentValue = item.totalAmount * currentPrice;
        const profitLoss = currentValue - totalSpent;
        const profitLossPercentage =
          totalSpent > 0 ? (profitLoss / totalSpent) * 100 : 0;

        csv += `${item.coinName},${item.coinSymbol.toUpperCase()},${item.totalAmount},${avgPrice},${currentPrice},${currentValue},${profitLoss},${profitLossPercentage}%\n`;
      });

      if (type === 'holdings') {
        filename = 'portfolio-holdings.csv';
      }
    }

    if (type === 'full') {
      filename = 'portfolio-full-report.csv';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      summary: {
        totalInvested: stats.totalInvested,
        totalCurrentValue: stats.totalCurrentValue,
        totalProfitLoss: stats.totalProfitLoss,
        totalProfitLossPercentage: stats.totalProfitLossPercentage,
        realizedProfitLoss: stats.realizedProfitLoss,
      },
      transactions,
      holdings: items.map((item) => ({
        coinId: item.coinId,
        coinName: item.coinName,
        coinSymbol: item.coinSymbol,
        amount: item.totalAmount,
        transactions: item.transactions.length,
      })),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'portfolio-export.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    window.print();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
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
        Export
      </button>

      {showExportMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] z-10">
          <div className="p-2">
            <div className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)]">
              Export as CSV
            </div>
            <button
              onClick={() => generateCSV('transactions')}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
            >
              📄 Transactions only
            </button>
            <button
              onClick={() => generateCSV('holdings')}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
            >
              📊 Current holdings
            </button>
            <button
              onClick={() => generateCSV('full')}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
            >
              📑 Full report (both)
            </button>

            <div className="border-t border-[var(--border-color)] my-2" />

            <button
              onClick={generateJSON}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
            >
              🔧 Export as JSON
            </button>

            <button
              onClick={generatePDF}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
            >
              🖨️ Print / PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
