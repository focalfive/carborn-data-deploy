const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
    entry: [path.join(__dirname, '/src/app/app.js')],
    resolve: {
        //When require, do not have to add these extensions to file's name
        extensions: ["", ".js"],
        //node_modules: ["web_modules", "node_modules"]  (Default Settings)
    },
    //Render source-map file for final build
    devtool: 'source-map',
    //output config
    output: {
        //Path of output file
        path: buildPath,
        //Name of output file
        filename: 'app.js',
    },
    plugins: [
        //Minify the bundle
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false,
            },
        }),
        //Allows error warnings but does not stop compiling. Will remove when eslint is added
        new webpack.NoErrorsPlugin(),
        //Transfer Files
        new TransferWebpackPlugin([
            {from: 'www'},
        ], path.resolve(__dirname,"src")),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
    ],
    module: {
        loaders: [
            {
                // All .js files
                test: /\.js$/,
                //react-hot is like browser sync and babel loads jsx and es6-7
                loaders: ['babel-loader'],
                exclude: [nodeModulesPath],
            },
        ],
    },
    //Eslint config
    eslint: {
        //Rules for eslint
        configFile: '.eslintrc',
    },
};

module.exports = config;
