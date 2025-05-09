import { Market, Bet } from './types';
import { memoize } from './utils';

const API_URL = 'https://api.manifold.markets/v0';

type GetBetsParams = Partial<{
  limit: number, before: string, after: string, order: string, userId: string, username: string, contractId: string, contractSlug: string
}>;

const DEFAULT_BETS_PARAMS: GetBetsParams = {};

const paramsToString = (params: Record<string, string | number | undefined>) => {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    )
  ).toString();
};

const fetchWithErrorHandling = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response;
};

export const fetchMarket = memoize(async (id: string) => {
  const response = await fetchWithErrorHandling(`${API_URL}/market/${id}`);

  return response.json() as Promise<Market>;
});

export const fetchMarkets = async (marketIds: string[], setLoadingProgress: (progress: { total: number, loaded: number }) => void) => {
  const batchSize = 4;
  const batches = [];
  const markets = [];
  for (let i = 0; i < marketIds.length; i += batchSize) {
    batches.push(marketIds.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    markets.push(...(await Promise.all(batch.map(fetchMarket))));
    setLoadingProgress({ total: marketIds.length, loaded: markets.length });
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return markets;
};

export const fetchBets = memoize(async (params: GetBetsParams) => {
  const queryParams = paramsToString({ ...DEFAULT_BETS_PARAMS, ...params });
  const response = await fetchWithErrorHandling(`${API_URL}/bets?${queryParams}`);
  return response.json() as Promise<Bet[]>;
});
