module.exports = {
    serverlessEnv: process.env.SERVERLESS_ENV,
    octopush: {
        user_login: process.env.OCTOPUSH_USER_LOGIN,
        api_key: process.env.OCTOPUSH_API_KEY,
        simutation: process.env.OCTOPUSH_SIMULATION,
        disabled: true,
    },
    aws: {
        credentials: {
            endpoint: 'http://dynamodbtest:8000',
            accessKeyId: 'akid',
            secretAccessKey: 'secret',
            region: 'us-east-1',
        },
    },
};
