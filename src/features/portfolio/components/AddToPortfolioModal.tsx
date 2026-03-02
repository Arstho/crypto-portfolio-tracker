import React, { useState } from 'react';
import { FormatPrice } from '../../../shared/components/FormatPrice/FormatPrice';
import { Modal } from '../../../shared/components/Modal/Modal';
import type { Coin } from '../../../shared/types/coinGecko';
import { usePortfolio } from '../hooks/usePortfolio';

interface AddToPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: Coin;
}

export const AddToPortfolioModal: React.FC<AddToPortfolioModalProps> = ({
  isOpen,
  onClose,
  coin,
}) => {
  const { buyCoin, error, clearError } = usePortfolio();

  const [amount, setAmount] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>(
    coin.current_price.toString()
  );
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(purchasePrice);

    const success = buyCoin(
      coin.id,
      coin.name,
      coin.symbol,
      coin.image,
      numAmount,
      numPrice,
      new Date(purchaseDate).toISOString(),
      notes
    );

    if (success) {
      setAmount('');
      setPurchasePrice(coin.current_price.toString());
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      onClose();
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const numPrice = parseFloat(purchasePrice) || 0;
  const totalSpent = numAmount * numPrice;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Buy ${coin.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-[var(--hover-bg)] rounded-lg">
          <img src={coin.image} alt={coin.name} className="w-10 h-10" />
          <div>
            <div className="font-medium text-[var(--text-primary)]">
              {coin.name}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {coin.symbol.toUpperCase()}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-semibold text-[var(--text-primary)]">
              <FormatPrice value={coin.current_price} />
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Current price
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {error}
            <button
              type="button"
              onClick={clearError}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
              required
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-[var(--text-secondary)]">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Purchase Price (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-[var(--text-secondary)]">
              $
            </span>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              step="any"
              min="0"
              required
              className="w-full pl-8 pr-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Purchase Date
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
            placeholder="Add any notes about this purchase..."
          />
        </div>

        <div className="min-h-[80px]">
          {amount && purchasePrice ? (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Total Spent:</div>
              <div className="text-xl font-bold text-blue-700">
                <FormatPrice value={totalSpent} />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[var(--hover-bg)] rounded-lg border border-dashed border-[var(--border-color)]">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                Total Spent:
              </div>
              <div className="text-xl font-bold text-[var(--text-secondary)] opacity-50">
                $0.00
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add to Portfolio
          </button>
        </div>
      </form>
    </Modal>
  );
};
