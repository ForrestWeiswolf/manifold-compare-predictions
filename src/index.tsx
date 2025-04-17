import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './style.css';
import { fetchMarkets, fetchUser } from './api';

export function App() {
	const [usernames, setUsernames] = useState(['', ''])
	useEffect(() => {
		fetchMarkets({}).then((markets) => {
			console.log(markets)
		})
	}, [])
	return (
		<div>
			<input type="text" name="username1" value={usernames[0]}
				onChange={(e) => setUsernames([(e.target as HTMLInputElement).value, usernames[1]])}
			/>
			<input type="text" name="username2" value={usernames[1]}
				onChange={(e) => setUsernames([usernames[0], (e.target as HTMLInputElement).value])}
			/>
			<button onClick={async () => {
				const username1 = usernames[0]
				const username2 = usernames[1]
				console.log(username1, username2)
				const users = await Promise.all([fetchUser(username1), fetchUser(username2)])
				console.log(users)
			}}>Fetch</button>
		</div>
	);
}

render(<App />, document.getElementById('app'));
