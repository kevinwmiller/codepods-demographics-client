const config = {
    development: {
        server: {
            url: 'http://localhost:5000',
        },
    },
    production: {
        server: {
            url: process.env.SERVER_URL,
        },
    },
};

module.exports = config[process.env.NODE_ENV] || config.development;
