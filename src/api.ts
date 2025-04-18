import { Market, Bet } from './types';

const API_URL = 'https://api.manifold.markets/v0';

const memoize = <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) => {
  const calls = new Map<string, Promise<unknown>>();
  return async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (!calls.has(key)) {
      calls.set(key, fn(...args));
    }
    return calls.get(key);
  };
};

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

export const fetchMarket = memoize(async (id: string) => {
  const response = await fetch(`${API_URL}/market/${id}`);
  return response.json() as Promise<Market>;
});

export const fetchBets = memoize(async (params: GetBetsParams) => {
  const queryParams = paramsToString({ ...DEFAULT_BETS_PARAMS, ...params });
  const response = await fetch(`${API_URL}/bets?${queryParams}`);
  return response.json() as Promise<Bet[]>;
});
