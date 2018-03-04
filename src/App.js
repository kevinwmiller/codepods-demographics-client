import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Axios calls should be in components instead of here. Just testing for now

let axios = require('axios')

class App extends Component {
	state = {
		response: ''
	}

	componentDidMount() {
		this.testExpressCall()
	}

	getApiData() {
		return axios.get('/api/test2')
	}

	testExpressCall = async() => {
		try {
			const response = await this.getApiData()
			this.setState({ response: response.data })
		} catch (err) {
			console.error(err)
			this.setState({ response: err.message })
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					{this.state.response}
				</p>
			</div>
		);
	}
}

export default App;
