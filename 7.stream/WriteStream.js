const EventEmitter = require('events');
const fs = require('fs');
class WriteStream extends EventEmitter{
    constructor(path,options){
        super();
        this.path = path;
        this.flags = options.flags ||'w';
        this.encoding = options.encoding || 'utf8';
        this.mode = options.mode || 0o666;
        this.autoClose = options.autoClose || true;
        this.start = options.start || 0;
        this.highWaterMark = options.highWaterMark || 16*1024;

        this.len = 0; // 用于维持有多少数据没有被写入到文件中的
        this.needDrain = false;
        this.cache = [];
        this.writing = false; // 用于标识是否是第一次写入
        this.open();
    }
    open(){
        fs.open(this.path,this.flags,this.mode,(err,fd)=>{
            this.fd = fd;
            this.emit('open',fd)
        })
    }
    write(chunk,encoding = this.encoding,cb = ()=>{}){ // Writable 类中的
        // 1.将数据全部转化成buffer
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        this.len += chunk.length;
        let returnValue = this.len < this.highWaterMark;
        // 当数据写入后 需要在手动的将 this.len--;
        this.needDrain = !returnValue;


        // 此时我需要 判断你是第一次给我的，还是不是第一次
        if(!this.writing){
            // 当前没有正在写入说明是第一次的
            // 需要真正执行写入的操作
            this.writing = true;
            console.log('真正写入')
        }else{
            console.log('保存到缓存区')
            this.cache.push({
                chunk,
                encoding,
                cb
            });
        }



        return returnValue
    }
}

module.exports = WriteStream