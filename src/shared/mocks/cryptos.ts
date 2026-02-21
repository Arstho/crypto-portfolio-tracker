export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  last_updated: string;
}

export interface CoinDetail extends Coin {
  description: string;
  homepage: string;
  github: string;
  price_change_percentage_1h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  price_change_percentage_1y: number;
}

export interface ChartData {
  prices: [number, number][];
}

const generatePriceHistory = (
  basePrice: number,
  days: number
): [number, number][] => {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const prices: [number, number][] = [];

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * dayInMs;
    // Добавляем случайные колебания ±10%
    const randomFactor = 0.9 + Math.random() * 0.2;
    const price = basePrice * randomFactor;
    prices.push([timestamp, price]);
  }

  return prices;
};

export const mockCoins: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 52345.67,
    market_cap: 1023456789000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.34,
    total_volume: 28976543210,
    high_24h: 53123.45,
    low_24h: 51234.56,
    circulating_supply: 19500000,
    total_supply: 21000000,
    ath: 69000,
    ath_change_percentage: -24.5,
    atl: 67.81,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2876.54,
    market_cap: 345678901234,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.23,
    total_volume: 15678901234,
    high_24h: 2956.78,
    low_24h: 2845.67,
    circulating_supply: 120234567,
    total_supply: null,
    ath: 4878.26,
    ath_change_percentage: -41.2,
    atl: 0.43,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'Binance Coin',
    image:
      'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 398.23,
    market_cap: 61234567890,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.56,
    total_volume: 1234567890,
    high_24h: 402.15,
    low_24h: 395.67,
    circulating_supply: 153432567,
    total_supply: 200000000,
    ath: 690.93,
    ath_change_percentage: -42.3,
    atl: 0.1,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 102.45,
    market_cap: 45678901234,
    market_cap_rank: 4,
    price_change_percentage_24h: 5.67,
    total_volume: 2345678901,
    high_24h: 103.89,
    low_24h: 97.23,
    circulating_supply: 446000000,
    total_supply: 560000000,
    ath: 259.96,
    ath_change_percentage: -60.5,
    atl: 0.5,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.45,
    market_cap: 15678901234,
    market_cap_rank: 5,
    price_change_percentage_24h: -0.89,
    total_volume: 567890123,
    high_24h: 0.46,
    low_24h: 0.44,
    circulating_supply: 35000000000,
    total_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -85.4,
    atl: 0.02,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image:
      'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.62,
    market_cap: 33456789012,
    market_cap_rank: 6,
    price_change_percentage_24h: 1.23,
    total_volume: 1789012345,
    high_24h: 0.63,
    low_24h: 0.61,
    circulating_supply: 54000000000,
    total_supply: 100000000000,
    ath: 3.4,
    ath_change_percentage: -81.8,
    atl: 0.002,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 6.78,
    market_cap: 8901234567,
    market_cap_rank: 7,
    price_change_percentage_24h: -2.34,
    total_volume: 345678901,
    high_24h: 6.95,
    low_24h: 6.7,
    circulating_supply: 1310000000,
    total_supply: 1400000000,
    ath: 54.98,
    ath_change_percentage: -87.7,
    atl: 2.69,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.082,
    market_cap: 11789012345,
    market_cap_rank: 8,
    price_change_percentage_24h: 3.45,
    total_volume: 890123456,
    high_24h: 0.083,
    low_24h: 0.079,
    circulating_supply: 143000000000,
    total_supply: null,
    ath: 0.73,
    ath_change_percentage: -88.8,
    atl: 0.000086,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'avalanche',
    symbol: 'avax',
    name: 'Avalanche',
    image:
      'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite.png',
    current_price: 32.45,
    market_cap: 12345678901,
    market_cap_rank: 9,
    price_change_percentage_24h: 4.56,
    total_volume: 567890123,
    high_24h: 33.12,
    low_24h: 31.23,
    circulating_supply: 380000000,
    total_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -77.6,
    atl: 2.79,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image:
      'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 14.23,
    market_cap: 8345678901,
    market_cap_rank: 10,
    price_change_percentage_24h: -0.12,
    total_volume: 456789012,
    high_24h: 14.56,
    low_24h: 14.01,
    circulating_supply: 587000000,
    total_supply: 1000000000,
    ath: 52.88,
    ath_change_percentage: -73.1,
    atl: 0.13,
    last_updated: new Date().toISOString(),
  },
];

export const getMockCoinDetail = (id: string): CoinDetail | undefined => {
  const coin = mockCoins.find((c) => c.id === id);
  if (!coin) return undefined;

  return {
    ...coin,
    description: `${coin.name} is one of the leading cryptocurrencies in the market. It has a strong community and innovative technology that aims to revolutionize the financial industry. The project focuses on decentralization, security, and scalability.`,
    homepage: `https://${coin.name.toLowerCase().replace(' ', '')}.org`,
    github: `https://github.com/${coin.name.toLowerCase().replace(' ', '')}`,
    price_change_percentage_1h: Math.random() * 6 - 3, // -3% to +3%
    price_change_percentage_7d: Math.random() * 20 - 10, // -10% to +10%
    price_change_percentage_30d: Math.random() * 40 - 20, // -20% to +20%
    price_change_percentage_1y: Math.random() * 100 - 30, // -30% to +70%
  };
};

export const getMockChartData = (id: string, days: number = 30): ChartData => {
  const coin = mockCoins.find((c) => c.id === id);
  const basePrice = coin?.current_price || 100;

  return {
    prices: generatePriceHistory(basePrice, days),
  };
};

export const searchMockCoins = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return mockCoins
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowerQuery) ||
        coin.symbol.toLowerCase().includes(lowerQuery)
    )
    .map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      market_cap_rank: coin.market_cap_rank,
      thumb: coin.image,
    }));
};
