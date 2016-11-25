module.exports = {
    serverlessEnv: process.env.SERVERLESS_ENV,
    octopush: {
        user_login: process.env.OCTOPUSH_USER_LOGIN,
        api_key: process.env.OCTOPUSH_API_KEY,
        simutation: process.env.OCTOPUSH_SIMULATION,
    },
    aws: {
        credentials: {
            endpoint: 'http://dynamodb:8000',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'eu-west-1',
        },
    },
};
