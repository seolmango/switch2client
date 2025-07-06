const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "swITch",
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'static'}
            ]
        }),
        new webpack.DefinePlugin({
            '__FLAG__': JSON.stringify('dev'),
            '__BUILD_VERSION__': JSON.stringify(new Date().toISOString()),
            '__BUILD_ENV__': JSON.stringify(process.platform + '-' + process.arch + '-' + process.version),
            '__SOCKET_SERVER__': JSON.stringify('localhost:3000'),
        }),
        new InjectManifest({
            swSrc: './src/sw.js',
            swDest: 'pwa/sw.js',
        }),
    ]
}