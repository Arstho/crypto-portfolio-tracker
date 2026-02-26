import React, { useState } from 'react';
import { FormatPrice } from '../../../shared/components/FormatPrice/FormatPrice';
import { Modal } from '../../../shared/components/Modal/Modal';
import { usePortfolio } from '../hooks/usePortfolio';

interface SellCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  maxAmount: number;
  avgBuyPrice: number;
  currentPrice: number;
}

export const SellCoinModal: React.FC<SellCoinModalProps> = ({
  isOpen,
  onClose,
  coinId,
  coinName,
  coinSymbol,
  coinImage,
  maxAmount,
  avgBuyPrice,
  currentPrice,
}) => {
  const { sellCoin, error, clearError } = usePortfolio();

  const [amount, setAmount] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>(currentPrice.toString());
  const [sellDate, setSellDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(sellPrice);

    const success = sellCoin(
      coinId,
      coinName,
      coinSymbol,
      coinImage,
      numAmount,
      numPrice,
      new Date(sellDate).toISOString(),
      notes
    );

    if (success) {
      setAmount('');
      setSellPrice(currentPrice.toString());
      setSellDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      onClose();
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const numPrice = parseFloat(sellPrice) || 0;
  const totalReceived = numAmount * numPrice;
  const profitLoss = numAmount * (numPrice - avgBuyPrice);
  const profitLossPercentage =
    avgBuyPrice > 0 ? ((numPrice - avgBuyPrice) / avgBuyPrice) * 100 : 0;

  const setMaxAmount = () => {
    setAmount(maxAmount.toString());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Sell ${coinName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img src={coinImage} alt={coinName} className="w-10 h-10" />
          <div>
            <div className="font-medium text-gray-900">{coinName}</div>
            <div className="text-sm text-gray-500">
              {coinSymbol.toUpperCase()}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-500">Available</div>
            <div className="font-semibold">
              {maxAmount.toFixed(4)} {coinSymbol.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="min-h-[70px]">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Current Price P&L:</div>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                <FormatPrice value={currentPrice} />
              </span>
              <span
                className={
                  profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                }
              >
                {profitLossPercentage >= 0 ? '+' : ''}
                {profitLossPercentage.toFixed(2)}%
              </span>
            </div>
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
            Amount to Sell <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
              max={maxAmount}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-gray-500">
              {coinSymbol.toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            onClick={setMaxAmount}
            className="mt-1 text-xs text-blue-500 hover:text-blue-600"
          >
            Max: {maxAmount.toFixed(4)} {coinSymbol.toUpperCase()}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sell Price (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
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
            Sale Date
          </label>
          <input
            type="date"
            value={sellDate}
            onChange={(e) => setSellDate(e.target.value)}
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
            placeholder="Add any notes about this sale..."
          />
        </div>

        <div className="space-y-2 min-h-[140px]">
          {amount && sellPrice ? (
            <>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-1">
                  You will receive:
                </div>
                <div className="text-xl font-bold text-green-700">
                  <FormatPrice value={totalReceived} />
                </div>
              </div>

              <div
                className={`p-3 rounded-lg ${
                  profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div
                  className={`text-sm mb-1 ${
                    profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  Profit/Loss:
                </div>
                <div
                  className={`text-lg font-bold ${
                    profitLoss >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {profitLoss >= 0 ? '+' : '-'}
                  <FormatPrice value={Math.abs(profitLoss)} />
                  <span className="text-sm ml-2">
                    ({profitLossPercentage >= 0 ? '+' : ''}
                    {profitLossPercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-sm text-gray-400 mb-1">
                  You will receive:
                </div>
                <div className="text-xl font-bold text-gray-300">$0.00</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-sm text-gray-400 mb-1">Profit/Loss:</div>
                <div className="text-lg font-bold text-gray-300">
                  $0.00 (0.00%)
                </div>
              </div>
            </>
          )}
        </div>

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
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sell
          </button>
        </div>
      </form>
    </Modal>
  );
};
