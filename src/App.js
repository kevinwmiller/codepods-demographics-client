/**
    @file Main page and entry point of the React app.
    This file should only import components that are used directly by the App component
    To add a component to the page:
    <ComponentName property1Name={{property1Value}} property2Name={{property2Value}}/>

*/
import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import './App.css';
import logo from './logo-main.png';

import CodepodsDemographicComponent from './components/codepodsDemographicsComponent';


/**
 * Entry point and main page of our react app
 */
class App extends Component {
    /**
    * render
    * @return {ReactElement} markup
    */
    render() {
        return (
            <Container>
                <Segment>
                    <h2 className="ui header">
                        <img className="ui image" src={logo} alt="logo" />
                        <div className="content">
                            Codepods Demographics
                        </div>
                    </h2>
                </Segment>
                <CodepodsDemographicComponent />
            </Container>
        );
    }
}

export default App;
