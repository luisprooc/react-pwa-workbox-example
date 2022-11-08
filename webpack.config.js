const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
const Dotenv = require( 'dotenv-webpack' );
const { GenerateSW } = require( 'workbox-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );

const webpackPlugins = [
  new HtmlWebpackPlugin( {
    template: path.resolve( __dirname, 'public/index.html' ),
    filename: 'index.html',
  } ),
  new Dotenv( {
    path: './.env', // Path to .env file (this is the default)
    systemvars: true,
  } ),
  new CopyPlugin( {
    patterns: [
      { from: './src/favicon.ico', to: '' },
      { from: './src/manifest.json', to: '' },
      { from: './src/logo192.png', to: '' },
      { from: './src/logo512.png', to: '' },
    ],
  } ),
];

if ( 'production' === process.env.NODE_ENV ) {
  webpackPlugins.push( new GenerateSW( {
    swDest: 'sw.js',
    mode: 'production',
    sourcemap: false,
    clientsClaim: true,
    inlineWorkboxRuntime: true,
    importScriptsViaChunks: ['https://s-eu-1.pushpushgo.com/636a7a47db3f60180af7eba2/worker.js'],
    skipWaiting: true,
    runtimeCaching: [
      {
        handler: 'StaleWhileRevalidate',
        urlPattern: /^https:\/\/glimmer.*\/player\.js$/,
        options: {
          cacheName: 'glimmer-entry',
          fetchOptions: { mode: 'cors', credentials: 'omit' },
        },
      },
      {
        handler: 'CacheFirst',
        urlPattern: /^https:\/\/glimmer.*\/static\/.*\.js$/,
        options: {
          cacheName: 'glimmer-static',
          fetchOptions: { mode: 'cors', credentials: 'omit' },
          expiration: {
            maxEntries: 16, // at the moment of publication we have 4 static files for Glimmer
          },
        },
      },
    ]
  }));
}

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: 'main.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css?$/,
        use: [ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: 'file-loader?name=./images/[name].[ext]',
      },
    ],
  },
  plugins: webpackPlugins,
};

