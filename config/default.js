module.exports = {
    serverlessEnv: process.env.SERVERLESS_ENV,
    aws: {
        credentials: {
            endpoint: 'http://dynamodb:8000',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'us-east-1',
        },
    },
};
