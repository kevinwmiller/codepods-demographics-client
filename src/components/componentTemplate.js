import React, { Component } from 'react'

/** Empty React component object to use as a template when creating new components*/
class ComponentTemplate extends Component {

	/**
	* @constructor
	* @param {object} props - {
	
		}
	*/
	constructor(props) {
		super(props)

		this.state = {
		}
	}

	/** These functions are called when the component is 'mounted', i.e. inserted into the DOM */
	componentWillMount() {

	}

	componentDidMount() {
	}



	/** These functions are called when a property or state change occurs. These functions trigger a re-render */
	componentWillReceiveProps() {

	}

	shouldComponentUpdate() {
		return true
	}

	componentWillUpdate() {
		
	}

	componentDidUpdate() {

	}


	/** This is called when the component is being removed from the DOM */
	componentWillUnmount() {

	}

	/** This function is called whe an error occurs during rendering, a lifecycle method (One of the above functions), or in a child component constructor */
	componentDidCatch() {

	}

	render() {
		return (
			<div>
			</div>
		);
	}
}

export default ComponentTemplate