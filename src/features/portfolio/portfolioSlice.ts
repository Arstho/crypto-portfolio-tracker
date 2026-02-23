import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { mockCoins } from '../../shared/mocks/cryptos';
import { type PortfolioItem, type PortfolioStats } from './types';

interface PortfolioState {
  items: PortfolioItem[];
  loading: boolean;
  error: string | null;
}

const loadFromLocalStorage = (): PortfolioItem[] => {
  try {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: PortfolioState = {
  items: loadFromLocalStorage(),
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addPortfolioItem: (
      state,
      action: PayloadAction<Omit<PortfolioItem, 'id' | 'totalSpent'>>
    ) => {
      const newItem: PortfolioItem = {
        ...action.payload,
        id: crypto.randomUUID(),
        totalSpent: action.payload.amount * action.payload.purchasePrice,
      };

      state.items.push(newItem);

      localStorage.setItem('portfolio', JSON.stringify(state.items));
    },

    removePortfolioItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('portfolio', JSON.stringify(state.items));
    },

    updatePortfolioItem: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<PortfolioItem> }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.updates,
          totalSpent:
            (action.payload.updates.amount || state.items[index].amount) *
            (action.payload.updates.purchasePrice ||
              state.items[index].purchasePrice),
        };
        localStorage.setItem('portfolio', JSON.stringify(state.items));
      }
    },

    clearPortfolio: (state) => {
      state.items = [];
      localStorage.removeItem('portfolio');
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const selectPortfolioItems = (state: { portfolio: PortfolioState }) =>
  state.portfolio.items;

export const selectPortfolioLoading = (state: { portfolio: PortfolioState }) =>
  state.portfolio.loading;

export const selectPortfolioError = (state: { portfolio: PortfolioState }) =>
  state.portfolio.error;

export const selectPortfolioStats = createSelector(
  [selectPortfolioItems, (_, coins: typeof mockCoins) => coins],
  (items, coins): PortfolioStats => {
    if (items.length === 0) {
      return {
        totalInvested: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        topPerformer: null,
        worstPerformer: null,
        diversification: [],
      };
    }

    const coinGroups = items.reduce(
      (acc, item) => {
        const coin = coins.find((c) => c.id === item.coinId);
        const currentPrice = coin?.current_price || 0;

        if (!acc[item.coinId]) {
          acc[item.coinId] = {
            coinId: item.coinId,
            coinName: item.coinName,
            coinSymbol: item.coinSymbol,
            totalAmount: 0,
            totalInvested: 0,
            currentPrice,
            transactions: [],
          };
        }

        acc[item.coinId].totalAmount += item.amount;
        acc[item.coinId].totalInvested += item.totalSpent;
        acc[item.coinId].transactions.push(item);

        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>
    );

    let totalInvested = 0;
    let totalCurrentValue = 0;
    const performers: {
      coinId: string;
      coinName: string;
      profitLossPercentage: number;
    }[] = [];
    const diversification = [];

    for (const [coinId, group] of Object.entries(coinGroups)) {
      const currentValue = group.totalAmount * group.currentPrice;
      totalInvested += group.totalInvested;
      totalCurrentValue += currentValue;

      const profitLossPercentage =
        group.totalInvested > 0
          ? ((currentValue - group.totalInvested) / group.totalInvested) * 100
          : 0;

      performers.push({
        coinId,
        coinName: group.coinName,
        profitLossPercentage,
      });

      diversification.push({
        coinId,
        coinName: group.coinName,
        percentage:
          totalCurrentValue > 0 ? (currentValue / totalCurrentValue) * 100 : 0,
        value: currentValue,
      });
    }

    performers.sort((a, b) => b.profitLossPercentage - a.profitLossPercentage);

    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalProfitLossPercentage =
      totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    diversification.sort((a, b) => b.percentage - a.percentage);

    return {
      totalInvested,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      topPerformer: performers[0] || null,
      worstPerformer: performers[performers.length - 1] || null,
      diversification,
    };
  }
);

export const selectPortfolioWithCurrentPrices = createSelector(
  [selectPortfolioItems, (_, coins: typeof mockCoins) => coins],
  (items, coins) => {
    return items.map((item) => {
      const coin = coins.find((c) => c.id === item.coinId);
      const currentPrice = coin?.current_price || 0;
      const currentValue = item.amount * currentPrice;
      const profitLoss = currentValue - item.totalSpent;
      const profitLossPercentage =
        item.totalSpent > 0 ? (profitLoss / item.totalSpent) * 100 : 0;

      return {
        ...item,
        currentPrice,
        currentValue,
        profitLoss,
        profitLossPercentage,
      };
    });
  }
);

export const {
  addPortfolioItem,
  removePortfolioItem,
  updatePortfolioItem,
  clearPortfolio,
  setError,
  clearError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
