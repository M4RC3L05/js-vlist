const webpack = require('webpack')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'vlist.bundle.js',
        libraryTarget: 'umd',
        library: 'VList'
    },
    mode: isDev ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{ loader: 'babel-loader' }]
            }
        ]
    }
}
