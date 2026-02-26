export const USE_MOCK_DATA = false;

export const USE_MOCK_FOR_DEVELOPMENT =
  import.meta.env.DEV && !import.meta.env.VITE_COINGECKO_API_KEY;
