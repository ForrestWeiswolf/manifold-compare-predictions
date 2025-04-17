import { render } from 'preact';
import { useState } from 'preact/hooks';
import './style.css';
import { fetchMarket, fetchBets } from './api';
import { Bet, Market } from './types';

export function App() {
	const [usernames, setUsernames] = useState(['', ''] as [string, string])
	const [commonMarkets, setCommonMarkets] = useState<Market[]>([])

	const fetchCommonMarkets = async ([user1, user2]: [string, string]) => {
		const bets = await Promise.all([fetchBets({ username: usernames[0] }), fetchBets({ username: usernames[1] })])
		const commonMarketIds = new Set<string>()
		bets[0].forEach((bet) => {
			if (bets[1].some((b) => b.contractId === bet.contractId)) { commonMarketIds.add(bet.contractId) }
		})

		const commonMarkets = await Promise.all(
			Array.from(commonMarketIds).map((id) =>
				fetchMarket(id)
			)
		)

		setCommonMarkets(commonMarkets.filter(m => !m.isResolved).sort((a, b) => a.closeTime - b.closeTime))
		console.log(commonMarketIds, commonMarkets)
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
						<a href={market.url}>{market.question}{market.probability ? `: (${Math.round(market.probability * 100)}%)` : ''}</a>
					</div>
				))}
			</div>
		</div>
	);
}

render(<App />, document.getElementById('app'));
