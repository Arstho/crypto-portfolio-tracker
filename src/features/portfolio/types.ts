export interface PortfolioItem {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  totalSpent: number;
  notes?: string;
}

export interface PortfolioStats {
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
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
