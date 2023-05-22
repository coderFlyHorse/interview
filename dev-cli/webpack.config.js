const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入插件
// 每次打包的时候，打包目录都会遗留上次打包的文件，为了保持打包目录的纯净，我们需要在打包前将打包目录清空
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin //打包分析
// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const RemoveConsolePlugin = require("./plugins/remove-console-plugin")
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob'); // 文件匹配模式

function resolve(dir) {
    return path.join(__dirname, dir);
}
const purgeFiles = glob.sync(`${resolve("src")}/**/*`, { nodir: true })
purgeFiles.push(path.resolve(__dirname, "public/index.html"))
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
        noParse: /jquery|lodash/,  //不需要进行解析的库
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
                include: resolve('src'), //babel 转化 排除掉 node_modules目录 
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader', // 开启多进程打包 (小项目中不需要使用)
                        options: {
                            worker: 3,
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true // 启用缓存
                        },
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ],

            }
        ]  // 从右往左执行
    },
    plugins: [ // 配置插件
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(), // 引入插件,
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            // analyzerMode: 'server',
            // analyzerMode: 'disabled',
            // analyzerHost: '127.0.0.1',
            // analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'gzip',
            generateStatsFile: true, // 如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
            openAnalyzer: false, // 默认在浏览器中自动打开报告
            statsFilename: 'stats.json', // 如果generateStatsFile为true，将会生成Webpack Stats JSON文件的名字
            statsOptions: { source: false }
        }),
        // new RemoveConsolePlugin("")
        new PurgeCSSPlugin({
            paths: purgeFiles,
        })
    ],
    // 压缩css
    optimization: {
        minimize: true,
        usedExports: true, //tree shaking
        minimizer: [
            // 添加 css 压缩配置
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ],
        splitChunks: {
            cacheGroups: { // 配置提取模块的方案
              default: false,
              styles: {
                  name: 'styles',
                  test: /\.(s?css|less|sass)$/,
                  chunks: 'all',
                  enforce: true,
                  priority: 10,
                },
                common: {
                  name: 'chunk-common',
                  chunks: 'all',
                  minChunks: 2,
                  maxInitialRequests: 5,
                  minSize: 0,
                  priority: 1,
                  enforce: true,
                  reuseExistingChunk: true,
                },
                vendors: {
                  name: 'chunk-vendors',
                  test: /[\\/]node_modules[\\/]/,
                  chunks: 'all',
                  priority: 2,
                  enforce: true,
                  reuseExistingChunk: true,
                },
               // ... 根据不同项目再细化拆分内容
            },
          },
    },
    resolve: {
        // 配置别名
        alias: {
            '@': resolve('src'),
            'components': resolve('src/components'),
        }
    },
    externals: {
        jquery: 'jQuery',  //排除一些不需要进行打包的的第三方库，因为这些库可以进行cdn引入
    },
    cache: {  //缓存生成的 webpack 模块和 chunk，来改善构建速度。cache 会在开发 模式被设置成 type: 'memory' 而且在 生产 模式 中被禁用。
        type: 'memory',
        cacheUnaffected: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true, //是否启动压缩 gzip
        port: 8080, // 端口号
        open: true  // 是否自动打开浏览器
    }
}
const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(config);
configWithTimeMeasures.plugins.push(new MiniCssExtractPlugin({})); //计算打包时间
module.exports = (env, argv) => {
    console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值
    // 这里可以通过不同的模式修改 config 配置
    return configWithTimeMeasures
}


