const path = require('path')
const glob = require('glob'); // glob をインポート
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    compress: true, // すべてのサーバーに対してgzip圧縮を有効にする
    port: 3000, // サーバーのポート番号
    open: true, // サーバー起動時にブラウザを自動で開く
    hot: true, // Hot Module Replacement (HMR) を有効にする
    liveReload: true, // ファイル変更時にページをリロードする
  },
  module: {
    rules: [
      {
        // 対象となるファイルの拡張子(scss)
        test: /\.scss$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // CSSファイルを書き出すオプションを有効にする
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込まない
              url: false,
              // ソースマップの利用有無
              sourceMap: true,
              // Sass+PostCSSの場合は2を指定
              importLoaders: 2,
            },
          },
          // PostCSSのための設定
          {
            loader: "postcss-loader",
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: true,
              postcssOptions: {
                // ベンダープレフィックスを自動付与する
                plugins: [
                  require('autoprefixer'),
                ],
              },
            },
          },
          // Sassをバンドルするための機能
          {
            loader: "sass-loader",
            options: {
              // ソースマップの利用有無
              sourceMap: true,
            },
          },
        ],
      },

      {
        test: /\.riot$/,
        exclude: /node_modules/,
        use: [{
          loader: '@riotjs/webpack-loader',
          options: {
            hot: true
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
  
          }
        ]
      },
      // CSSローダーの設定を追加
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
  })
  ],
  // source-map方式でないと、CSSの元ソースが追跡できないため
  devtool: "source-map",
  // ES5(IE11等)向けの指定
//  target: ["web", "es5"],

};
