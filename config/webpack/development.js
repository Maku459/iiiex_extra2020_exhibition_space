process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

environment.plugins.prepend('HardSourceWebpackPlugin', new HardSourceWebpackPlugin());

environment.plugins.append(
    "CleanWebpackPlugin",
    new CleanWebpackPlugin({
        verbose: true,
    })
)

environment.devtool = 'eval'

module.exports = environment.toWebpackConfig()
