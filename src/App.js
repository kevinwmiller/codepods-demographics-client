import React, { Component } from 'react'
import logo from './teamLogo.jpg'
import './App.css'

// Import any components used in the frontend. Only require those which are needed in the current component
import ExampleComponent from './components/exampleComponent'

class App extends Component {
	state = {
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">CodePods Web Project</h1>
				</header>
				<ExampleComponent message="This is a property"/>
			</div>
		);
	}
}

export default App;
