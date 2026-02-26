import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  USE_MOCK_DATA,
  USE_MOCK_FOR_DEVELOPMENT,
} from '../../shared/config/api';
import {
  getMockChartData,
  getMockCoinDetail,
  mockCoins,
  searchMockCoins,
} from '../../shared/mocks/cryptos';
import type {
  ChartData,
  Coin,
  CoinDetail,
  CoinGeckoChartData,
  CoinGeckoCoin,
  CoinGeckoCoinDetail,
  CoinGeckoSearchResult,
} from '../../shared/types/coinGecko';

const convertToCoin = (apiCoin: CoinGeckoCoin): Coin => ({
  id: apiCoin.id,
  symbol: apiCoin.symbol,
  name: apiCoin.name,
  image: apiCoin.image,
  current_price: apiCoin.current_price,
  market_cap: apiCoin.market_cap,
  market_cap_rank: apiCoin.market_cap_rank,
  price_change_percentage_24h: apiCoin.price_change_percentage_24h,
  total_volume: apiCoin.total_volume,
  high_24h: apiCoin.high_24h,
  low_24h: apiCoin.low_24h,
  circulating_supply: apiCoin.circulating_supply,
  total_supply: apiCoin.total_supply,
  ath: apiCoin.ath,
  ath_change_percentage: apiCoin.ath_change_percentage,
  atl: apiCoin.atl,
  last_updated: apiCoin.last_updated,
});

const convertToCoinDetail = (apiDetail: CoinGeckoCoinDetail): CoinDetail => ({
  id: apiDetail.id,
  symbol: apiDetail.symbol,
  name: apiDetail.name,
  image: apiDetail.image.large,
  current_price: apiDetail.market_data.current_price.usd,
  market_cap: apiDetail.market_data.market_cap.usd,
  market_cap_rank: apiDetail.market_cap_rank,
  price_change_percentage_24h:
    apiDetail.market_data.price_change_percentage_24h_in_currency.usd,
  total_volume: apiDetail.market_data.total_volume.usd,
  high_24h: apiDetail.market_data.high_24h.usd,
  low_24h: apiDetail.market_data.low_24h.usd,
  circulating_supply: apiDetail.market_data.circulating_supply,
  total_supply: apiDetail.market_data.total_supply,
  ath: apiDetail.market_data.ath.usd,
  ath_change_percentage: apiDetail.market_data.ath_change_percentage.usd,
  atl: apiDetail.market_data.atl.usd,
  last_updated: new Date().toISOString(),
  description: apiDetail.description.en || 'No description available.',
  homepage: apiDetail.links.homepage[0] || '',
  github: apiDetail.links.repos_url.github[0] || '',
  price_change_percentage_1h:
    apiDetail.market_data.price_change_percentage_1h_in_currency?.usd || 0,
  price_change_percentage_7d:
    apiDetail.market_data.price_change_percentage_7d_in_currency?.usd || 0,
  price_change_percentage_30d:
    apiDetail.market_data.price_change_percentage_30d_in_currency?.usd || 0,
  price_change_percentage_1y:
    apiDetail.market_data.price_change_percentage_1y_in_currency?.usd || 0,
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useMock = USE_MOCK_DATA || USE_MOCK_FOR_DEVELOPMENT;

if (useMock) {
  console.log('🔧 Using MOCK crypto data');
} else {
  console.log('🌐 Using REAL CoinGecko API');
}

export const cryptoApi = useMock
  ? // Моковая версия API
    createApi({
      reducerPath: 'cryptoApi',
      baseQuery: fetchBaseQuery({ baseUrl: '/' }),
      endpoints: (builder) => ({
        getCoins: builder.query<Coin[], { page?: number; perPage?: number }>({
          queryFn: async ({ page = 1, perPage = 50 }) => {
            await delay(500);
            const data = mockCoins.slice((page - 1) * perPage, page * perPage);
            return { data };
          },
        }),
        getCoinById: builder.query<CoinDetail, string>({
          queryFn: async (id) => {
            await delay(500);
            const data = getMockCoinDetail(id);
            if (data) {
              return { data };
            }
            return { error: { status: 404, data: 'Coin not found' } };
          },
        }),
        getCoinHistory: builder.query<ChartData, { id: string; days: number }>({
          queryFn: async ({ id, days }) => {
            await delay(500);
            return { data: getMockChartData(id, days) };
          },
        }),
        searchCoins: builder.query<
          Array<{
            id: string;
            name: string;
            symbol: string;
            market_cap_rank: number;
            thumb: string;
          }>,
          string
        >({
          queryFn: async (query) => {
            await delay(300);
            if (!query) return { data: [] };
            return { data: searchMockCoins(query) };
          },
        }),
      }),
    })
  : // Реальная версия API
    createApi({
      reducerPath: 'cryptoApi',
      baseQuery: fetchBaseQuery({
        baseUrl:
          import.meta.env.VITE_COINGECKO_BASE_URL ||
          'https://api.coingecko.com/api/v3',
        prepareHeaders: (headers) => {
          const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
          if (apiKey) {
            headers.set('x-cg-demo-api-key', apiKey);
          }
          return headers;
        },
      }),
      endpoints: (builder) => ({
        getCoins: builder.query<Coin[], { page?: number; perPage?: number }>({
          query: ({ page = 1, perPage = 50 }) =>
            `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`,
          transformResponse: (response: CoinGeckoCoin[]) =>
            response.map(convertToCoin),
        }),
        getCoinById: builder.query<CoinDetail, string>({
          query: (id) =>
            `coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
          transformResponse: (response: CoinGeckoCoinDetail) =>
            convertToCoinDetail(response),
        }),
        getCoinHistory: builder.query<ChartData, { id: string; days: number }>({
          query: ({ id, days }) =>
            `coins/${id}/market_chart?vs_currency=usd&days=${days}`,
          transformResponse: (response: CoinGeckoChartData) => ({
            prices: response.prices,
          }),
        }),
        searchCoins: builder.query<
          Array<{
            id: string;
            name: string;
            symbol: string;
            market_cap_rank: number;
            thumb: string;
          }>,
          string
        >({
          query: (query) => `search?query=${query}`,
          transformResponse: (response: CoinGeckoSearchResult) =>
            response.coins.map((coin) => ({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              market_cap_rank: coin.market_cap_rank || 999,
              thumb: coin.thumb,
            })),
        }),
      }),
    });

export const {
  useGetCoinsQuery,
  useGetCoinByIdQuery,
  useGetCoinHistoryQuery,
  useSearchCoinsQuery,
  useLazySearchCoinsQuery,
} = cryptoApi;

export type { ChartData, Coin, CoinDetail } from '../../shared/types/coinGecko';
