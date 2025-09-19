function isPending(state) {
    return state === "pending";
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

function handleTasks(promise) {
    if (isPending(promise._state)) return;

    queueMicrotask(() => {
        while (promise._tasks.length) {
            const { onFulfilled, onRejected, newPromise } =
                promise._tasks.shift();
            let result;

            if (!isFunction(onFulfilled) && promise._state === "fulfilled") {
                toResolve(newPromise, promise._value);
                continue;
            }

            if (!isFunction(onRejected) && promise._state === "rejected") {
                toReject(newPromise, promise._reason);
                continue;
            }

            try {
                result =
                    promise._state === "fulfilled"
                        ? onFulfilled(promise._value)
                        : onRejected(promise._reason);
            } catch (error) {
                toReject(newPromise, error);
                continue;
            }

            toResolve(newPromise, result);
        }
    });
}

function toReject(p, reason) {
    if (!isPending(p._state)) return;
    p._state = "rejected";
    p._reason = reason;
    handleTasks(p);
}

function toResolve(p, value) {
    if (!isPending(p._state)) return;

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
        return;
    }

    p._state = "fulfilled";
    p._value = value;
    handleTasks(p);
}

export { toResolve, toReject, handleTasks, isFunction };
