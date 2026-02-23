import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { mockCoins } from '../../../shared/mocks/cryptos';
import {
  addPortfolioItem,
  clearError,
  clearPortfolio,
  removePortfolioItem,
  selectPortfolioError,
  selectPortfolioItems,
  selectPortfolioLoading,
  selectPortfolioStats,
  selectPortfolioWithCurrentPrices,
  setError,
  updatePortfolioItem,
} from '../portfolioSlice';
import { type PortfolioItem } from '../types';

export const usePortfolio = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectPortfolioItems);
  const itemsWithPrices = useAppSelector((state) =>
    selectPortfolioWithCurrentPrices(state, mockCoins)
  );
  const stats = useAppSelector((state) =>
    selectPortfolioStats(state, mockCoins)
  );
  const loading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  const addItem = useCallback(
    (
      coinId: string,
      coinName: string,
      coinSymbol: string,
      coinImage: string,
      amount: number,
      purchasePrice: number,
      purchaseDate?: string,
      notes?: string
    ) => {
      if (amount <= 0) {
        dispatch(setError('Amount must be greater than 0'));
        return;
      }
      if (purchasePrice <= 0) {
        dispatch(setError('Price must be greater than 0'));
        return;
      }

      dispatch(
        addPortfolioItem({
          coinId,
          coinName,
          coinSymbol,
          coinImage,
          amount,
          purchasePrice,
          purchaseDate: purchaseDate || new Date().toISOString(),
          notes,
        })
      );
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch(removePortfolioItem(id));
    },
    [dispatch]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<PortfolioItem>) => {
      dispatch(updatePortfolioItem({ id, updates }));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    if (
      window.confirm('Are you sure you want to clear your entire portfolio?')
    ) {
      dispatch(clearPortfolio());
    }
  }, [dispatch]);

  const clearErrorMsg = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    items,
    itemsWithPrices,
    stats,
    loading,
    error,
    addItem,
    removeItem,
    updateItem,
    clearAll,
    clearError: clearErrorMsg,
  };
};
