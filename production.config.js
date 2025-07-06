const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const path = require('path');
const webpack = require('webpack');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
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
        new WebpackObfuscator ({
            rotateUnicodeArray: true,
            debugProtection: true,
            disableConsoleOutput: true,
            numbersToExpressions: true,
            selfDefending: true,
        }, [path.resolve(__dirname, 'src', 'index.js')]),
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
            '__FLAG__': JSON.stringify('prod'),
            '__BUILD_VERSION__': JSON.stringify(new Date().toISOString()),
            '__BUILD_ENV__': JSON.stringify(process.platform + '-' + process.arch + '-' + process.version),
            '__SOCKET_SERVER__': JSON.stringify('localhost:3000'),
        }),
        new InjectManifest({
            swSrc: './src/sw.js',
            swDest: 'sw.js',
        }),
    ]
}