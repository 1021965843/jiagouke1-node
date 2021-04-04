// node中的代码调试

let a = require('./a')
console.log(a);

// 1.直接在vscode中调试 
// 2.可以在chrome中进行调试 方案调试  node --inspect-brk  执行的文件


// 1.require方法 -> Module.protoype.require方法
// 2.Module._load 加载模块
// 3.Module._resolveFilename 方法就是把路径变成了绝对路径 添加后缀名 (.js .json) .node
// 4. new Module 拿到绝对路径创造一个模块  this.id  exports = {}
// 5.module.load 对模块进行加载
// 6.根据文件后缀 Module._extensions['.js'] 去做策略加载
// 7.用的是同步读取文件
// 8.增加一个函数的壳子 并且让函数执行 让 module.exports 作为了this
// 9.用户会默认拿到module.exports的返回结果
// 最终返回的是 exports对象