import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import ExampleComponent from './components/exampleComponent'

class App extends Component {
	state = {
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<ExampleComponent message="This is a property"/>
			</div>
		);
	}
}

export default App;
