const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    util: require.resolve('util'),
    process: require.resolve('process/browser.js'),
    vm: require.resolve('vm-browserify'),
  };
  
  // Add alias for process/browser with explicit extension
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser.js'),
  };
  
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
  ];
  
  return config;
};

