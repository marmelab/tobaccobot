module.exports = {
    serverlessEnv: process.env.SERVERLESS_ENV,
    aws: {
        credentials: {
            endpoint: 'http://dynamodb:8000',
            accessKeyId: 'akid',
            secretAccessKey: 'secret',
            region: 'us-east-1',
        },
    },
};
