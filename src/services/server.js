import axios from 'axios';
import { isPlainObject } from 'lodash';

const config = require('../config');
const shortid = require('shortid');

const axiosInstance = axios.create({
    baseURL: config.server.url,
});

function addIdsToObject(responseObject) {
    if (isPlainObject(responseObject)) {
        Object.keys(responseObject).forEach((key) => {
            /** Add a new field to the current object with the name '_{currentKey}Id' with a unique id for the value
                These keys are to be used when rendering arrays in react components to ensure all keys are unique
                and stable
            */
            responseObject[`_${key}Id`] = shortid.generate();
        });
    }
}

// Add a response interceptor to add keys that will be used in react components
axiosInstance.interceptors.response.use((response) => {
    // If the response is an array of objects
    if ('response' in response.data && Array.isArray(response.data.response)) {
        response.data.response.forEach((responseObject) => {
            addIdsToObject(responseObject);
            return response.data.response;
        });
    } else if ('response' in response.data) {
        // If the response isn't an array, attempt to add Ids to the single object
        addIdsToObject(response.data.response);
    }
    console.log(response.data.response);
    return response;
}, error => Promise.reject(error));

export default axiosInstance;
