module.exports = {
    serverlessEnv: process.env.SERVERLESS_ENV,
    octopush: {
        user_login: process.env.OCTOPUSH_USER_LOGIN,
        api_key: process.env.OCTOPUSH_API_KEY,
        simutation: process.env.OCTOPUSH_SIMULATION,
        disabled: !!process.env.OCTOPUSH_DISABLED,
    },
    aws: {
        credentials: {
            endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'eu-west-1',
        },
    },
    batchSize: 10,
    subscribeUrl: process.env.SUBSCRIBE_URL,
    reportUrl: process.env.REPORT_URL,
    reportLink: process.env.REPORT_LINK,
    logs: process.env.LOG === 'ok',
};
