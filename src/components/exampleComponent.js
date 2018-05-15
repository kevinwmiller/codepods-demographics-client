import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Segment } from 'semantic-ui-react';
import server from '../services/server';

/**
    Makes a call to the exampleController route on the express server to
    represent the method in which to fetch data from an API or database from the frontend.
    @returns {Promise} Promise object represents the data returned from the express server
*/
function getApiData() {
    return server.get('/example', {
        params: {
            lastName: 'Bailey',
        },
    });
}

/**
    This is a stateless component that will determine how to render the Server Data
    If we are still loading, display a loading icon
    If there was an error fetching the data, then display an error message
    Otherwise, display the data
*/
function ExampleServerData(props) {
    if (props.loading) {
        return (
            <Loader active indeterminate inline>Fetching Data</Loader>
        );
    } else if (props.error) {
        return (
            <div className="ui negative message">
                <div className="header">
                    Could not fetch server data
                </div>
            </div>
        );
    }

    return (
        <div className="ui relaxed divided list">
            {props.response.map(personName => (
                <div className="content" key={personName._firstNameId}>
                    <div className="header">Hello {personName.firstName} {personName.lastName}!</div>
                </div>
            ))}
        </div>
    );
}

ExampleServerData.defaultProps = {
    loading: false,
    error: false,
    response: [],
};

ExampleServerData.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
    response: PropTypes.arrayOf(PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
    })),
};

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
            loading: true,
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
            this.setState({
                loading: true,
            });
            const response = await getApiData();
            this.setState({
                response: response.data.response,
                loading: false,
            });
        } catch (err) {
            console.error(err);
            this.setState({
                error: err.message,
                loading: false,
            });
        }
    }

    /**
        Renders the 'message' property, and will also add a person's name returned
            by the express server (Stored in this.state.response  @see {@link getApiData})
    */
    render() {
        return (
            <div>
                <p className="ExampleComponentProperty">
                    ReactComponent says {this.props.message}
                </p>
                <p>
                    The below is a call to the backend server
                </p>
                <div className="ExampleComponentState">
                    <Segment>
                        <ExampleServerData loading={this.state.loading} error={this.state.error} response={this.state.response} />
                    </Segment>
                </div>
            </div>
        );
    }
}

ExampleComponent.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ExampleComponent;
