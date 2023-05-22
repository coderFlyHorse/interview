// 插件的三种条件
// 1、类
// 2、要有一个apply函数
// 3、调用compilerAPI 影响打包结果
class RemoveConsolePlugin {
    constructor(params) {
        console.log(params);
    }
    apply(compiler) {
        // 指定一个挂载到 webpack 自身的事件钩子。
        compiler.hooks.emit.tapAsync(
            'RemoveConsolePlugin',
            (compilation, callback) => {
                console.log('这是一个示例插件！');
                console.log(
                    '这里表示了资源的单次构建的 `compilation` 对象：',
                    compilation.assets['bundle.js']
                );



                // 用 webpack 提供的插件 API 处理构建过程
                // compilation.addModule(/* ... */);

                callback();
            }
        );
    }
}

module.exports = RemoveConsolePlugin;