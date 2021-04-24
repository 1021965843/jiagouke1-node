const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Stream = require('stream')

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

        ctx.response = response;
        ctx.res = ctx.response.res = res; // 这个的目的和request的含义是一致的，就是可以在我们的response对象中 通过this.res 拿到原生res

        return ctx;
    }
    handleRequest = (req, res) => { // 每次请求都会执行此方法
        let ctx = this.createContext(req, res);
        res.statusCode = 404;
        this.fn(ctx);
        let _body = ctx.body;
        if(_body){
            if(typeof _body === 'string' || Buffer.isBuffer(_body)){
                return res.end(_body);
            }else if(typeof _body === 'number'){
                return res.end(_body + '');
            }else if(_body instanceof Stream){
                // 可以设置成下载头 
                //res.setHeader('Content-Type','application/octet-stream');
                // 设置不识别的header 也会变成下载文件，设置对了才行
                // res.setHeader('Content-Disposition','attachment;filename=FileName.txt');
                return _body.pipe(res);
            }else if(typeof _body == 'object'){
                return res.end(JSON.stringify(_body));
            }
        }else{
            res.end(`Not Found`)
        }
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