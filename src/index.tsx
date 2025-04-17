import { render } from 'preact';
import { useState } from 'preact/hooks';
import './style.css';
import { fetchMarket, fetchBets } from './api';
import { Bet, Market } from './types';

const getLastBetProb = (bets: Bet[], market: Market, userId: string) => {
	const bet = bets.sort((a, b) => b.createdTime - a.createdTime).find((b) => b.contractId === market.id && b.userId === userId);
	if (!bet) { return null; }

	return bet.probAfter;
};

const formatProb = (prob: number) => `${Math.round(prob * 100)}%`;

export function App() {
	const [usernames, setUsernames] = useState(['', ''] as [string, string]);
	const [commonMarkets, setCommonMarkets] = useState<Array<Market & { userProbs: number[] }>>([]);

	const fetchCommonMarkets = async () => {
		const bets = await Promise.all([fetchBets({ username: usernames[0] }), fetchBets({ username: usernames[1] })]);
		const userIds = [bets[0][0].userId, bets[1][0].userId];
		const commonMarketIds = new Set<string>();
		bets[0].forEach((bet) => {
			if (bets[1].some((b) => b.contractId === bet.contractId)) { commonMarketIds.add(bet.contractId); }
		});

		const commonBets = [
			...bets[0].sort((a, b) => a.createdTime - b.createdTime).filter((bet) => commonMarketIds.has(bet.contractId)),
			...bets[1].sort((a, b) => a.createdTime - b.createdTime).filter((bet) => commonMarketIds.has(bet.contractId))
		];

		const commonMarkets = Promise.all(
			Array.from(commonMarketIds).map((id) =>
				fetchMarket(id)
			)
		);

		setCommonMarkets(
			(await commonMarkets)
				.filter(m => !m.isResolved && m.outcomeType === 'BINARY')
				.map(m => ({ ...m, userProbs: userIds.map(id => getLastBetProb(commonBets, m, id)) }))
				.sort((a, b) => (a.userProbs[0] - a.userProbs[1]) - (b.userProbs[0] - b.userProbs[1]))
		);
	};

	return (
		<div>
			<input type="text" name="username1" value={usernames[0]}
				onChange={(e) => setUsernames([(e.target as HTMLInputElement).value, usernames[1]])}
				onKeyDown={(e) => {
					if (e.key === 'Enter') { fetchCommonMarkets(); }
				}}
			/>
			<input type="text" name="username2" value={usernames[1]}
				onChange={(e) => setUsernames([usernames[0], (e.target as HTMLInputElement).value])}
				onKeyUp={(e) => {
					if (e.key === 'Enter') { fetchCommonMarkets(); }
				}}
			/>
			<button onClick={() => fetchCommonMarkets()}>Fetch</button>
			<div>
				{commonMarkets.map((market) => (
					<div key={market.id}>
						<a href={market.url}>{market.question}{market.probability ? `: ${formatProb(market.probability)}` : ''}</a>
						<div>
							<span>{usernames[0]}: {market.userProbs[0] ? formatProb(market.userProbs[0]) : 'N/A'}</span>
							<br />
							<span>{usernames[1]}: {market.userProbs[1] ? formatProb(market.userProbs[1]) : 'N/A'}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

render(<App />, document.getElementById('app'));
