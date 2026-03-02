import React, { useState } from 'react';
import { FormatPrice } from '../../shared/components/FormatPrice/FormatPrice';
import { useGetCoinsQuery } from '../crypto/cryptoApi';
import { usePortfolio } from '../portfolio/hooks/usePortfolio';

interface ImportedTransaction {
  date: string;
  type: 'buy' | 'sell';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage?: string;
  amount: number;
  price: number;
  total: number;
  notes?: string;
}

interface CsvRow {
  date: string;
  type: string;
  coin: string;
  amount: string;
  price: string;
  notes?: string;
  [key: string]: string | undefined;
}

export const PortfolioImport: React.FC = () => {
  const { buyCoin, sellCoin } = usePortfolio();
  const { data: coins } = useGetCoinsQuery({ perPage: 250 });
  const [importData, setImportData] = useState<string>('');
  const [preview, setPreview] = useState<ImportedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const findCoin = (searchTerm: string) => {
    if (!coins) return null;

    const term = searchTerm.toLowerCase().trim();
    return coins.find(
      (coin) =>
        coin.name.toLowerCase() === term ||
        coin.symbol.toLowerCase() === term ||
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );
  };

  const parseCsvLine = (headers: string[], line: string): CsvRow => {
    const values = line.split(',').map((v) => v.trim());
    const row: CsvRow = {
      date: '',
      type: '',
      coin: '',
      amount: '',
      price: '',
    };

    headers.forEach((header, index) => {
      if (index < values.length) {
        row[header] = values[index];
      }
    });

    return row;
  };

  const parseCSV = (csv: string): ImportedTransaction[] => {
    const lines = csv
      .trim()
      .split('\n')
      .filter((line) => line.trim());
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const requiredHeaders = ['date', 'type', 'coin', 'amount', 'price'];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const transactions: ImportedTransaction[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseCsvLine(headers, lines[i]);

        if (!row.date || !row.type || !row.coin || !row.amount || !row.price) {
          errors.push(`Line ${i + 1}: Missing required fields`);
          continue;
        }

        const type = row.type.toLowerCase();
        if (type !== 'buy' && type !== 'sell') {
          errors.push(
            `Line ${i + 1}: Invalid type '${row.type}' - must be 'buy' or 'sell'`
          );
          continue;
        }

        const amount = parseFloat(row.amount);
        if (isNaN(amount) || amount <= 0) {
          errors.push(
            `Line ${i + 1}: Invalid amount '${row.amount}' - must be a positive number`
          );
          continue;
        }

        const price = parseFloat(row.price);
        if (isNaN(price) || price <= 0) {
          errors.push(
            `Line ${i + 1}: Invalid price '${row.price}' - must be a positive number`
          );
          continue;
        }

        const coin = findCoin(row.coin);
        if (!coin) {
          errors.push(
            `Line ${i + 1}: Coin "${row.coin}" not found in market data`
          );
          continue;
        }

        transactions.push({
          date: row.date,
          type: type as 'buy' | 'sell',
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          coinImage: coin.image,
          amount,
          price,
          total: amount * price,
          notes: row.notes || '',
        });
      } catch (err) {
        errors.push(
          `Line ${i + 1}: ${err instanceof Error ? err.message : 'Invalid data'}`
        );
      }
    }

    if (errors.length > 0) {
      throw new Error(`Import errors:\n${errors.join('\n')}`);
    }

    if (transactions.length === 0) {
      throw new Error('No valid transactions found');
    }

    return transactions;
  };

  const exampleCSV = `date,type,coin,amount,price,notes
2024-01-15,buy,Bitcoin,0.5,42000,First purchase
2024-02-01,buy,Ethereum,2,2800,
2024-02-15,sell,Bitcoin,0.1,45000,Partial sell`;

  const handlePreview = () => {
    try {
      setError(null);
      if (!coins) {
        setError('Loading coin data... Please try again in a moment.');
        return;
      }
      const transactions = parseCSV(importData);
      setPreview(transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid CSV format');
      setPreview([]);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const tx of preview) {
        try {
          if (tx.type === 'buy') {
            const success = await buyCoin(
              tx.coinId,
              tx.coinName,
              tx.coinSymbol,
              tx.coinImage || '',
              tx.amount,
              tx.price,
              new Date(tx.date).toISOString(),
              tx.notes
            );
            if (success) successCount++;
            else errorCount++;
          } else {
            const success = await sellCoin(
              tx.coinId,
              tx.coinName,
              tx.coinSymbol,
              tx.coinImage || '',
              tx.amount,
              tx.price,
              new Date(tx.date).toISOString(),
              tx.notes
            );
            if (success) successCount++;
            else errorCount++;
          }
        } catch {
          errorCount++;
        }
      }

      alert(
        `Import completed: ${successCount} successful, ${errorCount} failed`
      );
      setPreview([]);
      setImportData('');
    } finally {
      setImporting(false);
    }
  };

  if (!coins) {
    return (
      <div className="card p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-[var(--text-secondary)]">
            Loading coin data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        📤 Import Transactions from CSV
      </h2>

      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            CSV Format:
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            Required columns: date, type, coin, amount, price
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            Coin can be name (Bitcoin) or symbol (BTC)
          </p>
          <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-800 overflow-x-auto text-[var(--text-primary)]">
            {exampleCSV}
          </pre>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Paste your CSV data:
          </label>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-[var(--bg-card)] text-[var(--text-primary)]"
            placeholder="Paste CSV here..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm whitespace-pre-line border border-red-200 dark:border-red-800">
            ❌ {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            disabled={!importData.trim()}
            className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0 || importing}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : 'Import Transactions'}
          </button>
        </div>

        {preview.length > 0 && (
          <div>
            <h3 className="font-medium text-[var(--text-primary)] mb-3">
              Preview ({preview.length} transactions):
            </h3>
            <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-[var(--border-color)] text-sm">
                <thead className="bg-[var(--hover-bg)]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)]">
                      Coin
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">
                      Price
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-[var(--text-secondary)]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {preview.map((tx, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <td className="px-4 py-2 text-[var(--text-primary)]">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tx.type === 'buy'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {tx.coinImage && (
                            <img
                              src={tx.coinImage}
                              alt={tx.coinName}
                              className="w-5 h-5"
                            />
                          )}
                          <span className="text-[var(--text-primary)]">
                            {tx.coinName}
                          </span>
                          <span className="text-[var(--text-secondary)] text-xs">
                            {tx.coinSymbol.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[var(--text-primary)]">
                        {tx.amount.toFixed(4)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[var(--text-primary)]">
                        <FormatPrice value={tx.price} />
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-[var(--text-primary)]">
                        <FormatPrice value={tx.total} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
