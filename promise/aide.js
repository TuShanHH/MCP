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
export { toResolve, toReject };
