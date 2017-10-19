var path = require("path");
var webpack = require("webpack");

module.exports = { 
  context: process.cwd(),
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  entry: {
    vendor:[
     'react', 
     'react-dom', 
     'react-router', 
     'redux', 
     'react-redux',
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
    })
  ]
};
