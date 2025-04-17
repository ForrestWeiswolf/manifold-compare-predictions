import { render } from 'preact';
import { useState } from 'preact/hooks';
import './style.css';
import { fetchMarket, fetchBets, fetchUser } from './api';
import { Bet, Market, User } from './types';

const getLastBetProb = (bets: Bet[], market: Market, userId: string) => {
	const bet = bets.sort((a, b) => b.createdTime - a.createdTime).find((b) => b.contractId === market.id && b.userId === userId)
	console.log({ bets, market, userId, bet })
	if (!bet) { return null }

	return bet.probAfter
}

const formatProb = (prob: number) => `${Math.round(prob * 100)}%`

export function App() {
	const [usernames, setUsernames] = useState(['', ''] as [string, string])
	const [userIds, setUserIds] = useState<[string?, string?]>([null, null])

	const [commonMarkets, setCommonMarkets] = useState<Market[]>([])
	const [commonBets, setCommonBets] = useState<Bet[]>([])

	const fetchCommonMarkets = async ([user1, user2]: [string, string]) => {
		const bets = await Promise.all([fetchBets({ username: usernames[0] }), fetchBets({ username: usernames[1] })])
		setUserIds([bets[0][0].userId, bets[1][0].userId])
		const commonMarketIds = new Set<string>()
		bets[0].forEach((bet) => {
			if (bets[1].some((b) => b.contractId === bet.contractId)) { commonMarketIds.add(bet.contractId) }
		})

		const commonBets = bets[0].sort((a, b) => a.createdTime - b.createdTime).filter((bet) => commonMarketIds.has(bet.contractId))

		const commonMarkets = Promise.all(
			Array.from(commonMarketIds).map((id) =>
				fetchMarket(id)
			)
		)

		setCommonBets(commonBets)
		setCommonMarkets((await commonMarkets).filter(
			m => !m.isResolved
		).sort((a, b) => a.closeTime - b.closeTime))
	}

	return (
		<div>
			<input type="text" name="username1" value={usernames[0]}
				onChange={(e) => setUsernames([(e.target as HTMLInputElement).value, usernames[1]])}
				onKeyDown={(e) => {
					if (e.key === 'Enter') { fetchCommonMarkets(usernames) }
				}}
			/>
			<input type="text" name="username2" value={usernames[1]}
				onChange={(e) => setUsernames([usernames[0], (e.target as HTMLInputElement).value])}
				onKeyDown={(e) => {
					if (e.key === 'Enter') { fetchCommonMarkets(usernames) }
				}}
			/>
			<button onClick={() => fetchCommonMarkets(usernames)}>Fetch</button>
			<div>
				{commonMarkets.map((market) => (
					<div key={market.id}>
						<a href={market.url}>{market.question}{market.probability ? `: ${formatProb(market.probability)}%` : ''}</a>
						<div>
							<span>{usernames[0]}: {getLastBetProb(commonBets, market, userIds[0]) ? formatProb(getLastBetProb(commonBets, market, userIds[0])) : 'N/A'}</span>
							<br />
							<span>{usernames[1]}: {getLastBetProb(commonBets, market, userIds[1]) ? formatProb(getLastBetProb(commonBets, market, userIds[1])) : 'N/A'}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

render(<App />, document.getElementById('app'));
