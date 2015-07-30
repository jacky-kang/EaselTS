define(["require", "exports"], function (require, exports) {
    var asap = (typeof setImmediate === 'function' && setImmediate) || function (fn) {
        setTimeout(fn, 1);
    };
    var isArray = Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };
    function handle(deferred) {
        var me = this;
        if (this._state === null) {
            this._deferreds.push(deferred);
            return;
        }
        asap(function () {
            var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (me._state ? deferred.resolve : deferred.reject)(me._value);
                return;
            }
            var ret;
            try {
                ret = cb(me._value);
            }
            catch (e) {
                deferred.reject(e);
                return;
            }
            deferred.resolve(ret);
        });
    }
    function resolve(newValue) {
        try {
            if (newValue === this)
                throw new TypeError('A promise cannot be resolved with itself.');
            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (typeof then === 'function') {
                    doResolve(then.bind(newValue), resolve.bind(this), reject.bind(this));
                    return;
                }
            }
            this._state = true;
            this._value = newValue;
            finale.call(this);
        }
        catch (e) {
            reject.call(this, e);
        }
    }
    function reject(newValue) {
        this._state = false;
        this._value = newValue;
        finale.call(this);
    }
    function finale() {
        for (var i = 0, len = this._deferreds.length; i < len; i++) {
            handle.call(this, this._deferreds[i]);
        }
        this._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
            fn(function (value) {
                if (done)
                    return;
                done = true;
                onFulfilled(value);
            }, function (reason) {
                if (done)
                    return;
                done = true;
                onRejected(reason);
            });
        }
        catch (ex) {
            if (done)
                return;
            done = true;
            onRejected(ex);
        }
    }
    var Promise = (function () {
        function Promise(init) {
            this._state = null;
            this._value = null;
            this._deferreds = [];
            if (typeof this !== 'object')
                throw new TypeError('Promises must be constructed via new');
            if (typeof init !== 'function')
                throw new TypeError('not a function');
            doResolve(init, resolve.bind(this), reject.bind(this));
        }
        Promise.all = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var args = (args.length === 1 && isArray(args[0]) ? args[0] : args);
            return new Promise(function (resolve, reject) {
                if (args.length === 0)
                    return resolve([]);
                var remaining = args.length;
                function res(i, val) {
                    try {
                        if (val && (typeof val === 'object' || typeof val === 'function')) {
                            var then = val.then;
                            if (typeof then === 'function') {
                                then.call(val, function (val) {
                                    res(i, val);
                                }, reject);
                                return;
                            }
                        }
                        args[i] = val;
                        if (--remaining === 0) {
                            resolve(args);
                        }
                    }
                    catch (ex) {
                        reject(ex);
                    }
                }
                for (var i = 0; i < args.length; i++) {
                    res(i, args[i]);
                }
            });
        };
        Promise.resolve = function (value) {
            if (value && typeof value === 'object' && value.constructor === Promise) {
                return value;
            }
            return new Promise(function (resolve) {
                resolve(value);
            });
        };
        Promise.reject = function (value) {
            return new Promise(function (resolve, reject) {
                reject(value);
            });
        };
        Promise.race = function (values) {
            return new Promise(function (resolve, reject) {
                for (var i = 0, len = values.length; i < len; i++) {
                    values[i].then(resolve, reject);
                }
            });
        };
        Promise._setImmediateFn = function (fn) {
            asap = fn;
        };
        Promise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        Promise.prototype.then = function (onFulfilled, onRejected) {
            var me = this;
            return new Promise(function (resolve, reject) {
                handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
            });
        };
        return Promise;
    })();
    return Promise;
});