const webpack = require('webpack');
const ConfigPlugin = require('webpack-config-plugin');
const path = require('path');

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
        new ConfigPlugin({ dir: path.join(__dirname, 'config') }),
    ],
};
