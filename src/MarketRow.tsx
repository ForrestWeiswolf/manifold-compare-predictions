import { Market } from './types';
import { formatProb } from './utils';

const MarketRow: preact.FunctionalComponent<{market: Market, usernames: string[], userProbs: number[]}> = ({market, usernames, userProbs}) => (
  <div key={market.id} className="market">
    <b><a href={market.url}>{market.question}{market.probability ? `: ${formatProb(market.probability)}` : ''}</a></b>
    <div>
      <span>{usernames[0]}: {userProbs[0] ? formatProb(userProbs[0]) : 'N/A'}</span>
      <br />
      <span>{usernames[1]}: {userProbs[1] ? formatProb(userProbs[1]) : 'N/A'}</span>
    </div>
  </div>
);

export default MarketRow;
