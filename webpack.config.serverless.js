const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/serverless/index.js',
    target: 'node',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/sg'),
                ],
            },
            { test: /\.json$/, loader: 'json-loader' },
        ],
    },
    externals: ['aws-sdk'],
};
