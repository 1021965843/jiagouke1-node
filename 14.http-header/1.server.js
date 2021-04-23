const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const querystring = require('querystring'); // json.parse  json.stringify

const server = http.createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);

    // 客户端会发送一个请求， 接受客户端的数据 

    // 后端“路由”  restful风格  一般根据请求路径和方法 来做处理

    // cors
    // if (req.headers.origin) {
    //     // 表示谁来访问服务器都可以 (token 不是cookie，cookie跨域不能使用 *)
    //     res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

    //     // 服务器告诉浏览器 我能识别你自定的header
    //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token')

    //     // 每隔10s试探一次
    //     res.setHeader('Access-Control-Max-Age', '10');
    //     // 我服务可以接受哪些方法的请求
    //     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST,OPTIONS')

    //     // 表示运行携带cookie了
    //     res.setHeader('Access-Control-Allow-Credentials', true)

    //     if (req.method === 'OPTIONS') {
    //         return res.end(); // 表示是一个试探型请求 不要处理就ok
    //     }
    // }



    if (pathname === '/login' && req.method == 'POST') {
        const buffer = [];
        req.on('data', function(chunk) {
            buffer.push(chunk);
        });
        req.on('end', function() {
            let buf = Buffer.concat(buffer); // 前端传递的数据 
            // http1.0中的特点 为了能识别不同类型 需要通过请求头来处理
            if (req.headers['content-type'] === 'application/json') {
                let obj = JSON.parse(buf.toString()); // 回显json
                res.setHeader('Content-Type','application/json')
                res.end(JSON.stringify(obj));
            } else if (req.headers['content-type'] === 'text/plain') {
                res.setHeader('Content-Type','text/plain')
                res.end(buf.toString());
            } else if(req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                // {username:"123"}  username=123&password=456  a=1; b=2
                let r = querystring.parse(buf.toString(),'&','='); // 可以将查询字符串 转化成对象
                res.end(JSON.stringify(r));
            }else{
                console.log(buf.toString())
            }
        })
    } else {
        let filePath = path.join(__dirname, pathname);
        fs.stat(filePath, function(err, statObj) {
            if (err) {
                res.statusCode = 404;
                res.end('NOT FOUND')
            } else {
                if (statObj.isFile()) {
                    res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8')
                    fs.createReadStream(filePath).pipe(res);
                } else {
                    let htmlPath = path.join(filePath, 'index.html');
                    fs.access(htmlPath, function(err) {
                        if (err) {
                            res.statusCode = 404;
                            res.end('NOT FOUND')
                        } else {
                            res.setHeader('Content-Type', 'text/html;charset=utf-8')
                            fs.createReadStream(htmlPath).pipe(res);
                        }
                    })
                }
            }
        })
    }





});

server.listen(3000, () => {
    console.log(`server start 3000`)
})