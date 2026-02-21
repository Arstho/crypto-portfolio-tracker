import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  type ChartData,
  type Coin,
  type CoinDetail,
  getMockChartData,
  getMockCoinDetail,
  mockCoins,
  searchMockCoins,
} from '../../shared/mocks/cryptos';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getCoins: builder.query<Coin[], { page?: number; perPage?: number }>({
      async queryFn({ page = 1, perPage = 50 }) {
        await delay(800); // Имитация загрузки
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return { data: mockCoins.slice(start, end) };
      },
    }),

    getCoinById: builder.query<CoinDetail, string>({
      async queryFn(id) {
        await delay(600);
        const coinDetail = getMockCoinDetail(id);
        if (coinDetail) {
          return { data: coinDetail };
        }
        return { error: { status: 404, data: 'Coin not found' } };
      },
    }),

    getCoinHistory: builder.query<ChartData, { id: string; days: number }>({
      async queryFn({ id, days }) {
        await delay(400);
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
      async queryFn(query) {
        await delay(300);
        if (!query) return { data: [] };
        return { data: searchMockCoins(query) };
      },
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
