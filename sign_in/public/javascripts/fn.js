/******************************************************************************************************\
Fn Util Module
封装一些开发中常用的函数，以模块形式导出，方便以后调用
随着知识的积累，可以逐步更新和改善这一模块
采用原生JS编写，所以遇到兼容性问题可采用underscore，lodash，jQuery等库，也可采用ES6提出的新语法形式解决
Copyright @ ZhouJihao 2016
\******************************************************************************************************/

var fn = {
    // 控制台输出方法
    log: function() {
        if (arguments.length <= 0) {
            return;
        }
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[fn module]');
        console.log.apply(window, args);
    },
    warn: function() {
        if (arguments.length <= 0) {
            return;
        }
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[fn module]');
        console.warn.apply(window, args);
    },
    error: function() {
        if (arguments.length <= 0) {
            return;
        }
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[fn module]');
        console.error.apply(window, args);
    },
    // 类型判断,返回小写类型名
    // param {Any}
    // return {String}
    typeOf: function(arg) {
        var type = typeof(arg);
        var result = '';
        switch(type) {
            case 'number':
                if (isNaN(arg)) {
                    result = 'NaN';
                } else {
                    result = 'number';
                }
                break;
            case 'string':
                result = 'string';
                break;
            case 'boolean':
                result = 'boolean';
                break;
            case 'undefined':
                result = 'undefined';
                break;
            case 'function':
                result = 'function';
                break;
            case 'object':
                if (arg === null) {
                    result = 'null';
                } else if (Array.isArray(arg) && Object.prototype.toString.call(arg) == '[object Array]') {
                    result = 'array';
                } else if (arg.constructor) {
                    result = arg.constructor.name.toString().toLowerCase();
                } else {
                    result = 'object';
                }
                break;
            default:
                break;
        }
        return result;
    },
    // 数组去重,去除重复的number, string, array and object
    // param {Array}
    // return {Array}
    uniqueArr: function(arr) {
        if (fn.typeOf(arr) != 'array') {
            fn.error('[uniqueArr] argument is not Array.');
            return arr;
        } else if (arr.length <= 1) {
            return arr;
        } else {
            var result = [];
            var hash = {};
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var exist = false;
                Object.keys(hash).forEach(function(k) {
                    if (item === hash[k]) {
                        exist = true;
                        return;
                    }
                });
                if (!exist) {
                    hash[i] = item;
                    result.push(item);
                }
            }
            return result;
        }
    },
    // 数组快速排序
    // param {Array}
    // return {Array}
    quickSort: function(arr) {
        if (fn.typeOf(arr) != 'array') {
            fn.error('[quickSort] argument is not Array.');
            return arr;
        } else if (arr.length <= 1) {
            return arr;
        } else {
            var middle = Math.floor(arr.length / 2);
            var pivot = arr.splice(middle, 1)[0];
            var left = [], right = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] < pivot) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            return fn.quickSort(left).concat([pivot], fn.quickSort(right));
        }
    },
    // 仿jQuery源代码实现 普通对象 的深扩展或深拷贝
    // @param1 {Object} target [要被扩展的对象]
    // @param2 {Object} [扩展来源] 
    // @param3 {Object} [扩展来源]
    // ...
    // @return {Object} [扩展后的对象]
    deepExtend: function(target) {
        var length = arguments.length;
        if (length <= 1) {
            fn.error('[deepExtend] arguments is not Enough.');
            return target ? target : {};
        }
        if (typeof target !== 'object') {
            target = {};
        }
        
        for (var i = 1; i < length; i++) {
            var srcObj = arguments[i];
            if (srcObj != null) {
                for (name in srcObj) {
                    var src = srcObj[name];
                    var tgt = target[name];
                    if (src === tgt) {
                        continue;
                    }
                    // 如果是数组或对象，递归
                    if (fn.typeOf(src) == 'array' || fn.typeOf(src) == 'object') {
                        var clone;
                        if (fn.typeOf(src) == 'array') {
                            clone = (tgt && fn.typeOf(tgt) == 'array') ? tgt : [];
                        } else {
                            clone = (tgt && fn.typeOf(tgt) == 'object') ? tgt : {};
                        }
                        target[name] = fn.deepExtend(clone, src);
                    } else if (src !== undefined) {
                        target[name] = src;
                    }
                }
            }
        }
        return target;
    },
    // 简单函数节流
    // @param {Function} foo [要节流执行的函数]
    // @param {Number} delay [延时，单位：ms]
    throttle: function(foo, delay) {
        if (foo.timer) {
            clearTimeout(foo.timer);
        }
        if (!delay) {
            delay = 1000;
        }
        foo.timer = setTimeout(function() {
            foo.call();
        }, delay);
    },
    // 桥接模式实现的 简单单例模式
    // @param {Function} foo [创建实例对象的函数]
    // @return [Closure]
    singleton: function(foo) {
        var instance;
        return function() {
            return instance || (instance = foo.call());
        }
    },
    // 简单观察者模式, a.k.a. 发布订阅模式
    createObserver: function() {
        var observer = new Object();
        observer = {
            handlers: {},
            listen: function(event, handler) {
                if (typeof this.handlers[event] === 'undefined' || !this.handlers[event]) {
                    this.handlers[event] = [];
                }
                this.handlers[event].push(handler);
            },
            trigger: function(event, data=null) {
                if (typeof this.handlers[event] === 'undefined' || !this.handlers[event]) {
                    fn.warn('[Observer Module] No such event to be trigered: ' + event);
                } else {
                    for (var i = 0; i < this.handlers[event].length; i++) {
                        var foo = this.handlers[event][i];
                        foo(data);
                    }
                }
            },
            remove: function(event, handler) {
                var handlers = this.handlers[event];
                if (fn.typeOf(handlers) == 'array') {
                    handlers.forEach(function(item, index) {
                        if (item == handler) {
                            handlers.splice(index, 1);
                            return;
                        }
                    });
                } else {
                    fn.warn('[Observer Module] No such event to be removed: ' + event);
                }
            }
        }
        return observer;
    },
    // XSS字符转义
    // @param {String} markup [要转义的字符串]
    replaceXSS: function(markup) {
        var _ENCODE_HTML_RULES = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&#34;",
            "'": "&#39;"
        };
        var _MATCH_HTML = /[&<>'"]/g;

        function encode_char(c) {
            return _ENCODE_HTML_RULES[c] || c;
        };
        return markup === undefined ? '' : String(markup).replace(_MATCH_HTML, encode_char);
    },
    // 将object转为form data，方便post提交
    // @param {Object} obj [数据对象]
    // @return {String}
    encodeFormData: function(obj) {
        if (!obj) return;
        var pairs = [];
        for (var name in obj) {
            if (!obj.hasOwnProperty(name)) continue;
            if (typeof obj[name] == 'function') continue;
            var value = obj[name].toString();
            name = encodeURIComponent(name.replace('%20', '+'));
            value = encodeURIComponent(value.replace('%20', '+'));
            pairs.push(name + '=' + value);
        }
        return pairs.join('&');
    },
    // 创建 XMLHttpRequest对象
    createXHR: function() {
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            if (typeof arguments.callee.activeXString != 'string') {
                var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'],
                    i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                    } catch (e) {}
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error('No XHR object available.');
        }
    }
}
