import React, { Component } from 'react';
import PropTypes from 'prop-types';
import server from '../services/server';

/**
    Makes a call to the exampleController route on the express server to
    represent the method in which to fetch data from an API or database from the frontend.
    Function is static since we do not use any class member variables
    @returns {Promise} Promise object represents the data returned from the express server
*/
function getApiData() {
    return server.get('/example/read', {
        params: {
            firstName: "React",
            lastName: "js",
        },
    });
}

/**
  * An example component showing the basics of making a call to the
  * backend express server and using state and properties
  * @reactProps {string} message - The message to display from the frontend
  */
class ExampleComponent extends Component {
    /**
    * @constructor
    * @param {object} props
    */
    constructor(props) {
        super(props);

        this.state = {
            response: [
                {
                    firstName: 'test',
                    lastName: 'test',
                }
            ]
        };
    }

    /** These functions are called when the component is 'mounted', i.e. inserted into the DOM */
    componentWillMount() {

    }

    componentDidMount() {
        this.testExpressCall();
    }


    /** These functions are called when a property or state change occurs.
    These functions trigger a re-render */
    componentWillReceiveProps() {

    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUpdate() {

    }

    componentDidUpdate() {

    }


    /** This is called when the component is being removed from the DOM */
    componentWillUnmount() {

    }

    /** This function is called whe an error occurs during rendering, a lifecycle method (One of the above functions),
    or in a child component constructor */
    // componentDidCatch() {

    // }

    /**
        Shows a basic usage of async/await and promises
        Shows how to set the state of the React component
            this.setState( {key1: value1, key2: value2, ...} )
            Setting the state forces a re-render
        Body is wrapped in a try/catch block to catch exceptions thrown by an unfulfilled promise
    */
    async testExpressCall() {
        try {
            const response = await getApiData();
            this.setState({ response: response.data.response });
        } catch (err) {
            console.error(err);
            this.setState({ response: err.message });
        }
    }

    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */
    render() {
        console.log(this.state.response);
        return (
            <div>
                <p className="ExampleComponentProperty">
                    ReactComponent says {this.props.message}
                </p>
                <p>
                    The below is a call to the backend server
                </p>
                <div className="ExampleComponentState">
                {
                    this.state.response.map((personName, index) =>
                        <p key={index}>Hello {personName.firstName} {personName.lastName}!</p>
                    )
                }
                </div>
            </div>
        );
    }
}

ExampleComponent.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ExampleComponent;
