const config = {
    development: {
        server: {
            url: 'http://localhost:5000',
        },
        googleMapsApiKey: '',
    },
    production: {
        server: {
            url: process.env.REACT_APP_SERVER_URL,
        },
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    },
};

module.exports = config[process.env.NODE_ENV] || config.development;
