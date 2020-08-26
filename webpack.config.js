'use strict';

class assetManager {
	constructor() {
		this.defaults = {
			yubinKensaku: ['@babel/polyfill', './src/js/yubinKensaku.js']
		}
		this.assets = [
			"demo"
		];
	}

	getEntries() {
		var entries = this.defaults;
		[].forEach.call(this.assets, function(asset) {
			if (Array.isArray(asset)) {
				entries[asset[0]] = ['./src/js/'+asset[0]+'.'+asset[1]];
			} else {
				entries[asset] = ['./src/js/'+asset+'.js', './src/scss/'+asset+'.scss'];
			}
		});
		return entries;
	}
};

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const AssetsPlugin = require('assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath);
}

// const assetManager = require(resolveApp('src/assets.js'));
const assetList = new assetManager();
const paths = {
	appSrc: resolveApp('src'),
	appBuild: resolveApp('build'),
	appRoot: resolveApp('./'),
	appNodeModules: resolveApp('node_modules'),
};

const DEV = process.env.NODE_ENV === 'development';

module.exports = {
	bail: !DEV,
	mode: DEV ? 'development' : 'production',
	// We generate sourcemaps in production. This is slow but gives good results.
	// You can exclude the *.map files from the build during deployment.
	target: 'web',
	devtool: DEV ? 'cheap-eval-source-map' : 'source-map',
	entry: assetList.getEntries(),
	output: {
		path: paths.appBuild,
		filename: 'js/[name].js'
	},

	module: {
		rules: [
			// Disable require.ensure as it's not a standard language feature.
			{ parser: { requireEnsure: false } },
			// Transform ES6 with Babel
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				include: paths.appSrc,
			},
			{
				test: /.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
							plugins: () => [autoprefixer()]
						}
					},
					"sass-loader"
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'img',
						publicPath: (url, resourcePath, context) => {
							return `../img/${url}`;
						}
					},
				}],
			},
			{
				test: /\.(woff|woff2|otf|eot|ttf)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts',
						publicPath: (url, resourcePath, context) => {
							return `../fonts/${url}`;
						}
					},
				}],
			}
		],
	},
	optimization: {
		minimize: !DEV,
		minimizer: [
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
						annotation: true,
					}
				}
			}),
			new TerserPlugin({
				terserOptions: {
					compress: {
						warnings: false
					},
					output: {
						comments: false
					}
				},
				sourceMap: true
			})
		]
	},
	plugins: [
		!DEV && new CleanWebpackPlugin([paths.appBuild]),
		new CopyWebpackPlugin([
			{ from:'demo', to: './' },
			{ from:'data/export', to: 'data' }
		]),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css'
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
			DEBUG: false,
		}),
		DEV &&
		new FriendlyErrorsPlugin({
			clearConsole: false,
		}),
		DEV &&
		new BrowserSyncPlugin({
			notify: false,
			port: 80,
            open: 'external',
			host: 'yubinkensaku.local',
			proxy: 'http://yubinkensaku.local:80/',
			logLevel: 'silent',
			files: ['./*.php', paths.appRoot+'/templates/*.twig', paths.appRoot+'/*'],
		}),
	].filter(Boolean),
};
