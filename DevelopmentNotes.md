# Development Notes
#### [Back to readme](README.md)
## Axios and Promises
- Backend and web querying are done using axios
- Axios can be imported in a client component using the import command
  -     import axios from 'axios'
- To import Axios into the express backend
  -     const axios = require('axios')

- Axios provides different methods to query a web page with different protocols
  - Get request
    -     axios.get('{{url}}')
  - Post request
    -     axios.post('{{url}}', {{objectToPost}})
- Axios http request functions return a "Promise" object
  - Promise objects represent the eventual success or failure of an asynchronous operation
  - In order to handle promise objects, the async/await paradigm can be used
    - An async function is declared by prefixing a function declaration with the prefix 'async'
    ```javascript
    arrowAsyncFunction = async () => {
            try {
              const response = await this.returnsPromiseObject()
                // Do something with response.data
            } catch (err) {
                // Do something with err or err.message
            }
        }
    ```
    ```javascript
    onArrowAsyncFunction = async function() {
            try {
              const response = await this.returnsPromiseObject()
                // Do something with response.data
            } catch (err) {
                // Do something with err or err.message
            }
        }
    ```
  - The two functions above are essentially the same. There are slight differences between arrow and non-arrow functions in javascript, but I'll defer that to [another arrow function tutorial](https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/)
          - The differences mainly lie in how 'this' is scoped. It shouldn't be much of an issue, but tend to prefer arrow functions when possible
        -  The async marker on the function declares the function as asynchronous. The asynchronous function will call another function that runs asynchronously that returns a promise object. The call to this other asynchronous function is prefixed with "await". This means the code following our call to the async function will not run until the async function has returned successfully. This keeps our code clean and makes our asynchronous code look synchronous.
        -  On success, the promise object returns a response containing a data property
          -     console.log(response.data)
        -  If the asynchronous function fails, the promise will throw an exception. This is why the async code is wrapped in a try/catch block. The exception providesan  err object containing a message property that describes what went wrong
          -  The error can be displayed in the console or returned from the function
              -     console.log(err.message)
## React
### [Official React Documentation](https://reactjs.org/docs/hello-world.html)
### [React Readme](ReactReadme.md)
### Resources
- [TypeChecking with Proptypes](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [Stateless Functional Components](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc)
  - Don't focus much on stateless components. Just an interesting read
### Folder Structure
#### components/
-  Contains React components. Components represent small parts of a web page such as a navigation menu or a box for comments. Components are re-rendered when the component state is changed
  #### exampleComponent.js
  - An example component object. Contains boilerplate code for the react lifecycle functions
  - Gives example on using component properties and state
  - Also gives an example on using axios to make a call to the backend express server
  - Gives example on using async/await to manage promises
  #### componentTemplate.js
    - Empty component that can be used as a base for creating new components
-  New components can be created by copying componentTemplate.js and modifying as needed
### App.js
-  Main page of our web server. This file is where the different components are organized in relation to each other on the web page
-  Gives an example on passing properties to a component
-  Import components by doing the following:
    ```javascript
    import {{ComponentName}} from './components/{{componentName}}
    ```
### Querying Express Backend
- Requests to the backend server should be made through the server module located in src/services/server
- This module will create an axios instance with the baseUrl configured to the baseUrl of the backend
- To import the server module:
    ```javascript
    import server from '../services/server';
    ```
#### URLs to the Express Server
- Server routes are defined through a CRUD interface (Create, Read, Update, Delete)
##### Server Response Object
- Query response is a json object with a top-level key of response
```json
{
    response: {
        responseKey1: responseValue1
    }
}
```
- See [server documentation](https://github.com/kmiller92/codepods-demographics-server/blob/production/ReadMe.md) for API notes
##### Examples
- All examples assume the user wants to query the /example api 
###### Create
- Protocol: Post
```javascript
server.post('/example/create', {
  key: value,
});
```
###### Read
- Protocol: Get
```javascript
server.get('/example/read', {
  params: {
        key: value,
    }
});
```
###### Update
- Protocol: Post
```javascript
server.post('/example/update', {
  key: value,
});
```
###### Delete
- Protocol: Post
```javascript
server.post('/example/delete', {
  key: value,
});
```

```javascript
function getApiData() {
    return server.get('/example/read', {
        params: {
            firstName: "React",
            lastName: "js",
        },
    });
}

class ExampleComponent...
    async testExpressCall() {
        try {
            const response = await getApiData();
            this.setState({ response: response.data.response });
        } catch (err) {
            console.error(err);
            this.setState({ response: err.message });
        }
    }
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
```
- The read operation returns an array of objects from the api. To render all of them, we can use the map function. The map function operates on an array, and for each element in the array, and function is called. In the render example above, each Person object is placed into  paragraph tags. 'personName' refers to the current Person object and index is the current index, i.e. 0, 1, 2, etc.
- We can also access a specific person object by array index, i.e. this.state.response[0] will return the first object
# General Notes
- To exit vagrant ssh. Run the following from your command prompt
  -   exit or ctrl+D
- To stop the virtual machine
  -   vagrant halt
- To destroy the virtual machine
  -   vagrant destroy
- When adding new node packages, be sure to save it to the package.json using the -s modifier
- If testing a new branch, run "git checkout {{BranchName}}" and then run "yarn update" in /vagrant
