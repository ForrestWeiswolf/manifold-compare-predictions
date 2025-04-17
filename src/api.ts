import { Market, User, Bet } from './types'

const API_URL = 'https://api.manifold.markets/v0'

type Sort = 'created-time' | 'updated-time' | 'last-bet-time' | 'last-comment-time'
type GetMarketsParams = Partial<{ limit: number, sort: Sort, before: string, order: string, userId: string }>
type GetBetsParams = Partial<{ limit: number, before: string, after: string, order: string, userId: string, username: string, contractId: string, contractSlug: string }>

const DEFAULT_PARAMS: GetMarketsParams = {
  limit: 100
}

const DEFAULT_BETS_PARAMS: GetBetsParams = {
  limit: 100
}

const paramsToString = (params: GetMarketsParams | GetBetsParams) => {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    )
  ).toString()
}

export async function fetchMarkets(params: GetMarketsParams) {
  const queryParams = paramsToString({ ...DEFAULT_PARAMS, ...params })
  const response = await fetch(`${API_URL}/markets?${queryParams}`)
  return response.json() as Promise<Market[]>
}

export async function fetchUser(username: string) {
  const response = await fetch(`${API_URL}/user/${username}`)
  return response.json() as Promise<User>
}

export async function fetchBets(params: GetBetsParams) {
  const queryParams = paramsToString({ ...DEFAULT_BETS_PARAMS, ...params })
  const response = await fetch(`${API_URL}/bets?${queryParams}`)
  return response.json() as Promise<Bet[]>
}
