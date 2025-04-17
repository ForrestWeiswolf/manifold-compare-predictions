export type Market = {
  id: string
  creatorId: string
  creatorUsername: string
  creatorName: string
  createdTime: number
  creatorAvatarUrl: string
  closeTime: number
  question: string
  slug: string
  url: string
  pool: {
    NO: number
    YES: number
  }
  probability: number
  p: number
  totalLiquidity: number
  outcomeType: string
  mechanism: string
  volume: number
  volume24Hours: number
  isResolved: boolean
  uniqueBettorCount: number
  lastUpdatedTime: number
  lastBetTime: number
}

export type User = {
  id: string
  createdTime: number

  name: string
  username: string
  url: string
  avatarUrl?: string

  bio?: string
  bannerUrl?: string
  website?: string
  twitterHandle?: string
  discordHandle?: string

  isBot?: boolean
  isAdmin?: boolean
  isTrustworthy?: boolean
  isBannedFromPosting?: boolean
  userDeleted?: boolean

  balance: number
  totalDeposits: number
  lastBetTime?: number
  currentBettingStreak?: number
}

export type Bet = {
  id: string
  userId: string
  contractId: string
  createdTime: number

  amount: number
  orderAmount: number
  shares: number

  outcome: string
  probBefore: number
  probAfter: number

  isFilled: boolean
  isCancelled: boolean

  limitProb?: number
  loanAmount: number

  fees: {
    platformFee: number
    liquidityFee: number
    creatorFee: number
  }

  fills: Array<{
    amount: number
    shares: number
    timestamp: number
    matchedBetId: string | null
  }>
}