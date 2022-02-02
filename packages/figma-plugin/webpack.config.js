/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = (env, argv) => ({
  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/index.tsx',
    code: './src/code.ts',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react'],
              [
                '@babel/preset-env',
                {
                  targets: 'defaults',
                },
              ],
              ['@babel/preset-typescript'],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    fallback: { path: require.resolve('path-browserify') },
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
      inject: 'body',
      cache: 'false',
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
  ],
});
