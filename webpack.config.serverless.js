module.exports = {
    entry: './src/serverless/index.js',
    target: 'node',
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/,
        }],
    },
};
