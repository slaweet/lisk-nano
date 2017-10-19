/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const reactToolboxVariables = require('./reactToolbox.config');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, {
  context: process.cwd(),
  entry: {
    vendor:[
     'react', 
     'react-dom', 
     'react-router', 
     'redux', 
     'react-redux',
     'react-toolbox',
     'lisk-js',
     'moment',
     'bignumber.js',
     'bitcore-mnemonic',
    ],
  }, 
 
 output: { 
    filename: '[name].dll.js', 
    path: path.join(__dirname, 'dll'), 
    library: '[name]', 
  }, 
  
  plugins: [ 
    new webpack.DllPlugin({ 
      name: '[name]', 
      path: path.join(__dirname, 'dll', '[name].json') 
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
                sourceComments: false,
                plugins: [
                  // eslint-disable-next-line import/no-extraneous-dependencies
                  require('postcss-partial-import')({}),
                  require('postcss-cssnext')({
                    features: {
                      customProperties: {
                        variables: reactToolboxVariables,
                      },
                    },
                  }),
                  // eslint-disable-next-line import/no-extraneous-dependencies
                  require('postcss-for')({}),
                ],
              },
            },
          ],
        })),
      },
    ],
  },
});
