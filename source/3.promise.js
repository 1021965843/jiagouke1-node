const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
class Promise {
    constructor(executor) {
        this.status = PENDING; // promise默认的状态
        this.value = undefined; // 成功的原因
        this.reason = undefined; // 失败的原因
        this.onResolvedCallbacks = []; // 存放成功的回调方法
        this.onRejectedCallbacks = []; // 存放失败的回调方法
        const resolve = (value) => { // 成功resolve函数
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED; // 修改状态
                // 发布
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => { // 失败的reject函数
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED // 修改状态

                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) { // onFulfilled, onRejected

        // 用于实现链式调用
        let promise2 = new Promise((resolve, reject) => {
            // 订阅模式
            if (this.status == FULFILLED) { // 成功调用成功方法
                try {
                    let x = onFulfilled(this.value);

                    // 此x 可能是一个promise， 如果是promise需要看一下这个promise是成功还是失败 .then ,如果成功则把成功的结果 调用promise2的resolve传递进去，如果失败则同理

                    // 总结 x的值 决定是调用promise2的 resolve还是reject，如果是promise则取他的状态，如果是普通值则直接调用resolve
                    resolve(x);
                } catch (e) {
                    reject(e);
                }
            }
            if (this.status === REJECTED) { // 失败调用失败方法
                try {
                    let x = onRejected(this.reason);
                    resolve(x);
                } catch (e) {
                    reject(e);
                }
            }
            if (this.status == PENDING) { // 代码是异步调用resolve或者reject的
                this.onResolvedCallbacks.push(() => { // 切片编程 AOP
                    try {
                        // todo...
                        let x = onFulfilled(this.value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        // todo...
                        let x = onRejected(this.reason);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        })

        return promise2
    }
}

module.exports = Promise