import React, { useState } from 'react';
import { FormatPrice } from '../../../shared/components/FormatPrice/FormatPrice';
import { Modal } from '../../../shared/components/Modal/Modal';
import type { Coin } from '../../../shared/mocks/cryptos';
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
  const { addItem, error, clearError } = usePortfolio();

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

    addItem(
      coin.id,
      coin.name,
      coin.symbol,
      coin.image,
      numAmount,
      numPrice,
      new Date(purchaseDate).toISOString(),
      notes
    );

    setAmount('');
    setPurchasePrice(coin.current_price.toString());
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    onClose();
  };

  const totalSpent = parseFloat(amount) * parseFloat(purchasePrice);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Buy ${coin.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img src={coin.image} alt={coin.name} className="w-10 h-10" />
          <div>
            <div className="font-medium text-gray-900">{coin.name}</div>
            <div className="text-sm text-gray-500">
              {coin.symbol.toUpperCase()}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-semibold">
              <FormatPrice value={coin.current_price} />
            </div>
            <div className="text-sm text-gray-500">Current price</div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-gray-500">
              {coin.symbol.toUpperCase()}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              step="any"
              min="0"
              required
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes about this purchase..."
          />
        </div>

        {amount && purchasePrice && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Total Spent:</div>
            <div className="text-xl font-bold text-blue-700">
              <FormatPrice value={totalSpent} />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
