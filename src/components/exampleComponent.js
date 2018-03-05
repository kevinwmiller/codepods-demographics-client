import React, { Component } from 'react'
import axios from 'axios'

class ExampleComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			defaultMessage: 'Hello'
		}
	}

	// These functions are called when the component is 'mounted', i.e. inserted into the DOM
	componentWillMount() {

	}

	componentDidMount() {
		this.testExpressCall()
	}



	// These functions are called when a property or state change occurs. These functions trigger a re-render
	componentWillReceiveProps() {

	}

	shouldComponentUpdate() {
		return true
	}

	componentWillUpdate() {
		
	}

	componentDidUpdate() {

	}


	// This is called when the component is being removed from the DOM
	componentWillUnmount() {

	}

	// This function is called whe an error occurs during rendering, a lifecycle method (One of the above functions), or in a child component constructor
	componentDidCatch() {

	}

	// Axios returns a promise object. 
	// A promise object represents the eventual completion or failure of an async operation
	getApiData() {
		console.log("Getting exampleController")
		return axios.get('/exampleController')
	}

	// To use a promise object, use the async/await paradigm
	// Mark a function as async as below, and then use the await keyword to wait for a promise to be fulfilled
	// Errors can be caught by wrapping our code in a try/catch block
	testExpressCall = async() => {
		try {
			const response = await this.getApiData()
			this.setState({ response: response.data.response })
		} catch (err) {
			console.error(err)
			this.setState({ response: err.message })
		}
	}

	render() {
		// Don't use dangerouslySetInnerHTML
		return (
			<div>
				<p className="ExampleComponentProperty">
					ReactComponent says {this.props.message}
				</p>
				<p>
					The below is a call to the backend server. This particular route fetched the google.com homepage
				</p>
				<div className="ExampleComponentState">
					BackendServer says <div className="content" dangerouslySetInnerHTML={{__html: this.state.response}}></div>
				</div>
			</div>
		);
	}
}

export default ExampleComponent