require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ConfigPlugin = require('webpack-config-plugin');

const loaders = [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    cacheDirectory: true,
}, {
    test: /manifest\.json$/,
    loader: 'file?name=manifest.json!web-app-manifest-loader',
}, {
    test: /\.jpe?g$|\.gif$|\.png$/,
    loader: 'url?name=/frontend/[hash].[ext]',
}, {
    test: /\.(otf|svg)(\?.+)?$/,
    loader: 'url?limit=100',
}, {
    test: /\.eot(\?\S*)?$/,
    loader: 'url?limit=100&mimetype=application/vnd.ms-fontobject',
}, {
    test: /\.woff2(\?\S*)?$/,
    loader: 'url?limit=100&mimetype=application/font-woff2',
}, {
    test: /\.woff(\?\S*)?$/,
    loader: 'url?limit=100&mimetype=application/font-woff',
}, {
    test: /\.ttf(\?\S*)?$/,
    loader: 'url?limit=100&mimetype=application/font-ttf',
}, {
    test: /\.html$/,
    loader: 'html',
}];

const plugins = [
    new ExtractTextPlugin('[name].css', {
        allChunks: true,
    }),
    new HtmlWebpackPlugin({
        hash: true,
        filename: 'index.html',
        template: '!!html!' + path.resolve(__dirname, './src/frontend/subscribe/index.html'),
        chunks: ['subscribe'],
    }),
    new HtmlWebpackPlugin({
        hash: true,
        filename: 'report/index.html',
        template: '!!html!' + path.resolve(__dirname, './src/frontend/report/index.html'),
        chunks: ['report'],
    }),
    new ConfigPlugin({ dir: path.resolve(__dirname, 'config') }),
];

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        subscribe: [
            './src/frontend/subscribe/index.js',
        ],
        report: [
            './src/frontend/report/index.js',
        ],
    },
    module: {
        loaders: loaders,
    },
    output: {
        filename: '[name]/index.js',
        path: './build',
        publicPath: '/',
    },
    plugins,
};
