/**
    @file Main page and entry point of the React app.
    This file should only import components that are used directly by the App component
    To add a component to the page:
    <ComponentName property1Name={{property1Value}} property2Name={{property2Value}}/>

*/
import React, { Component } from 'react';
//import { Container } from 'semantic-ui-react';
import { Container, Segment } from 'semantic-ui-react';

import './App.css';
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
            <Container style={{width: '90%'}}>
                <CodepodsDemographicComponent />
            </Container>
        );
    }
}

export default App;
