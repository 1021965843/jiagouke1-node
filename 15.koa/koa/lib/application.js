const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Application {
    constructor() {
        this.context = Object.create(context); //  实现每次创建一个应用都有自己的全新上下文
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    use(fn) {
        // 保存用户写的函数
        this.fn = fn;
    }
    createContext(req, res) {
        let ctx = Object.create(this.context); // 这个目的是为了每次请求的时候 都拥有自己的上下文，而且自己的上下文是可以获取公共上下文声明的变量、属性
        let request = Object.create(this.request);
        let response = Object.create(this.response);


        ctx.request = request; // 上下文中包含着request
        ctx.req = ctx.request.req = req; // 默认上下文中包含着 原生的req


        return ctx;
    }
    handleRequest = (req, res) => { // 每次请求都会执行此方法
        let ctx = this.createContext(req, res)
        this.fn(ctx);
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest);
        server.listen(...args);
    }
}
module.exports = Application




// function create(proto){
//     function Fn(){}  构建一个空的函数 用于存放传入的原型
//     Fn.prototype = proto;
//     return new Fn()
// }