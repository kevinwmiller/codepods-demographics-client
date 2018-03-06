/**
	@file Main page and entry point of the React app. This file should only import components that are used directly by the App component
	To add a component to the page:
	<ComponentName property1Name={{property1Value}} property2Name={{property2Value}}/>

*/
import React, { Component } from 'react'
import logo from './teamLogo.jpg'
import './App.css'

// Import any components used in the frontend. Only require those which are needed in the current component
import ExampleComponent from './components/exampleComponent'

/**
	Entry point and main page of our react app
*/
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
