const Footer = () => (
  <footer>
    <details>
      <summary>About</summary>
      <p>This is a tool to compare the predictions of two users on Manifold Markets.</p>
      <p>It shows markets on which both users have made bets, and the probability of each user's last bet on that market, as well as the users' Brier scores for the markets which they have both bet on.</p>
      <p>Note: These are not the Brier scores for the users' entire prediction histories; only for the markets which they have both bet on. This is intentional, as comparing Brier scores over different prediction sets is not meaningful.</p>
      <br />
      <small>
        <p>View the source code on <a href="https://github.com/ForrestWeiswolf/manifold-compare-predictions">GitHub</a>.</p>
        <p>Created by Forrest Wolf (<a href='https://forrestweiswolf.github.io'>website</a>; <a href='https://github.com/ForrestWeiswolf'>GitHub</a>; <a href='https://manifold.markets/Forrest'>Manifold</a>).</p>
      </small>
    </details>
  </footer>
);

export default Footer;
