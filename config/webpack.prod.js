var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    new copyWebpackPlugin([
      {
        from: 'public/css/',
        to: 'public/css/'
      },
      {
        from: 'lib/jsmediatags.js',
        to: 'lib/jsmediatags.js'
      },
      {
        from: 'lib/socket.io-1.4.5.js',
        to: 'lib/socket.io-1.4.5.js'
      },
      {
        from: 'public/fonts/',
        to: 'public/fonts/'
      }
    ]),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css')
  ]
});
