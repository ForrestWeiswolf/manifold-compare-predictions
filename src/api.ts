import { Market, User, Bet } from './types';

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

export async function fetchMarket(id: string) {
  const response = await fetch(`${API_URL}/market/${id}`);
  return response.json() as Promise<Market>;
}

export async function fetchUser(username: string) {
  const response = await fetch(`${API_URL}/user/${username}`);
  return response.json() as Promise<User>;
}

export async function fetchBets(params: GetBetsParams) {
  const queryParams = paramsToString({ ...DEFAULT_BETS_PARAMS, ...params });
  const response = await fetch(`${API_URL}/bets?${queryParams}`);
  return response.json() as Promise<Bet[]>;
}
