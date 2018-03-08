import axios from 'axios';

const config = require('../config');

const axiosInstance = axios.create({
    baseURL: config.server.url,
});

export default axiosInstance;
