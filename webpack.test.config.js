const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const path = require('path');

let moduleConfig = require('./webpack.config').module;

if (shouldInstrument()) {
  moduleConfig.rules.push({
    test: /\.js$/,
    use: {
      loader: 'istanbul-instrumenter-loader',
      options: { esModules: true }
    },
    enforce: 'post',
    exclude: /node_modules|test/,
  });
}

module.exports = {
  entry: glob.sync('./test/**/*.test.js'),
  mode: 'development',
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'test.js'
  },
  module: moduleConfig,
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      path.join(__dirname, 'test'),
      'node_modules'
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'recurly.css' })
  ],
  devtool: 'inline-source-map',
};

// Only instrument in CI if we're set to report coverage
function shouldInstrument () {
  if (process.env.TRAVIS_JOB_ID) {
    return !!process.env.REPORT_COVERAGE;
  }
  return true;
}
