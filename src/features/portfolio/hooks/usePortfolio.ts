import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { mockCoins } from '../../../shared/mocks/cryptos';
import {
  addTransaction,
  clearAllTransactions,
  clearError,
  removeTransaction,
  selectPortfolioError,
  selectPortfolioItems,
  selectPortfolioStats,
  selectPortfolioWithCurrentPrices,
  selectTransactions,
  setError,
  updateTransaction,
} from '../portfolioSlice';
import type { Transaction } from '../types';

export const usePortfolio = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const transactions = useAppSelector(selectTransactions);
  const items = useAppSelector(selectPortfolioItems);
  const itemsWithPrices = useAppSelector((state) =>
    selectPortfolioWithCurrentPrices(state, mockCoins)
  );
  const stats = useAppSelector((state) =>
    selectPortfolioStats(state, mockCoins)
  );
  const error = useAppSelector(selectPortfolioError);

  const addTransactionDirectly = useCallback(
    (transaction: Omit<Transaction, 'id' | 'total'>) => {
      dispatch(addTransaction(transaction));
    },
    [dispatch]
  );

  const buyCoin = useCallback(
    (
      coinId: string,
      coinName: string,
      coinSymbol: string,
      coinImage: string,
      amount: number,
      price: number,
      date?: string,
      notes?: string
    ) => {
      if (amount <= 0) {
        dispatch(setError('Amount must be greater than 0'));
        return false;
      }
      if (price <= 0) {
        dispatch(setError('Price must be greater than 0'));
        return false;
      }

      setLoading(true);
      try {
        dispatch(
          addTransaction({
            type: 'buy',
            coinId,
            coinName,
            coinSymbol,
            coinImage,
            amount,
            price,
            date: date || new Date().toISOString(),
            notes,
          })
        );
        return true;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const sellCoin = useCallback(
    (
      coinId: string,
      coinName: string,
      coinSymbol: string,
      coinImage: string,
      amount: number,
      price: number,
      date?: string,
      notes?: string
    ) => {
      if (amount <= 0) {
        dispatch(setError('Amount must be greater than 0'));
        return false;
      }
      if (price <= 0) {
        dispatch(setError('Price must be greater than 0'));
        return false;
      }

      const coinItem = items.find((item) => item.coinId === coinId);
      if (!coinItem || coinItem.totalAmount < amount) {
        dispatch(setError(`Not enough ${coinSymbol.toUpperCase()} to sell`));
        return false;
      }

      setLoading(true);
      try {
        dispatch(
          addTransaction({
            type: 'sell',
            coinId,
            coinName,
            coinSymbol,
            coinImage,
            amount,
            price,
            date: date || new Date().toISOString(),
            notes,
          })
        );
        return true;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, items]
  );

  const removeTransactionById = useCallback(
    (id: string) => {
      setLoading(true);
      try {
        dispatch(removeTransaction(id));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const updateTransactionById = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setLoading(true);
      try {
        dispatch(updateTransaction({ id, updates }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear your entire portfolio history?'
      )
    ) {
      setLoading(true);
      try {
        dispatch(clearAllTransactions());
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch]);

  const clearErrorMsg = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    transactions,
    items,
    itemsWithPrices,
    stats,
    loading,
    error,
    buyCoin,
    sellCoin,
    addTransaction: addTransactionDirectly,
    removeTransaction: removeTransactionById,
    updateTransaction: updateTransactionById,
    clearAll,
    clearError: clearErrorMsg,
  };
};
