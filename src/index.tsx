import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import './style.css';
import { fetchMarkets } from './api';

export function App() {
	useEffect(() => {
		fetchMarkets({ }).then((markets) => {
			console.log(markets)
		})
	}, [])
	return (
		<div>
			<h1>Hello World</h1>
		</div>
	);
}

function Resource(props) {
	return (
		<a href={props.href} target="_blank" class="resource">
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
}

render(<App />, document.getElementById('app'));
