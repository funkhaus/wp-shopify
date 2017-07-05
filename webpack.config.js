var webpack = require('webpack')
var path = require('path')
var resolve = file => path.resolve(__dirname, file)

var config = {
    entry: './src/index.js',
    output: {
        path: resolve('./js'),
        filename: 'bundle.js'
    },
    module: {
        noParse: /es6-promise\.js$/,
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "app"),
            resolve('./'),
            'node_modules'
        ],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        new webpack.ProvidePlugin({
            Vue: 'vue'
        })
    ]
}

if (process.env.NODE_ENV === 'production') {

    // add these plugins for production mode
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])

    // use production version of vue
    config.resolve.alias.vue = 'vue/dist/vue.min.js'

} else {

    config.devtool = '#source-map'

}

module.exports = config
