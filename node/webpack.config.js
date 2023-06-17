const path = require('path')
module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
	path: path.resolve(__dirname, "public"),
	filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
	rules: [
	    {
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
		    loader: 'babel-loader',
		    options: {
			presets: ['@babel/preset-env', '@babel/react']
		    }
		}
	    }
	]
    }
}
