import { Bet, Market } from '../types';
import { formatBet, formatProb, formatTime } from '../utils';

const MarketRow: preact.FunctionalComponent<{market: Market, usernames: string[], lastBets: [Bet, Bet]}> = ({market, usernames, lastBets}) => (
  <div key={market.id} className="market">
    <b><a href={market.url}>{market.question}{market.probability ? `: ${formatProb(market.probability)}` : ''}</a></b>
    <div>
      <span>{usernames[0]} last bet <b>{formatBet(lastBets[0])}</b> on {formatTime(lastBets[0].createdTime)}</span>
      <br />
      <span>{usernames[1]} last bet <b>{formatBet(lastBets[1])}</b> on {formatTime(lastBets[1].createdTime)}</span>
    </div>
  </div>
);

export default MarketRow;
