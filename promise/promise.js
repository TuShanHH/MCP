import { toResolve, toReject, handleTasks } from "./aide.js";

class MyPromise {
    _state = "pending"; //promise状态
    _value = undefined; //promise功的值
    _reason = undefined; //promise败的原因
    _tasks = []; //then方法中的任务队列

    constructor(executor) {
        const resolve = (value) => {
            toResolve(this, value);
        };
        const reject = (reason) => {
            toReject(this, reason);
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        const newPromise = new MyPromise(() => {});

        this._tasks.push({ onFulfilled, onRejected, newPromise });
        handleTasks(this);

        return newPromise;
    }
}

export default MyPromise;