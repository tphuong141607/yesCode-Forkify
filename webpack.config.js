const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	// babel-polyfill: used to deal with stuffs that ES5 doesn't have but ES5 has. (ex: promises)
	entry: ['babel-polyfill', './src/js/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js'
	},
	devServer: {
		contentBase: './dist'
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'app.html',
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/, // check for all js file
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
			
		]
	}
};