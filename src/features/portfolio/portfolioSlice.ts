import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { mockCoins } from '../../shared/mocks/cryptos';
import type { PortfolioItem, PortfolioStats, Transaction } from './types';

interface PortfolioState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

interface Performer {
  coinId: string;
  coinName: string;
  profitLossPercentage: number;
}

const loadFromLocalStorage = (): Transaction[] => {
  try {
    const saved = localStorage.getItem('portfolioTransactions');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: PortfolioState = {
  transactions: loadFromLocalStorage(),
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addTransaction: (
      state,
      action: PayloadAction<Omit<Transaction, 'id' | 'total'>>
    ) => {
      const newTransaction: Transaction = {
        ...action.payload,
        id: crypto.randomUUID(),
        total: action.payload.amount * action.payload.price,
      };

      state.transactions.push(newTransaction);

      if (action.payload.type === 'sell') {
        const coinTransactions = state.transactions.filter(
          (t) => t.coinId === action.payload.coinId
        );

        const totalBought = coinTransactions
          .filter((t) => t.type === 'buy')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalSold = coinTransactions
          .filter((t) => t.type === 'sell')
          .reduce((sum, t) => sum + t.amount, 0);

        if (totalSold > totalBought) {
          state.error = 'Cannot sell more than you own';
          state.transactions = state.transactions.filter(
            (t) => t.id !== newTransaction.id
          );
          return;
        }
      }

      localStorage.setItem(
        'portfolioTransactions',
        JSON.stringify(state.transactions)
      );
      state.error = null;
    },

    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      localStorage.setItem(
        'portfolioTransactions',
        JSON.stringify(state.transactions)
      );
    },

    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Transaction> }>
    ) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        const transaction = state.transactions[index];
        const updatedTransaction = {
          ...transaction,
          ...action.payload.updates,
        };

        if (action.payload.updates.amount || action.payload.updates.price) {
          updatedTransaction.total =
            (action.payload.updates.amount || transaction.amount) *
            (action.payload.updates.price || transaction.price);
        }

        state.transactions[index] = updatedTransaction;
        localStorage.setItem(
          'portfolioTransactions',
          JSON.stringify(state.transactions)
        );
      }
    },

    clearAllTransactions: (state) => {
      state.transactions = [];
      localStorage.removeItem('portfolioTransactions');
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const selectTransactions = (state: { portfolio: PortfolioState }) =>
  state.portfolio.transactions;

export const selectPortfolioError = (state: { portfolio: PortfolioState }) =>
  state.portfolio.error;

export const selectPortfolioItems = createSelector(
  [selectTransactions],
  (transactions): PortfolioItem[] => {
    const itemsMap = new Map<string, PortfolioItem>();

    transactions.forEach((transaction) => {
      if (!itemsMap.has(transaction.coinId)) {
        itemsMap.set(transaction.coinId, {
          coinId: transaction.coinId,
          coinName: transaction.coinName,
          coinSymbol: transaction.coinSymbol,
          coinImage: transaction.coinImage,
          totalAmount: 0,
          transactions: [],
        });
      }

      const item = itemsMap.get(transaction.coinId)!;
      item.transactions.push(transaction);

      if (transaction.type === 'buy') {
        item.totalAmount += transaction.amount;
      } else {
        item.totalAmount -= transaction.amount;
      }
    });

    return Array.from(itemsMap.values()).filter((item) => item.totalAmount > 0);
  }
);

export const selectPortfolioStats = createSelector(
  [
    selectTransactions,
    selectPortfolioItems,
    (_, coins: typeof mockCoins) => coins,
  ],
  (transactions, items, coins): PortfolioStats => {
    if (transactions.length === 0) {
      return {
        totalInvested: 0,
        totalSold: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        realizedProfitLoss: 0,
        unrealizedProfitLoss: 0,
        topPerformer: null,
        worstPerformer: null,
        diversification: [],
      };
    }

    const coinStats = new Map();

    transactions.forEach((t) => {
      if (!coinStats.has(t.coinId)) {
        coinStats.set(t.coinId, {
          buys: [] as { amount: number; price: number; date: string }[],
          totalBought: 0,
          totalSpent: 0,
          totalSoldAmount: 0,
          totalReceived: 0,
        });
      }

      const stats = coinStats.get(t.coinId);

      if (t.type === 'buy') {
        stats.buys.push({ amount: t.amount, price: t.price, date: t.date });
        stats.totalBought += t.amount;
        stats.totalSpent += t.total;
      } else {
        stats.totalSoldAmount += t.amount;
        stats.totalReceived += t.total;

        let remainingToSell = t.amount;
        let costOfSold = 0;

        while (remainingToSell > 0 && stats.buys.length > 0) {
          const oldestBuy = stats.buys[0];
          const sellAmount = Math.min(remainingToSell, oldestBuy.amount);

          costOfSold += sellAmount * oldestBuy.price;
          oldestBuy.amount -= sellAmount;
          remainingToSell -= sellAmount;

          if (oldestBuy.amount === 0) {
            stats.buys.shift();
          }
        }

        stats.realizedProfit =
          (stats.realizedProfit || 0) + (t.total - costOfSold);
      }
    });

    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalRealizedProfit = 0;
    const performers: Performer[] = [];

    const coinData = items.map((item) => {
      const coin = coins.find((c) => c.id === item.coinId);
      const currentPrice = coin?.current_price || 0;
      const currentValue = item.totalAmount * currentPrice;

      const stats = coinStats.get(item.coinId);
      const remainingCost =
        stats?.buys.reduce(
          (sum: number, buy: { amount: number; price: number }) =>
            sum + buy.amount * buy.price,
          0
        ) || 0;

      return {
        item,
        currentValue,
        remainingCost,
        realizedProfit: stats?.realizedProfit || 0,
        coinName: item.coinName,
        coinId: item.coinId,
      };
    });

    coinData.forEach((data) => {
      totalInvested += data.remainingCost;
      totalCurrentValue += data.currentValue;
      totalRealizedProfit += data.realizedProfit;
    });

    const diversification = coinData.map((data) => {
      const unrealizedProfit = data.currentValue - data.remainingCost;
      const totalProfitLoss = data.realizedProfit + unrealizedProfit;
      const totalProfitLossPercentage =
        data.remainingCost > 0
          ? (totalProfitLoss / data.remainingCost) * 100
          : 0;

      performers.push({
        coinId: data.coinId,
        coinName: data.coinName,
        profitLossPercentage: totalProfitLossPercentage,
      });

      return {
        coinId: data.coinId,
        coinName: data.coinName,
        percentage:
          totalCurrentValue > 0
            ? (data.currentValue / totalCurrentValue) * 100
            : 0,
        value: data.currentValue,
      };
    });

    performers.sort((a, b) => b.profitLossPercentage - a.profitLossPercentage);
    diversification.sort((a, b) => b.percentage - a.percentage);

    const totalProfitLoss =
      totalCurrentValue - totalInvested + totalRealizedProfit;
    const totalProfitLossPercentage =
      totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalSold: transactions
        .filter((t) => t.type === 'sell')
        .reduce((sum, t) => sum + t.total, 0),
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      realizedProfitLoss: totalRealizedProfit,
      unrealizedProfitLoss: totalCurrentValue - totalInvested,
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
      const currentValue = item.totalAmount * currentPrice;

      const buys = item.transactions.filter((t) => t.type === 'buy');
      const totalSpent = buys.reduce((sum, t) => sum + t.total, 0);
      const totalBought = buys.reduce((sum, t) => sum + t.amount, 0);
      const avgBuyPrice = totalBought > 0 ? totalSpent / totalBought : 0;

      const profitLoss = currentValue - totalSpent;
      const profitLossPercentage =
        totalSpent > 0 ? (profitLoss / totalSpent) * 100 : 0;

      return {
        ...item,
        avgBuyPrice,
        currentPrice,
        currentValue,
        profitLoss,
        profitLossPercentage,
        totalSpent,
      };
    });
  }
);

export const selectCoinTransactions = (coinId: string) =>
  createSelector([selectTransactions], (transactions) =>
    transactions
      .filter((t) => t.coinId === coinId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

export const {
  addTransaction,
  removeTransaction,
  updateTransaction,
  clearAllTransactions,
  setError,
  clearError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
