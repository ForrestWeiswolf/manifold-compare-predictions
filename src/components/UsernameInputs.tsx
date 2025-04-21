import { useState, useEffect, useCallback } from "preact/hooks";


type UsernameInputProps = {
  enterUsernames: (usernames: [string, string]) => void,
  loadingStatus: string,
  brierScores: number[],
}

const UsernameInputs = ({ loadingStatus, brierScores, enterUsernames }: UsernameInputProps) => {
  const [usernames, setUsernames] = useState<[string, string]>(['', '']);

  const enter = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (usernames[0]) { params.set('username0', usernames[0]); }
    if (usernames[1]) { params.set('username1', usernames[1]); }
    if (params.size > 0) {
      window.history.replaceState({}, '', `?${params.toString()}`);
    }

    enterUsernames(usernames);
  }, [enterUsernames, usernames]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username0 = params.get('username0');
    const username1 = params.get('username1');
    if (username0 && username1) {
      setUsernames([username0, username1]);
    }
  }, [enterUsernames]);

  return <section className="username-input-container">
    <div>
      <input type="text" name="username1" value={usernames[0]}
        onChange={(e) => setUsernames([(e.target as HTMLInputElement).value, usernames[1]])}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { enter(); }
        }}
      />
      {loadingStatus === 'ready' && <span className="brier-score">Brier score: {Math.round(brierScores[0] * 100) / 100}</span>}
    </div>

    <div>
      <input type="text" name="username2" value={usernames[1]}
        onChange={(e) => setUsernames([usernames[0], (e.target as HTMLInputElement).value])}
        onKeyUp={(e) => {
          if (e.key === 'Enter') { enter(); }
        }}
      />
      {loadingStatus === 'ready' && <span className="brier-score">Brier score: {Math.round(brierScores[1] * 100) / 100}</span>}
    </div>

    <button onClick={() => enter()}>Compare predictions</button>
  </section>;
};

export default UsernameInputs;