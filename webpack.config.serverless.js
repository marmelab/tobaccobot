const webpack = require('webpack');
const config = require('config');

module.exports = {
    entry: './src/serverless/index.js',
    target: 'node',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
            },
            { test: /\.json$/, loader: 'json-loader' },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({ config: JSON.stringify(config) }),
    ],
};
