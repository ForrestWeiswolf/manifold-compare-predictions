const API_URL = 'https://api.manifold.markets/v0'

type Sort = 'created-time' | 'updated-time' | 'last-bet-time' | 'last-comment-time'
type GetMarketsParams = Partial<{ limit: number, sort: Sort, before: string, order: string, userId: string }>

const DEFAULT_PARAMS: GetMarketsParams = {
  limit: 100
}

export async function fetchMarkets(params: GetMarketsParams) {
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ ...DEFAULT_PARAMS, ...params }).map(([key, value]) => [key, value.toString()])
    )
  )
  const response = await fetch(`${API_URL}/markets?${queryParams.toString()}`)
  return response.json()
}