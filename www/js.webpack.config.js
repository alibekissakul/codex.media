/**
 * JS Bundle config
 */
require('dotenv').load();

const path          = require('path');
const merge         = require('webpack-merge');
const baseConfig    = require('./base.webpack.config');

module.exports = merge(baseConfig, {

    entry: './public/app/js/main.js',
    output: {
        path: path.join(__dirname, 'public/build'),
        filename: 'bundle.js',
        library: 'codex'
    },

    resolve: {
      modules: [
        path.join(__dirname, 'public', 'app', 'js'),
        "node_modules"
      ],
      extensions: [".js", ".css"],
    },

    resolveLoader: {
        modules: ['node_modules', path.join('.', 'public', 'webpack-loaders')]
    },

    module: {
      rules: [
      {
        /**
         * Use for all JS files loaders below
         * - babel-loader
         * - eslint-loader
         */
        test: /\.js$/,
        // include: [
        //   path.join('.', 'public', 'app', 'js')
        // ],
        use : [
          {
            /**
             * CodeX Media Loader.
             * Loader replace project's js source that inherits application's file
             */
            loader: 'codex-media',
            options: {
              project: process.env.PROJECT
            }
          },
          /** Babel loader */
          {
            loader: 'babel-loader',
            options: {
              presets: [ 'env' ],
            }
          },
          /** ES lint For webpack build */
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ]
      }
    ]}
});