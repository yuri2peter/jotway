const path = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  target: 'node',
  externalsPresets: { node: true },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      octetstream:
        'node_modules/koa-body/node_modules/formidable/src/plugins/octetstream.js',
    },
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    // 解决hexoid打包时的错误
    new NormalModuleReplacementPlugin(
      /^hexoid$/,
      require.resolve('hexoid/dist/index.js')
    ),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  // 标记不需要被打包的库
  externals: ['utf-8-validate', 'bufferutil'],
};

module.exports = config;
