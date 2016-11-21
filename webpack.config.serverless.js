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
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/sg'),
                ],
                query: {
                    babelrc: false,
                    presets: ['es2015-node4', 'es2016', 'stage-2'],
                    plugins: [
                        'add-module-exports',
                        'transform-runtime',
                    ],
                },
            },
            { test: /\.json$/, loader: 'json-loader' },
        ],
    },
    plugins: [
        new ConfigPlugin({ dir: path.resolve(__dirname, 'config') }),
    ],
};
