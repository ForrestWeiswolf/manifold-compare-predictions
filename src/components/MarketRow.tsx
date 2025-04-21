import { Bet, Market } from '../types';
import { formatBet, formatProb } from '../utils';

const MarketRow: preact.FunctionalComponent<{market: Market, usernames: string[], lastBets: [Bet, Bet]}> = ({market, usernames, lastBets}) => (
  <div key={market.id} className="market">
    <b><a href={market.url}>{market.question}{market.probability ? `: ${formatProb(market.probability)}` : ''}</a></b>
    <div>
      <span>{usernames[0]} last bet {lastBets[0] ? formatBet(lastBets[0]) : 'N/A'}</span>
      <br />
      <span>{usernames[1]} last bet {lastBets[1] ? formatBet(lastBets[1]) : 'N/A'}</span>
    </div>
  </div>
);

export default MarketRow;
