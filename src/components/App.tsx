import { useEffect, useState } from 'preact/hooks';
import { Analytics } from '@vercel/analytics/react';
import '../style.css';
import { fetchMarket, fetchBets } from '../api';
import { Bet, Market } from '../types';
import Footer from './Footer';
import MarketRow from './MarketRow';
import UsernameInputs from './UsernameInputs';

const getLastBetProb = (bets: Bet[], market: Market, userId: string) => {
	const bet = bets.sort((a, b) => b.createdTime - a.createdTime).find((b) => b.contractId === market.id && b.userId === userId);
	if (!bet) { return null; }

	return bet.probAfter;
};

const getPredictionBrierScore = (bet: Bet, market: Market) => Math.pow(bet.probAfter - market.probability, 2);

const getUserBrierScore = (bets: Bet[], markets: Market[], userId: string) => {
	const userBets = bets.filter((b) => b.userId === userId && markets.some((m) => m.id === b.contractId));
	return userBets.reduce(
		(acc, bet) => acc + getPredictionBrierScore(bet, markets.find((m) => m.id === bet.contractId)), 0
	) / userBets.length;
};

export function App() {
	const [usernames, setUsernames] = useState(['', ''] as [string, string]);
	const [commonBinaryMarkets, setCommonBinaryMarkets] = useState<Array<Market & { userProbs: number[] }>>([]);
	const [commonBets, setCommonBets] = useState<Bet[]>([]);
	const [userIds, setUserIds] = useState<string[]>([]);
	const [brierScores, setBrierScores] = useState<[number, number]>([null, null]);
	const [loadingStatus, setLoadingStatus] = useState<'none' | 'loading' | 'ready'>('none');

	useEffect(() => {
		if (commonBets.length !== 0 && commonBinaryMarkets.length !== 0) {
			setBrierScores([getUserBrierScore(commonBets, commonBinaryMarkets, userIds[0]),
			getUserBrierScore(commonBets, commonBinaryMarkets, userIds[1])]
			);
		}
	}, [commonBets, commonBinaryMarkets, userIds]);

	const fetchCommonMarkets = async () => {
		setLoadingStatus('loading');
		const bets = await Promise.all([fetchBets({ username: usernames[0] }), fetchBets({ username: usernames[1] })]);
		const commonMarketIds = new Set<string>();
		bets[0].forEach((bet) => {
			if (bets[1].some((b) => b.contractId === bet.contractId)) { commonMarketIds.add(bet.contractId); }
		});

		const commonMarkets = Promise.all(
			Array.from(commonMarketIds).map((id) =>
				fetchMarket(id)
			)
		);

		const betsOnCommonMarkets = [
			...bets[0].sort((a, b) => a.createdTime - b.createdTime).filter((bet) => commonMarketIds.has(bet.contractId)),
			...bets[1].sort((a, b) => a.createdTime - b.createdTime).filter((bet) => commonMarketIds.has(bet.contractId))
		];

		setCommonBets(betsOnCommonMarkets);
		setUserIds([bets[0][0].userId, bets[1][0].userId]);

		setCommonBinaryMarkets(
			(await commonMarkets)
				.filter(m => m.outcomeType === 'BINARY')
				.map(m => ({ ...m, userProbs: [bets[0][0].userId, bets[1][0].userId].map(id => getLastBetProb(betsOnCommonMarkets, m, id)) }))
		);

		setLoadingStatus('ready');
	};

	return (
		<>
			<Analytics />
			<UsernameInputs
				loadingStatus={loadingStatus}
				brierScores={brierScores}
				fetchCommonMarkets={fetchCommonMarkets}
			/>
			<section>
				{/* // TODO: show progress */}
				{loadingStatus === 'loading' && <div>Loading...</div>}
				{loadingStatus === 'ready' && <>
					<div>
						{commonBinaryMarkets.length === 0 && usernames[0] && usernames[1] && <div>No common markets found</div>}
						{commonBinaryMarkets.length !== 0 && commonBets.length !== 0 && <>
							<h2>Common Markets</h2>
							{
								commonBinaryMarkets
									.filter(m => !m.isResolved)
									.sort((a, b) => Math.abs(b.userProbs[0] - b.userProbs[1]) - Math.abs(a.userProbs[0] - a.userProbs[1]))
									.map((market) => (
										<MarketRow
											key={market.id}
											market={market}
											usernames={usernames}
											userProbs={market.userProbs}
										/>
									))
							}
						</>}

					</div>
				</>}
			</section>
			<Footer />
		</>
	);
}

export default App;