export interface Transaction {
  coinImage: string;
  id: string;
  type: 'buy' | 'sell';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  price: number;
  date: string;
  total: number;
  notes?: string;
}

export interface PortfolioItem {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  totalAmount: number;
  transactions: Transaction[];
}

export interface PortfolioStats {
  totalInvested: number;
  totalSold: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  realizedProfitLoss: number;
  unrealizedProfitLoss: number;
  topPerformer: {
    coinId: string;
    coinName: string;
    profitLossPercentage: number;
  } | null;
  worstPerformer: {
    coinId: string;
    coinName: string;
    profitLossPercentage: number;
  } | null;
  diversification: {
    coinId: string;
    coinName: string;
    percentage: number;
    value: number;
  }[];
}
