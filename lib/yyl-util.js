/* eslint no-empty: 0 */
const path = require('path');

const fn = {
  formatUrl: (url) => url.replace(/\\/g, '/')
};

const util = {
  async forEach(arr, fn) {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (await fn(arr[i], i) === true) {
        break;
      }
    }
  },
  cmdParse(processArgv, typeMap) {
    const iArgv = processArgv.slice(1);
    const SHORT_ENV_REG = /^-(\w+)/;
    const ENV_REG = /^--(\w+)/;
    const r = {
      cmds: [],
      env: {},
      shortEnv: {}
    };

    for (let i = 0, key, nextKey, len = iArgv.length; i < iArgv.length; i++) {
      key = iArgv[i];
      nextKey = iArgv[i + 1];
      if (key.match(SHORT_ENV_REG) || key.match(ENV_REG)) { // shortEnv | env
        let realKey;
        let handle;
        if (key.match(SHORT_ENV_REG)) {
          handle = 'shortEnv';
          realKey = key.replace(SHORT_ENV_REG, '$1');
        } else {
          handle = 'env';
          realKey = key.replace(ENV_REG, '$1');
        }

        let val;
        if (
          i >= len - 1 ||
          nextKey.match(SHORT_ENV_REG) ||
          nextKey.match(ENV_REG)
        ) {
          val = true;
        } else if (
          typeof typeMap === 'object' &&
          typeMap[handle] &&
          typeMap[handle][realKey]
        ) {
          // boolean 类型
          switch (typeMap[handle][realKey]) {
            case Boolean:
              if (nextKey === 'true') {
                val = true;
                i++;
              } else if (nextKey === 'false') {
                val = false;
                i++;
              } else {
                val = true;
              }
              break;
            case Number:
              if (!isNaN(nextKey)) {
                val = Number(nextKey);
                i++;
              } else {
                val = 1;
              }
              break;
            case String:
            default:
              val = nextKey;
              i++;
              break;
          }
        } else {
          if (nextKey == 'true') {
            val = true;
          } else if (nextKey == 'false') {
            val = false;
          } else if (!isNaN(nextKey)) {
            val = Number(nextKey);
          } else {
            val = nextKey;
          }
          i++;
        }
        r[handle][realKey] = val;
      } else { // ctx
        r.cmds.push(key);
      }
    }

    return r;
  },
  shortEnvParse(argv) {
    const self = this;
    let iArgv;
    if (typeof argv == 'string') {
      iArgv = argv.split(/\s+/);
    } else {
      iArgv = util.makeArray(argv);
    }
    iArgv = [''].concat(iArgv);
    const { shortEnv } = self.cmdParse(iArgv);
    return shortEnv;
  },
  shortEnvStringify(obj) {
    const r = [];
    if (typeof obj !== 'object') {
      throw `util.envStringify error, obj type error: ${typeof obj}`;
    }

    Object.keys(obj).forEach((key) => {
      if (obj[key] === true || obj[key] === 'true') {
        r.push(`-${key}`);
      } else {
        r.push(`-${key} ${obj[key]}`);
      }
    });
    return r.join(' ');
  },
  makeAsync(fn, isMocha) {
    return function (next) {
      if (isMocha) {
        this.timeout(0);
      }
      fn().then((...argu) => {
        if (typeof next === 'function') {
          next(...argu);
        }
      }).catch((er) => {
        throw er;
      });
    };
  },
  makeAwait(fn) {
    return new Promise(fn);
  },
  waitFor(ms) {
    return new Promise((next) => {
      setTimeout(() => {
        next();
      }, ms);
    });
  },

  makeArray(obj) {
    return Array.prototype.slice.call(obj);
  },

  envStringify(obj) {
    const r = [];
    if (typeof obj !== 'object') {
      throw `util.envStringify error, obj type error: ${typeof obj}`;
    }

    Object.keys(obj).forEach((key) => {
      if (obj[key] === true || obj[key] === 'true') {
        r.push(`--${key}`);
      } else {
        r.push(`--${key} ${obj[key]}`);
      }
    });
    return r.join(' ');
  },
  envParse(argv) {
    const self = this;
    let iArgv;
    if (typeof argv == 'string') {
      iArgv = argv.split(/\s+/);
    } else {
      iArgv = util.makeArray(argv);
    }
    iArgv = [''].concat(iArgv);

    const { env } = self.cmdParse(iArgv);
    return env;
  },

  type(obj) {
    let type;
    const toString = Object.prototype.toString;
    if (obj === null) {
      type = String(obj);
    } else {
      type = toString.call(obj).toLowerCase();
      type = type.substring(8, type.length - 1);
    }
    return type;
  },

  isPlainObject(obj) {
    const she = this;
    let key;
    const hasOwn = Object.prototype.hasOwnProperty;

    if (!obj || she.type(obj) !== 'object') {
      return false;
    }

    if (
      obj.constructor &&
      !hasOwn.call(obj, 'constructor') &&
      !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
    ) {
      return false;
    }

    for (key in obj) {}
    return key === undefined || hasOwn.call(obj, key);
  },

  extend() {
    const she = this;
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = arguments[0] || {};
    let i = 1;
    const length = arguments.length;
    let deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && she.type(target) !== 'function') {
      target = {};
    }

    // extend caller itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) !== null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (she.isPlainObject(copy) || (copyIsArray = she.type(copy) === 'array'))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && she.type(src) === 'array' ? src : [];
            } else {
              clone = src && she.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = she.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  },
  matchVersion(ver1, ver) {
    const githubReg = /^github:\w+/;
    if (ver1.match(githubReg) || ver.match(githubReg)) {
      return false;
    }
    const r = this.compareVersion(ver1, ver);
    const aVer = `${ver1}`;
    const bVer = `${ver}`;
    const oriVer = aVer.replace(/^[~^v]/, '');
    // *
    if (aVer === '*') {
      return true;
    // ^1.0.0
    } else if (/^\^/.test(aVer)) {
      if (
        r <= 0 &&
        oriVer.split('.')[0] === bVer.split('.')[0]
      ) {
        return true;
      } else {
        return false;
      }
    // ~1.0.0
    } else if (/^~/.test(aVer)) {
      return r === 0;
    // 1.0.0
    } else if (/^\d/.test(aVer)) {
      return r === 0;
    } else {
      return aVer === bVer;
    }
  },
  compareVersion(v1, v2) {
    if (v1 == '*' && v2) {
      return -1;
    } else if (v1 && v2 == '*') {
      return 1;
    } else if (v1 == v2) {
      return 0;
    }

    const semver = /^[v^~]?(?:0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)?)?$/i;
    const patch = /-([0-9A-Za-z-.]+)/;

    function split(v) {
      const temp = v.replace(/^(v|\^|~)/, '').split('.');
      const arr = temp.splice(0, 2);
      arr.push(temp.join('.'));
      return arr;
    }

    function tryParse(v) {
      return isNaN(Number(v)) ? v : Number(v);
    }

    function validate(version) {
      if (typeof version !== 'string') {
        throw new TypeError('Invalid argument expected string');
      }
      if (!semver.test(version)) {
        throw new Error('Invalid argument not valid semver');
      }
    }



    [v1, v2].forEach(validate);

    const s1 = split(v1);
    const s2 = split(v2);

    for (let i = 0; i < 3; i++) {
      const n1 = parseInt(s1[i] || 0, 10);
      const n2 = parseInt(s2[i] || 0, 10);

      if (n1 > n2) {
        return 1;
      }
      if (n2 > n1) {
        return -1;
      }
    }

    if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
      const p1 = patch.exec(s1[2])[1].split('.').map(tryParse);
      const p2 = patch.exec(s2[2])[1].split('.').map(tryParse);

      for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
        if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') {
          return -1;
        }
        if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') {
          return 1;
        }

        if (p1[i] > p2[i]) {
          return 1;
        }
        if (p2[i] > p1[i]) {
          return -1;
        }
      }
    } else if ([s1[2], s2[2]].some(patch.test.bind(patch))) {
      return patch.test(s1[2]) ? -1 : 1;
    }

    return 0;
  },

  makeCssJsDate() {
    const now = new Date();
    const addZero = function(num) {
      return num < 10 ? `0${  num}` : `${  num}`;
    };
    return now.getFullYear() +
      addZero(now.getMonth() + 1) +
      addZero(now.getDate()) +
      addZero(now.getHours()) +
      addZero(now.getMinutes()) +
      addZero(now.getSeconds());
  },

  requireJs(iPath) {
    let rPath;
    let cacheName;
    if (path.isAbsolute(iPath)) {
      rPath = path.relative(__dirname, iPath);
      cacheName = iPath;
    } else {
      if (/^([/\\]|[^:/\\]+[/\\.])/.test(iPath)) {
        rPath = util.path.join('./', iPath);
        cacheName = path.join(__dirname, rPath);
      } else {
        rPath = iPath;
        cacheName = rPath;
      }
    }
    Object.keys(require.cache).forEach((cPath) => {
      if (util.path.join(cPath) == util.path.join(cacheName)) {
        delete require.cache[cPath];
      }
    });

    try {
      return require(rPath);
    } catch (er) {
      throw new Error(er);
    }
  },

  path: {
    join() {
      let iArgv = util.makeArray(arguments);
      iArgv = iArgv.map((url) => {
        return fn.formatUrl(url);
      });

      let r = path.join(...iArgv);

      // what?
      if (/^\.[\\/]$/.test(iArgv[0])) {
        r = `./${  r}`;
      }

      if (!/[/\\]$/.test(iArgv[iArgv.length - 1])) {
        r = r.replace(/[/\\]$/, '');
      }

      return r
        .replace(/\\/g, '/')
      // 修复 mac 下 //web.yystaitc.com 会 被 path.join 变成 /web.yystaitc.com  问题
        .replace(/^(\/+)/g, /^\/\//.test(iArgv[0]) ? '//' : '$1')
        .replace(/([^/])\/+/g, '$1/')
        .replace(/(^http[s]?:)[/]+/g, '$1//')
        .replace(/(^file:)[/]+/g, '$1///');
    },
    relative() {
      let iArgv = util.makeArray(arguments);
      iArgv = iArgv.map((url) => {
        return fn.formatUrl(url);
      });
      return util.path.join(path.relative(...iArgv));
    },
    resolve() {
      let iArgv = util.makeArray(arguments);
      iArgv = iArgv.map((url) => {
        return fn.formatUrl(url);
      });
      return util.path.join(path.resolve(...iArgv));
    }
  }
};

module.exports = util;
