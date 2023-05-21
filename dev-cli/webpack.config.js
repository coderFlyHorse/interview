const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入插件
// 每次打包的时候，打包目录都会遗留上次打包的文件，为了保持打包目录的纯净，我们需要在打包前将打包目录清空
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量
const config = {
    mode: 'development', // 模式
    entry: './src/index.js', // 打包入口地址
    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.join(__dirname, 'dist') // 输出文件目录
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/, use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    // 'style-loader',  
                    MiniCssExtractPlugin.loader,
                    // 将 CSS 转化成 CommonJS 模块
                    'css-loader',
                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ],
            }, {
                test: /\.(jpe?g|png|gif)$/i,
                type: 'asset',
                generator: {
                    // 输出文件位置以及文件名
                    // [ext] 自带 "." 这个与 url-loader 配置不同
                    filename: "[name][hash:8][ext]"
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 50 * 1024 //超过50kb不转 base64
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                type: 'asset',
                generator: {
                    // 输出文件位置以及文件名
                    filename: "[name][hash:8][ext]"
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 超过100kb不转 base64
                    }
                }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]  // 从右往左执行
    },
    plugins: [ // 配置插件
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(), // 引入插件,
        new MiniCssExtractPlugin({ // 添加插件
            filename: '[name].[hash:8].css'
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true, //是否启动压缩 gzip
        port: 8080, // 端口号
        open: true  // 是否自动打开浏览器
    }
}
module.exports = (env, argv) => {
    console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值
    // 这里可以通过不同的模式修改 config 配置
    return config;
}


