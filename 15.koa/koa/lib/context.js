const context = {
    // get query(){
    //     return this.request['query'];
    // },
    // get path(){
    //     return this.request['path']
    // }
}
// 应该使用Object.defineProperty defineProperty当设置值的时候需要配合get

function defineGetter(target,key){ // proxy , defineProperty  
    context.__defineGetter__(key, function(){
        return this[target][key]; // ctx.request.query / ctx.request.path;
    })
}

// 如果是request上取值，就代理到原生req。如果去ctx上取值，就代理到ctx.request-》 req
defineGetter('request','query');
defineGetter('request','path');

module.exports = context;