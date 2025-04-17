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

	const fetchUsers = async () => {
		const users = await Promise.all([fetchUser(usernames[0]), fetchUser(usernames[1])])
		console.log(users)
	}

	return (
		<div>
			<input type="text" name="username1" value={usernames[0]}
				onChange={(e) => setUsernames([(e.target as HTMLInputElement).value, usernames[1]])}
				onKeyDown={(e) => {
					if (e.key === 'Enter') { fetchUsers() }
				}}
			/>
			<input type="text" name="username2" value={usernames[1]}
				onChange={(e) => setUsernames([usernames[0], (e.target as HTMLInputElement).value])}
				onKeyDown={(e) => {
					if (e.key === 'Enter') { fetchUsers() }
				}}
			/>
			<button onClick={fetchUsers}>Fetch</button>
		</div>
	);
}

render(<App />, document.getElementById('app'));
