var p = process.env.NODE_ENV;
console.log('********* NODE_ENV = ' + p + ' *******');

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
		index: './src/index.js',
	},
	module: {
		rules: [
			{ test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader?retainLines=true' },
			{ test: /\.less$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] },
			{ test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
			{ test: /\.(png|jpg|gif|svg)$/, use: [{ loader: 'file-loader', options: { name: '_img/[path][name].[ext]', context: 'src' } }] },
			{ test: /\.(ogv|mp4)$/, use: [{ loader: 'file-loader', options: { name: '_vid/[path][name].[ext]', context: 'src' } }] },
			{ test: /\.(wav|mp3)$/, use: [{ loader: 'file-loader', options: { name: '_aud/[path][name].[ext]', context: 'src' } }] },
			{ test: /\.(eot|woff|woff2|ttf)$/, use: [{ loader: 'file-loader', options: { name: '_font/[path][name].[ext]', context: 'src' } }] },
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		alias: {
			LESCA: path.resolve(__dirname, 'src/LESCA/'),
			UI: path.resolve(__dirname, 'src/LESCA/UI/'),
			DEVICE: path.resolve(__dirname, 'src/LESCA/Device/'),
			EVENT: path.resolve(__dirname, 'src/LESCA/Event/'),
			UNIT: path.resolve(__dirname, 'src/LESCA/Unit/'),
		},
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: '_js/[name].min.js',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			__REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
		}),
	],
	optimization: {
		minimize: p == 'production',
		minimizer: [
			new TerserPlugin({
				sourceMap: false,
				cache: true,
				parallel: true,
				extractComments: false,
				terserOptions: { output: { comments: false } },
			}),
		],
	},
	devtool: 'cheap-inline-module-source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
		host: '0.0.0.0',
		port: 8080,
		public: 'localhost:8080',
		disableHostCheck: true,
		https: false,
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
};
