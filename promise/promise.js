// import { toReject, toResolve } from "./aide.js";
function isPending(state) {
    return state !== "pending";
}

function isObject(value) {
    return (
        (typeof value === "object" && value !== null) ||
        typeof value === "function"
    );
}

function isFunction(value) {
    return typeof value === "function";
}

function toReject(p, reason) {
    if (isPending(p._state)) return;
    p._state = "rejected";
    p._reason = reason;
}

function toResolve(p, value) {
    if (isPending(p._state)) return;

    //如果p和value是同一个对象
    if (p === value) return toReject(p, new TypeError("不能自己等待自己完成"));

    //如果value是一个promise
    if (isObject(value) || (isFunction(value) && isFunction(value.then))) {
        queueMicrotask(() => {
            value.then(
                (value) => {
                    toResolve(p, value);
                },
                (reason) => {
                    toReject(p, reason);
                }
            );
        });
    }

    p._state = "fulfilled";
    p._value = value;
}

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
