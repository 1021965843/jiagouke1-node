// 异步的方法  
// fs.mkdirSync fs.mkdir 目录创建是要一层一层的创建
// fs.stat 可以用于描述文件的状态，如果不存在文件，就发生错误
// fs.existsSync 只有同步的异步被废弃了

// a a/b a/b/c a/b/c/d

// 异步递归创造目录 
/*
const fs = require('fs');
function mkdir(pathStr, cb) {
    let pathList = pathStr.split('/'); // [a,b,c,d]
    let index = 1;
    function make(err) { // co模型
        if (err) return cb(err);
        if (index === pathList.length + 1) return cb();
        let currentPath = pathList.slice(0, index++).join('/') // [a]  [a,b]
        fs.stat(currentPath,function (err) {
            if(err){
                fs.mkdir(currentPath, make)
            }else{
                make();
            }
        })
    }
    make();
}
mkdir('a/b/c/d', function(err) {
    if (err) return console.log(err)
    console.log('创建成功')
});
*/
const fs = require('fs').promises; // node.11后可以直接.promises
const {existsSync} = require('fs')
async function mkdir(pathStr) {
    let pathList = pathStr.split('/');
    for (let i = 1; i <= pathList.length; i++) {
        let currentPath = pathList.slice(0, i).join('/');
        if(!existsSync(currentPath)){
            await fs.mkdir(currentPath)
        }
    }
}
mkdir('a/b/c/d').then(() => {
    console.log('创造成功')
}).catch(err => {
    console.log(err)
})
