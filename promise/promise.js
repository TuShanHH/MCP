

class MyPromise {
    _state = "pending"; //promise状态
    _value = undefined; //成功的值
    _reason = undefined; //失败的原因

    constructor(executor) {
        const resolve = (value) => {
            toResolve(this, value);
        };
        const reject = (reason) => {
            toReject(this, reason);
        };

        executor(resolve, reject);
    }

    then() {}
}

const p = new MyPromise((resolve, reject) => {
    reject("捕获到错误");
    resolve(1000);
});

const pro = new Promise((resolve, reject) => {
    reject("捕获到错误");
});
console.log(pro);
