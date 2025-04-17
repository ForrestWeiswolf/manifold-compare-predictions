import { Market, User, Bet } from './types';

const API_URL = 'https://api.manifold.markets/v0';

const memoize = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  const calls = new Map<string, Promise<any>>();
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

export const fetchMarket = memoize(async function fetchMarket(id: string) {
  const response = await fetch(`${API_URL}/market/${id}`);
  return response.json() as Promise<Market>;
});

export const fetchUser = memoize(async function fetchUser(username: string) {
  const response = await fetch(`${API_URL}/user/${username}`);
  return response.json() as Promise<User>;
});

export const fetchBets = memoize(async function fetchBets(params: GetBetsParams) {
  const queryParams = paramsToString({ ...DEFAULT_BETS_PARAMS, ...params });
  const response = await fetch(`${API_URL}/bets?${queryParams}`);
  return response.json() as Promise<Bet[]>;
});
