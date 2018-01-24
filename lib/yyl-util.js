'use strict';
const chalk = require('chalk');
const notifier = require('node-notifier');
const http = require('http');
const fs = require('fs');
const net = require('net');
const path = require('path');
const readline = require('readline');

const cache = {
  popConfig: {
    interval: 5000,
    intervalKey: 0,
    timer: 0,
    queues: []
  },
  // taskQueue 用储存字段
  taskQueue: {}
};

const IS_WINDOWS = process.platform == 'win32';
const USERPROFILE = process.env[IS_WINDOWS ? 'USERPROFILE' : 'HOME'];

const MD_REG = { // markdown 文件解析用 RegExp
  TITLE_1: /^#{1}\s+([^ ]+.*$)/,
  TITLE_2: /^#{2}\s+([^ ]+.*$)/,
  TITLE_3: /^#{3}\s+([^ ]+.*$)/,
  TITLE_4: /^#{4}\s+([^ ]+.*$)/,
  TITLE_5: /^#{5}\s+([^ ]+.*$)/,
  TITLE_6: /^#{6}\s+([^ ]+.*$)/,
  TITLE_1_STYLE: /^[=]{3,}$/,
  TITLE_2_STYLE: /^[-]{3,}$/,
  LIST: /^\*{1}\s+([^ ]+.*$)/,
  NUM_LIST: /^\d+\.\s+([^ ]+.*$)/,
  OTHER: /^[ ]*([^ ]+.*$)/,
  SCRIPT: /^`{3}(\w*$)/
};

const fn = {
  formatUrl: (url) => url.replace(/\\/g, '/'),
  makeSpace: (num) => new Array(num + 1).join(' ')
};

const util = {
  readdirSync: function(iPath, filter) {
    const files = fs.readdirSync(iPath);
    const r = [];

    if (filter) {
      files.forEach((str) => {
        if (!str.match(filter)) {
          r.push(str);
        }
      });

      return r;
    } else {
      return files;
    }
  },
  envStringify: function(obj) {
    const r = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] || obj[key] === 0)) {
        r.push(`--${  key}`);
        r.push(obj[key]);
      }
    }
    return r.join(' ');
  },

  envParse: function(argv) {
    let iArgv;
    if (typeof argv == 'string') {
      iArgv = argv.split(/\s+/);
    } else {
      iArgv = util.makeArray(argv);
    }

    const r = {};
    const reg = /^--(\w+)/;

    for (let i = 0, key, nextKey, len = iArgv.length; i < len; i++) {
      key = iArgv[i];
      nextKey = iArgv[i + 1];
      if (key.match(reg) && i <= len - 1) {
        if (i >= len - 1) {
          r[key.replace(reg, '$1')] = true;
        } else {
          if (nextKey.match(reg)) {
            r[key.replace(reg, '$1')] = true;
          } else {
            if (nextKey == 'true' || nextKey == 'false') {
              r[key.replace(reg, '$1')] = Boolean(nextKey);
            } else if (!isNaN(nextKey)) {
              r[key.replace(reg, '$1')] = Number(nextKey);
            } else {
              r[key.replace(reg, '$1')] = nextKey;
            }
            i++;
          }
        }
      }
    }
    return r;
  },

  openBrowser: function(address) {
    if (/^[/]{2}/.test(address)) {
      address = `http:${  address}`;
    }
    if (IS_WINDOWS) {
      util.runCMD(`start ${  address}`);
    } else {
      util.runCMD(`open ${  address}`);
    }
  },

  /**
   * 目录输出
   */
  buildTree: function(op) {
    const options = {
      // 当前目录
      path: '',
      // 虚拟目录列表
      dirList: [],
      // 目录前缀
      frontPath: '',
      // 目录树前置空格数目
      frontSpace: 2,
      // 目录过滤
      dirFilter: null,
      // 不展开的文件夹列表
      dirNoDeep: []
    };
    const o = util.extend(options, op);
    const deep = function(iPath, parentStr) {
      const list = readdirSync(iPath);
      let space = '';
      let iParentStr = '';


      if (!list.length) {
        return;
      }
      iParentStr = parentStr.replace(/^(\s*)[a-zA-Z0-9._-]+/, '$1');
      space = iParentStr.split(/[-~]/)[0];
      // space = parentStr.replace(/(\s*\|)[-~]/, '$1');
      space = space.replace('`', ' ');

      if (/\w/ig.test(iParentStr)) {
        space += '  ';
      }

      list.sort((a, b) => {
        const makeIndex = function(str) {
          if (/^\./.test(str)) {
            return 1;
          } else if (~str.indexOf('.')) {
            return 2;
          } else {
            return 3;
          }
        };
        const aIdx = makeIndex(a);
        const bIdx = makeIndex(b);

        if (aIdx == bIdx) {
          return a.localeCompare(b);
        } else {
          return bIdx - aIdx;
        }
      });

      list.forEach((filename, i) => {
        if (o.dirFilter && filename.match(o.dirFilter)) {
          return;
        }
        const isDir = isDirectory(util.joinFormat(iPath, filename));
        const noDeep = ~o.dirNoDeep.indexOf(filename);
        let l1;
        let l2;
        let rStr = '';

        if (i == list.length - 1) {
          l1 = '`';
        } else {
          l1 = '|';
        }

        if (isDir) {
          if (noDeep) {
            l2 = '+';
          } else {
            l2 = '~';
          }
        } else {
          l2 = '-';
        }
        l1 = chalk.gray(l1);
        l2 = chalk.gray(l2);
        rStr = `${space + l1 + l2  } ${  filename}`;

        r.push(rStr);

        if (isDir && !noDeep) {
          deep(util.joinFormat(iPath, filename), rStr);
        }
      });
    };
    const r = [];
    let i = 0;
    let len;
    let space = '';
    let readdirSync;
    let isDirectory;

    if (o.dirList.length) { // 虚拟的
      // 处理下数据
      for (i = 0, len = o.dirList.length; i < len; i++) {
        o.dirList[i] = util.joinFormat(o.dirList[i].replace(/[/\\]$|^[/\\]/, ''));
      }
      if (o.path) {
        o.path = util.joinFormat(o.path);
      }

      readdirSync = function(iPath) {
        let r = [];
        if (o.path === '' && o.path == iPath) {
          o.dirList.forEach((oPath) => {
            const filename = oPath.split('/').shift();
            if (filename) {
              r.push(filename);
            }
          });
        } else {
          o.dirList.forEach((oPath) => {
            let filename;
            if (oPath != iPath && oPath.substr(0, iPath.length) == iPath) {
              filename = oPath.substr(iPath.length + 1).split('/').shift();
              if (filename) {
                r.push(filename);
              }
            }
          });
        }


        // 排重
        if (r.length > 1) {
          r = Array.from(new Set(r));
        }

        return r;
      };
      isDirectory = function(iPath) {
        let r = false;
        for (let i = 0, len = o.dirList.length; i < len; i++) {
          if (o.dirList[i].substr(0, iPath.length) == iPath &&
                            o.dirList[i].length > iPath.length) {
            r = true;
            break;
          }
        }
        return r;
      };
    } else { // 真实的
      readdirSync = function(iPath) {
        let list = [];

        if (!fs.existsSync(iPath) || !fs.statSync(iPath).isDirectory()) {
          return list;
        }

        try {
          list = fs.readdirSync(iPath);
        } catch (er) {}

        return list;
      };

      isDirectory = function(iPath) {
        if (!fs.existsSync(iPath)) {
          return false;
        }
        return fs.statSync(iPath).isDirectory();
      };
    }


    for (i = 0; i < o.frontSpace; i++) {
      space += ' ';
    }


    if (o.frontPath) {
      const list = o.frontPath.split(/[\\/]/);
      list.forEach((str, i) => {
        let l1;
        let l2;
        if (i === 0) {
          l1 = '';
          l2 = '';
        } else {
          l1 = '`';
          l2 = '~ ';
        }

        if (l1) {
          l1 = chalk.gray(l1);
        }
        if (l2) {
          l2 = chalk.gray(l2);
        }

        r.push(space + l1 + l2 + str);
        if (i > 0) {
          space += '   ';
        }
      });
    } else if (o.path) {
      const iName = o.path.split(/[\\/]/).pop();
      r.push(space + iName);
    }

    deep(o.path, r.length && o.frontPath ? r[r.length - 1] : space);

    // 加点空格
    r.unshift('');
    r.push('');
    console.log(r.join('\n'));
  },

  /**
   * 文件名搜索
   */
  findPathSync: function(iPath, root, filter, ignoreHide) {
    const iRoot = root || path.parse(__dirname).root;
    const r = [];

    (function deep(fPath) {
      if (!fs.existsSync(fPath)) {
        return;
      }

      let list;

      try {
        list = fs.readdirSync(fPath);
      } catch (er) {
        return;
      }

      list.forEach((str) => {
        if (ignoreHide) {
          if (/^\./.test(str)) {
            return;
          }
        }
        const wPath = util.joinFormat(fPath, str);
        util.msg.replace(chalk.yellow(`[info] searching:${  wPath}`));
        if (~wPath.indexOf(iPath)) {
          util.msg.newline().success('find path:', wPath);
          r.push(wPath);
        } else {
          if ((filter && !wPath.match(filter)) || !filter) {
            if (fs.existsSync(wPath) && fs.statSync(wPath).isDirectory()) {
              deep(wPath);
            }
          }
        }
      });
    })(iRoot);

    return r;
  },

  /**
   * 获取 js 内容
   */
  requireJs: function(iPath) {
    let rPath;
    let cacheName;
    if (path.isAbsolute(iPath)) {
      rPath = path.relative(__dirname, iPath);
      cacheName = iPath;
    } else {
      if (/^([/\\]|[^:/\\]+[/\\.])/.test(iPath)) {
        rPath = util.joinFormat('./', iPath);
        cacheName = path.join(__dirname, rPath);
      } else {
        rPath = iPath;
        cacheName = rPath;
      }
    }
    delete require.cache[cacheName];

    try {
      return require(rPath);
    } catch (er) {
      return;
    }
  },
  /**
   * 创建文件夹(路径上所有的 文件夹 都会创建)
   */
  mkdirSync: function(toFile) {
    (function deep(iPath) {
      if (fs.existsSync(iPath) || /[/\\]$/.test(iPath)) {
        return;
      } else {
        deep(path.dirname(iPath));
        fs.mkdirSync(iPath);
      }
    })(toFile);
  },
  /**
   * 创建 YYYYMMDDmmss 格式时间搓
   */
  makeCssJsDate: function() {
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
  /**
   * 打开文件所在位置
   */
  openPath: function(iPath) {
    if (IS_WINDOWS) {
      // util.runCMD('explorer /select, '+ iPath.replace(/\//g,'\\'), undefined, __dirname, false);
      util.runCMD(`start ${  iPath.replace(/\//g, '\\')}`, undefined, __dirname, false );
    } else {
      util.runCMD(`open ${  iPath}`);
    }
  },

  /**
   * 路径转换
   * 参数同 path.join
   */
  joinFormat: function() {
    let iArgv = Array.prototype.slice.call(arguments);
    iArgv = iArgv.map((url) => {
      return fn.formatUrl(url);
    });
    let r = path.join.apply(path, iArgv);

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
  /**
   * 运行 cmd
   * @param  {String|Array} str             cmd执行语句 or 数组
   * @param  {funciton}     callback(error) 回调函数
   *                        - error         错误信息
   * @return {Void}
   */
  runCMD: function(str, callback, path, showOutput) {
    const myCmd = require('child_process').exec;
    if (showOutput === undefined) {
      showOutput = true;
    }
    if (!str) {
      return callback('没任何 cmd 操作');
    }
    if (!/Array/.test(Object.prototype.toString.call(str))) {
      str = [str];
    }

    const child = myCmd(str.join(' && '), {
      maxBuffer: 2000 * 1024,
      cwd: path || ''
    }, (err) => {
      if (err) {
        if (showOutput) {
          console.log('cmd运行 出错');
          console.log(err.stack);
        }
        return callback && callback('cmd运行 出错');
      } else {
        return callback && callback();
      }
    });
    child.stdout.setEncoding('utf8');

    if (showOutput) {
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }
  },
  /**
   * 运行 单行 cmd
   * @param  {String}       str             cmd执行语句 or 数组
   * @param  {funciton}     callback(error) 回调函数
   *                        - error         错误信息
   * @return {Void}
   */
  runSpawn: function(ctx, done, iPath, showOutput) {
    const iSpawn = require('child_process').spawn;
    let ops = '';
    let hand = '';
    const cwd = iPath || process.cwd();
    const PROJECT_PATH = process.cwd();

    if (IS_WINDOWS) {
      hand = 'cmd.exe';
      ops = ['/s', '/c', ctx];
    } else {
      hand = '/bin/sh';
      ops = ['-c', ctx];
    }

    const child = iSpawn(hand, ops, {
      cwd: cwd,
      silent: showOutput ? true : false,
      stdio: [0, 1, 2]
    });
    child.on('exit', (err) => {
      process.chdir(PROJECT_PATH);
      return done && done(err);
    });
  },

  /**
   * 运行 通过 npm install 的模块
   * @param  {String}       ctx             想执行的语句
   * @param  {funciton}     done(error)     回调函数
   *                        - error         错误信息
   * @param  {Object}       op              参数
   * @param  {Boolean}      op.silent       是否静默执行, 默认为 非静默
   * @param  {String}       op.cwd          执行目录 
   * @param  {String}       op.nodeBinPath  自定义 bin 路径(非全局时需要设置)
   *
   * @return {Void}
   */
  runNodeModule: function(ctx, done, op) {
    if (typeof done == 'object') {
      op = done;
      done = null;
    }

    const ops = ctx.split(/\s+/);
    const hand = ops.shift();
    const opstr = ops.join(' ');
    let nodeBinPath = op.nodeBinPath;

    if (!nodeBinPath) {
      if (IS_WINDOWS) {
        nodeBinPath = path.join(USERPROFILE, 'AppData/Roaming/npm');
      } else {
        nodeBinPath = '';
      }
    }

    let bin;
    if (IS_WINDOWS) {
      bin = path.join(nodeBinPath, `${hand  }.cmd`);
    } else {
      bin = path.join(nodeBinPath, hand);
    }

    util.runSpawn([bin, opstr].join(' '), done, op.cwd, !op.silent);
  },
  /**
   * 删除文本
   * ------------
   * 单个文本方法
   * -------------
   * @param  {String}   path
   * @param  {function} callback
   * @param  {RegExp}   filters
   *
   * --------------
   * 多个目录/文件方法
   * --------------
   * @param  {Array}    list
   * @param  {function} callback    回调方法
   * @param  {RegExp}   filters     忽略文件用 滤镜，选填参数
   * @param  {Boolean}  includeSelf 是否连当前目录也一同删除
   *
   * @return {Void}
   */
  removeFiles: function(list, callback, filters, includeSelf) {
    if (util.type(list) != 'array') {
      list = [list];
    }

    if (callback === true) { // removeFiles(list, includeSelf)
      includeSelf = true;
      callback = null;
    }

    if (callback && callback.test === new RegExp().test) { // removeFiles(list, filters, includeSelf);
      if (filters) {
        includeSelf = filters;
      }
      filters = callback;
      callback = null;
    }

    const rmFile = function(file, filters) {
      if (!fs.existsSync(file) || (filters && filters.test(file))) {
        return;
      }
      try {
        fs.unlinkSync(file);
      } catch (er) {}
    };
    const rmPath = function(iPath, filters) {
      const list = fs.readdirSync(iPath);

      list.forEach((item) => {
        const file = path.join(iPath, item);
        if (!filters || !filters.test(file)) {
          const stat = fs.statSync(file);
          if (stat.isDirectory()) {
            rmPath(file, filters);
            try {
              fs.rmdirSync(file);
            } catch (er) {}
          } else {
            rmFile(file);
          }
        }
      });
    };

    list.forEach((item) => {
      if (!item || !fs.existsSync(item)) {
        return;
      }

      const stat = fs.statSync(item);
      if (stat.isDirectory()) {
        rmPath(item, filters);
        if (includeSelf) {
          try {
            fs.rmdirSync(item);
          } catch (er) {}
        }
      } else {
        rmFile(item, filters);
      }
    });
    if (callback) {
      callback();
    }
  },
  Promise: function(fn) {
    const she = this;
    she.queue = [];
    she.current = 0;
    she.then = function(fn) {
      if (typeof fn == 'function') {
        she.queue.push(fn);
      }
      return she;
    };
    she.start = function() {
      const myArgv = Array.prototype.slice.call(arguments);
      she.resolve.apply(she, myArgv);
    };

    she.resolve = function() {
      const myArgv = Array.prototype.slice.call(arguments);
      myArgv.push(she.resolve);
      if (she.current) {
        myArgv.push(she.queue[she.current - 1]);
      }

      if (she.current != she.queue.length) {
        she.queue[she.current++].apply(she, myArgv);
      }
    };
    if (fn) {
      she.then(fn);
    }
  },

  readFilesSync: function(iPath, filter) {
    const r = [];
    const deep = function(rPath) {
      if (!fs.existsSync(rPath)) {
        return;
      }

      const list = fs.readdirSync(rPath);

      list.forEach((str) => {
        const mPath = util.joinFormat(rPath, str);
        if (fs.statSync(mPath).isDirectory()) {
          deep(mPath);
        } else {
          if (filter) {
            if (typeof filter == 'function') {
              if (filter(mPath)) {
                r.push(mPath);
              }
            } else {
              if (mPath.match(filter)) {
                r.push(mPath);
              }
            }
          } else {
            r.push(mPath);
          }
        }
      });
    };

    deep(iPath);
    return r;
  },
  /**
   * 拷贝文本
   * ------------
   * 单个文本方法
   * -------------
   * @param  {String}   path
   * @param  {String}   toPath
   * @param  {function} callback
   * @param  {RegExp}   filters
   * @param  {function} render
   * @param  {String}   basePath 用于输出log 的 相对地址
   *
   * --------------
   * 多个目录/文件方法
   * --------------
   * @param  {Object}   list
   * @param  {function} callback 回调方法
   * @param  {RegExp}   filters  忽略文件用 滤镜，选填参数
   * @param  {function} render   文本渲染用方法
   *                             - @param {String}  filename 文件名称
   *                             - @param {String}  content  文件内容
   *                             - @return {String} content  过滤后的文本内容
   * @param  {String}   basePath 用于输出log 的 相对地址
   * @param  {Boolean}  silent   不输出日志
   * @return {Void}
   */
  copyFiles: function(list, callback, filters, render, basePath, silent) {///{
    // 传入参数初始化
    if (typeof arguments[0] == 'string' && typeof arguments[1] == 'string') {
      const flist = {};
      flist[arguments[0]] = arguments[1];
      list = flist;
      callback = arguments[2];
      filters = arguments[3];
      render = arguments[4];
      basePath = arguments[5];
      silent = arguments[6];
    }

    if (!render) {
      render = function(filename, content) {
        return content;
      };
    }

    if (typeof list != 'object') {
      util.msg.error('list 参数格式不正确');
      if (callback) {
        callback('list 参数格式不正确');
      }
      return;
    }
    const
      isIgnore = function(iPath) {
        let rPath;
        if (basePath) {
          rPath = util.joinFormat(path.relative(basePath, iPath));
        } else {
          rPath = util.joinFormat(iPath);
        }

        if (util.type(filters) == 'function') {
          return !filters(rPath);
        } else if (util.type(filters) == 'regexp') {
          return rPath.match(filters);
        } else {
          return false;
        }
      };
    const count = [];
    const fileCopy = function(file, toFile, filters, render, finish) {
      if (!fs.existsSync(file) || isIgnore(file)) {
        return finish();
      }
      const content = fs.readFileSync(file);
      // 如果中途文件夹不存在 则创建
      util.mkdirSync(path.dirname(toFile));

      fs.writeFile(toFile, render(file, content), () => {
        if (basePath && !silent) {
          util.msg.create(util.joinFormat(path.relative(basePath, toFile)));
        }

        count.push(toFile);
        util.timer.mark();
        finish();
      });
    };
    const pathCopy = function(iPath, toPath, done, filters) {
      if (!fs.existsSync(iPath) || isIgnore(iPath)) {
        return done();
      }

      fs.readdir(iPath, (err, list) => {
        let padding = list.length;
        if (!padding) {
          return done();
        }

        list.forEach((item) => {
          if (/^\./.test(item)) {
            if (!--padding) {
              return done();
            }
          }

          const myFile = iPath + item;
          const targetFile = toPath + item;
          const stat = fs.statSync(myFile);

          if (filters && myFile.match(filters)) {
            if (!--padding) {
              return done();
            }
          } else if (stat.isDirectory()) {
            if (!fs.existsSync(targetFile)) {
              util.mkdirSync(path.dirname(targetFile));
              if (basePath && !silent) {
                util.msg.create(util.path.relative( basePath, targetFile));
              }
              count.push(targetFile);
              util.timer.mark();
            }

            pathCopy(`${myFile  }/`, `${targetFile  }/`,  () => {
              if (!--padding) {
                return done();
              }
            }, filters);
          } else {
            fileCopy(myFile, targetFile, filters, render, () => {
              if (!--padding) {
                return done();
              }
            });
          }
        });
      });
    };
    const paddingCheck = function() {
      if (!padding) {
        if (callback) {
          callback(null, count);
        }
      }
    };
    let padding = 0;
    const paddingJian = function() {
      padding--;
      paddingCheck();
    };

    padding++;

    const copyit = function(iPath, toPath) {
      if (!fs.existsSync(iPath)) {
        util.msg.warn('copy file is not exist:', iPath);
      } else {
        const stat = fs.statSync(iPath);
        if (util.type(toPath) != 'array') {
          toPath = [toPath];
        }

        toPath.forEach((item) => {
          if (stat.isDirectory()) {
            padding++;
            pathCopy(`${iPath}/`, `${item}/`, paddingJian, filters);
          } else {
            padding++;
            fileCopy(iPath, item, filters, render, paddingJian);
          }
        });
      }
    };
    for (const iPath in list) {
      if (list.hasOwnProperty(iPath)) {
        copyit(iPath, list[iPath]);
      }
    }
    paddingJian();
  },
  /**
   * 计时器
   */
  timer: {
    now: undefined,
    total: 0,
    // 点出现的间隔（以文件为单位）
    interval: 5,
    source: [],
    onMark: undefined,
    onEnd: undefined,

    // 计时器 开始
    start: function(o) {
      const op = o || {};
      const she = this;
      she.total = 0;
      she.now = new Date();

      if (op.onMark) {
        she.onMark = op.onMark;
      }
      if (op.onEnd) {
        she.onEnd = op.onEnd;
      }
    },

    // 计时器打点记录
    mark: function(ctx) {
      const she = this;
      if (!she.now) {
        return;
      }
      she.total++;

      if (ctx) {
        she.source.push(ctx);
      }

      if (she.onMark) {
        she.onMark(ctx);
      } else {
        if (she.total == 1) {
          util.msg.nowrap(chalk.green('* '));
        }

        if (she.total % she.interval) {
          util.msg.nowrap('.');
        }
      }
    },
    // 计时器结束
    end: function() {
      const she = this;
      const r = {
        time: new Date() - she.now,
        source: she.source.splice(0)
      };
      she.now = undefined;
      she.onMark = undefined;
      if (she.onEnd) {
        she.onEnd(r);
        she.onEnd = undefined;
      } else {
        util.msg.nowrap(chalk.green(` ${  r.time  }ms\n`));
        return r;
      }
    },

    // 当前时间
    getNow: function() {
      return new Date().toString().replace(/^(\w+\s\w+\s\d+\s\d+\s)(\d+:\d+:\d+)(.+)$/, '$2');
    }
  },
  /**
   * 帮助文本输出
   * @param  {Object} op 设置参数
   *                     - usage   [string] 句柄名称
   *                     - commands [object] 操作方法列表 {key: val} 形式
   *                     - options  [object] 操作方法列表 {key: val} 形式
   * @return {Void}
   */
  help: function(op) {
    if (!op) {
      return;
    }
    const accountMaxKeyLen = function(arr) {
      let maxLen = 0;
      for (const key in arr) {
        if (arr.hasOwnProperty(key) && maxLen < key.length) {
          maxLen = key.length;
        }
      }
      return maxLen;
    };
    const textIndent = function(txt, num) {
      let r = '';
      for (let i = 0, len = num; i < len; i++) {
        r += ' ';
      }
      return r + txt;
    };
    const compose = function(ikey, arr) {
      const r = [];
      const maxkeyLen = accountMaxKeyLen(arr);
      let i;
      let len;
      r.push('');
      r.push(chalk.yellow(textIndent(`${ikey  }:`, baseIndent)));

      for (const key in arr) {
        if (arr.hasOwnProperty(key)) {
          if (util.type(arr[key]) == 'array') {
            r.push(
              chalk.gray(textIndent(key, baseIndent * 2)) +
                                  textIndent(arr[key].shift(), maxkeyLen - key.length + 2)
            );
            for (i = 0, len = arr[key].length; i < len; i++) {
              r.push(textIndent(arr[key][i], maxkeyLen + 2 + baseIndent * 2));
            }
          } else {
            r.push(
              chalk.gray(textIndent(key, baseIndent * 2)) +
                                  textIndent(arr[key], maxkeyLen - key.length + 2)
            );
          }
        }
      }

      r.push('');
      return r;
    };
    const baseIndent = 2;
    let r = [];

    if (op.usage) {
      r.push(
        textIndent(`${chalk.yellow('Usage: ') + (op.usage || '')  } <command>`, baseIndent)
      );
    }

    if (op.commands) {
      r = r.concat(compose('Commands', op.commands));
    }

    if (op.options) {
      r = r.concat(compose('Options', op.options));
    }

    r.push('');
    r.unshift('');
    console.log(r.join('\n'));
  },

  /**
   * 文本输出
   */
  msg: {
    source: {
      type: {
        success: 'cyan',
        error: 'red',
        notice: 'yellow',
        warn: {name: 'warning', color: 'yellow'},
        create: {name: 'created', color: 'magenta'},
        info: '#999999',
        del:{name: 'deleted', color: '#5f52a0'}
      },
      maxSize: 7,
      silent: false
    },
    silent: function(bool) {
      const self = this;
      self.source.silent = bool;
    },
    init: function(op) {
      const self = this;
      util.extend(true, self.source, op);

      const
        makeFn = function(key, color) {
          const fnName = key;
          let iPrint = key;
          let iColor = color;
          let colorCtrl;

          if (typeof color == 'object') {
            iPrint = color.name || key;
            iColor = color.color || 'gray';
          }

          if (/^#/.test(iColor)) {
            colorCtrl = chalk.hex(iColor);
          } else {
            colorCtrl = chalk[iColor] || chalk.gray;
          }

          if (self[fnName]) {
            return;
          }

          if (iPrint.length > self.source.maxSize) {
            self.source.maxSize = iPrint.length;
          }

          self[fnName] = function() {
            const iArgv = util.makeArray(arguments);
            const r = [];

            r.push((function() {
              const blanks = new Array(self.source.maxSize - iPrint.length + 1).join(' ');
              return colorCtrl.bold(iPrint + blanks);
            })());
            iArgv.forEach((str) => {
              r.push(colorCtrl(str));
            });
            this.log.apply(this, r);
          };
        };

      for (const key in self.source.type) {
        if (self.source.type.hasOwnProperty(key)) {
          makeFn(key, self.source.type[key]);
        }
      }
    },
    replace: function() {
      const self = this;
      if (self.source.silent) {
        return;
      }

      const iArgv = util.makeArray(arguments);
      let str = iArgv.join(' ');
      if (str.length > process.stdout.columns) {
        str = `${str.substr(0, 25)}...${  str.substr(str.length - process.stdout.columns - 3)}`;
      }
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(str);
    },

    log: function() {
      const self = this;
      if (self.source.silent) {
        return;
      }

      const iArgv = util.makeArray(arguments);
      const now = new Date().toString().replace(/^.* (\d+:\d+:\d+).*$/, '$1');

      iArgv.unshift(`[${  chalk.gray(now)  }]`);
      console.log.apply(console, iArgv);
    },
    /**
     * 输出分割线
     * @return {Object} msg
     */
    line: function() {
      const self = this;
      if (self.source.silent) {
        return this;
      }
      console.log(`\n${  chalk.gray('----------------------')}`);
      return this;
    },
    newline: function() {
      const self = this;
      if (self.source.silent) {
        return this;
      }
      console.log('');
      return this;
    },
    /**
     * 输出不换行的内容
     * @param  {String}  文本内容
     * @param  {Boolean} 是否换新的一行
     * @return {Void}
     */
    nowrap: function(txt, newLine) {
      const self = this;
      if (self.source.silent) {
        return this;
      }
      if (newLine) {
        process.stdout.write('\n');
      }
      process.stdout.write(txt);
      return this;
    }
  },
  makeArray: function(obj) {
    return Array.prototype.slice.call(obj);
  },
  /**
   * 判断对象类别
   * @param {Anything} 对象
   * @return {string}  类型
   */
  type: function (obj) {
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

  isPlainObject: function (obj) {
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

    for (key in obj) {
      obj[key] = obj[key];
    }
    return key === undefined || hasOwn.call(obj, key);
  },

  /**
   * 扩展方法(来自 jQuery)
   * extend([deep,] target, obj1 [, objN])
   * @base she.isPlainObject
   */
  extend: function () {
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

  get: function(url) {
    let myfn;
    let myQuery;

    if (typeof arguments[1] == 'function') {
      myfn = arguments[1];
      myQuery = {};
    } else if (typeof arguments[1] == 'object') {
      myQuery = arguments[1];
      myfn = arguments[2];
    }
    const queryData = require('querystring').stringify(myQuery);
    const urlAcc = require('url').parse(url);
    const opt = {
      host: urlAcc.hostname,
      port: urlAcc.port || 80,
      path: urlAcc.pathname +  urlAcc.search,
      method:'GET',
      headers:{
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': queryData.length
      }
    };

    const myReq = http.request(opt, (result) => {
      const chunks = [];
      let size = 0;

      result.on('data', (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });

      result.on('end', () => {
        const myBuffer = Buffer.concat(chunks, size);

        if (myfn) {
          myfn(myBuffer);
        }
      });
    });
    myReq.write('');
    myReq.end();
  },
  pop: function(content) {
    if (!content) {
      return;
    }

    const popConfig = cache.popConfig;
    const now = new Date();
    const handler = function() {
      clearTimeout(popConfig.intervalKey);
      popConfig.intervalKey = 0;

      notifier.notify({
        message: popConfig.queues.join(','),
        wait: false,
        time: 1500
      });
      popConfig.queues = [];
      popConfig.timer = now;
    };

    popConfig.queues.push(content);

    if (now - popConfig.timer >= popConfig.interval) {
      handler();
    } else if (!popConfig.intervalKey) {
      popConfig.intervalKey = setTimeout(() => {
        handler();
      }, popConfig.interval);
    }
  },
  compareVersion: function(v1, v2) {
    if (v1 == '*' && v2) {
      return -1;
    } else if (v1  && v2 == '*') {
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
  // gulp 任务队列执行(适用于 watch)
  taskQueue: {
    clear: function() {
      cache.taskQueue = {};
    },
    add: function(type, fn, delay) {
      const self = this;
      if (typeof type == 'function') {
        delay = fn;
        fn = type;
        type = 'default';
      }

      if (!fn) {
        return;
      }
      type = type || 'default';

      if (!cache.taskQueue[type]) {
        cache.taskQueue[type] = [];
        cache.taskQueue[type].tostart = false;
      }

      cache.taskQueue[type].push(fn);

      const
        finish = function() {
          if (!cache.taskQueue[type].tostart) {
            cache.taskQueue[type].tostart = true;
            self.next(type);
          }
        };

      clearTimeout(cache.taskQueue[type].delayKey);

      if (delay) {
        cache.taskQueue[type].delayKey = setTimeout(finish, delay);
      } else {
        finish();
      }
    },
    next: function(type) {
      const self = this;
      type = type || 'default';

      if (!cache.taskQueue[type]) {
        return;
      }

      if (cache.taskQueue[type].length > 0) {
        const lastFn = cache.taskQueue[type].pop();
        cache.taskQueue[type].length = 0;
        if (typeof lastFn == 'function') {
          lastFn(() => {
            self.next(type);
          });
        }
      } else {
        cache.taskQueue[type].tostart = false;
      }
    }
  },
  /**
   * 直到 (wait)ms 后不再触发事件，则执行 func，确保不会连续多次调用函数，
   * 通常用于resize，scroll 等频繁触发事件
   * [Reference] https://davidwalsh.name/javascript-debounce-function
   * @param  {[Function]} func      [事件回调函数]
   * @param  {[Number]}   wait      [间隔]
   * @param  {[type]}     immediate [description]
   * @return {[Function]}           [延迟触发的函数]
   */
  debounce: function (func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  },


  // md5 文件 转义成 json 格式
  md2JSON: function(iPath) {
    if (!fs.existsSync(iPath)) {
      return;
    }
    const iCnt = fs.readFileSync(iPath).toString();
    const iCntArr = iCnt.split(/[\r\n]+/);

    const treePoint = function(op) {
      let r ;

      if (op && op.parent) {
        r = {
          type: op.type,
          ctx:  op.ctx,
          contents: [],
          parents: [],
          children: [],
          deep: 0
        };

        if (op.parent.parents) {
          r.parents = op.parent.parents.concat(op.parent);
        } else {
          r.parents = [op.parent];
        }

        r.deep = r.parents.length;

        if (op.parent.children) {
          op.parent.children.push(r);
        }
      } else { // 根节点
        r = {
          type: 'root',
          deep: 0,
          children: []
        };
      }
      return r;
    };
    const buildPoint = function(op) {
      if (op && op.parent) {
        const DEEP = {
          other: -1,
          h1: 1,
          h2: 2,
          h3: 3,
          h4: 4,
          h5: 5,
          h6: 6
        };
        const deep = DEEP[op.type] || DEEP.other;
        const iParents = op.parent.parents;
        let iParent;


        if (~deep) { // !other
          if (iParents) {
            if (deep <= op.parent.deep) {
              iParent = iParents[deep - 1];
            } else {
              iParent = op.parent;
              let iDeep = iParent.deep;
              while (++iDeep < deep) {
                iParent = treePoint({
                  parent: iParent,
                  type: Object.keys(DEEP)[iDeep],
                  ctx: ''
                });
              }
            }
          }

          return treePoint(util.extend(op, {
            parent: iParent
          }));
        } else { // other
          const
            item = {
              type: op.type,
              ctx: [op.ctx]
            };
          if (op.type == 'script') {
            item.syntax = op.extend.syntax;
            item.gloup = op.extend.gloup;
          }
          if (op.parent.contents.length) {
            const iCnt = op.parent.contents.slice().pop();
            if (iCnt.type == op.type) { // 合并同类项
              if (iCnt.type == 'script') {
                if (iCnt.gloup == op.extend.gloup) { // 同是 script 并且在同一个组里面
                  iCnt.ctx.push(op.ctx);
                } else {
                  op.parent.contents.push(item);
                }
              } else {
                iCnt.ctx.push(op.ctx);
              }
            } else {
              op.parent.contents.push(item);
            }
          } else {
            op.parent.contents.push(item);
          }
          return op.parent;
        }
      } else {
        return treePoint(op);
      }
    };
    const r = buildPoint();
    let currentPoint = r;

    // 用于 判断 是否处在 script 里面
    let scriptStart = null;
    let scriptGloup = 0;
    const eachFn = function(str, i) { // 逐行读取
      let type;
      let reg;
      let nextStr;
      let r;
      let extendInfo;
      if (!str) {
        return r;
      }
      if (i < iCntArr.length - 1) {
        nextStr = iCntArr[i + 1];
      }
      if (str.match(MD_REG.SCRIPT)) {
        if (!scriptStart) { // script 开始
          scriptStart = {
            syntax: str.replace(MD_REG.SCRIPT, '$1') || '',
            gloup: scriptGloup++
          };
        } else { // script 结束
          scriptStart = null;
        }
        return r;
      } else if (scriptStart) { // script里面的 内容
        reg = MD_REG.OTHER;
        type = 'script';
        extendInfo = util.extend({}, scriptStart);
      } else if (nextStr && nextStr.match(MD_REG.TITLE_1_STYLE)) { // 一级标题
        reg = MD_REG.OTHER;
        type = 'h1';
        r = 2;
      } else if (nextStr && nextStr.match(MD_REG.TITLE_2_STYLE)) { // 2 级标题 
        reg = MD_REG.OTHER;
        type = 'h2';
        r = 2;
      } else if (str.match(MD_REG.TITLE_1_STYLE)) { // 1 级标题格式符 ===
        return r;
      } else if (str.match(MD_REG.TITLE_2_STYLE)) { // 1 级标题格式符 ---
        return r;
      } else if (str.match(MD_REG.TITLE_1)) { // 1 级标题
        reg = MD_REG.TITLE_1;
        type = 'h1';
      } else if (str.match(MD_REG.TITLE_2)) { // 2 级标题
        reg = MD_REG.TITLE_2;
        type = 'h2';
      } else if (str.match(MD_REG.TITLE_3)) { // 3 级标题
        reg = MD_REG.TITLE_3;
        type = 'h3';
      } else if (str.match(MD_REG.TITLE_4)) { // 4 级标题
        reg = MD_REG.TITLE_4;
        type = 'h4';
      } else if (str.match(MD_REG.TITLE_5)) { // 5 级标题
        reg = MD_REG.TITLE_5;
        type = 'h5';
      } else if (str.match(MD_REG.TITLE_6)) { // 6 级标题
        reg = MD_REG.TITLE_6;
        type = 'h6';
      } else if (str.match(MD_REG.LIST)) { // 无序列表
        reg = MD_REG.LIST;
        type = 'list';
      } else if (str.match(MD_REG.NUM_LIST)) { // 有序列表
        reg = MD_REG.NUM_LIST;
        type = 'num-list';
      } else { // 一般内容
        reg = MD_REG.OTHER;
        type = 'text';
      }

      const ctx = str.replace(reg, '$1');
      currentPoint = buildPoint({
        type: type,
        ctx: ctx,
        parent: currentPoint,
        extend: extendInfo
      });

      return r;
    };

    for (let i = 0, res; i < iCntArr.length; ) {
      res = eachFn(iCntArr[i], i);
      if (res && res > 0) {
        i += res;
      } else {
        i++;
      }
    }

    // 将 r 中的 parents, deep, contents 里面的 gloup 字段去掉
    (function deepit(obj) {
      if ('parents' in obj) {
        delete obj.parents;
      }

      if ('deep' in obj) {
        delete obj.deep;
      }
      if (obj.contents && obj.contents.length) {
        obj.contents.map((item) => {
          if ('gloup' in item) {
            delete item.gloup;
          }
          return item;
        });
      }
      if (obj.children && obj.children.length) {
        obj.children.map((item) => {
          return deepit(item);
        });
      }

      return obj;
    })(r);
    return r;
  },
  path: {
    join: function() {
      let iArgv = util.makeArray(arguments);
      iArgv = iArgv.map((url) => {
        return fn.formatUrl(url);
      });
      return util.joinFormat.apply(util, iArgv);
    },
    relative: function() {
      let iArgv = util.makeArray(arguments);
      iArgv = iArgv.map((url) => {
        return fn.formatUrl(url);
      });
      return util.joinFormat(path.relative.apply(path, iArgv));
    },
    resolve: function() {
      let iArgv = util.makeArray(arguments);
      iArgv = iArgv.map((url) => {
        return fn.formatUrl(url);
      });
      return util.joinFormat(path.resolve.apply(path, iArgv));
    },
    formatUrl: function() {
      const iArgv = util.makeArray(arguments);
      const iUrl = util.joinFormat.apply(util.joinFormat, iArgv);
      const REG = {
        FIND_PARENT: /\/[^/]+\.\.\//,
        FIND_CURRENT: /\/\.\//,
        FIRST_CURRENT: /^\.\//
      };
      let r = iUrl;
      if (/^(about:|data:|file:|javascript:)/.test(iUrl)) {
        return r;
      } else {
        while (r.match(REG.FIND_PARENT)) {
          r = r.replace(REG.FIND_PARENT, '/');
        }

        while (r.match(REG.FIND_CURRENT)) {
          r = r.replace(REG.FIND_CURRENT, '/');
        }

        r = r.replace(REG.FIRST_CURRENT, '');
      }

      return r;
    }
  },
  /**
   * 清空终端屏幕
   */
  cleanScreen: function() {
    process.stdout.write('\x1Bc');
  },

  /**
   * 新窗口打开命令
   * @param {String} ctx 命令语句
   */
  openCMD: function(ctx) {
    if (IS_WINDOWS) {
      util.runCMD(`start ${ctx}`);
    } else {
      util.runCMD(`open -a /Applications/Utilities/Terminal.app ${ctx}`);
    }
  },

  /**
   * 检查端口是否可用
   * @param {Number}   port         需要检查的端口
   * @param {Function} done(canUse) 回调函数
   * @param {Boolean}  canUse       是否可用
   */
  checkPortUseage: function(port, done) {
    const server = net.createServer().listen(port);
    server.on('listening', () => { // 执行这块代码说明端口未被占用
      server.close(); // 关闭服务
      done(true);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') { // 端口已经被使用
        done(false);
      }
    });
  },

  getTime: function(d) {
    let r;
    if (d) {
      r = new Date(d);
    } else {
      r = new Date();
    }
    return `${r}`.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1');
  },

  infoBar: {
    __options: {
      hightlight: {
        'type:number': 'gray'
      },
      foot: {
        color: 'gray',
        size: 8
      },
      head: {
        size: 4,
        key: {
          'done': {
            name: 'DONE',
            color: 'black',
            bgColor: 'green'
          },
          'error': {
            name: 'ERR',
            color: 'white',
            bgColor: 'red'
          }
        }
      }
    },
    __fn: {
      hightlighter: function(str) {
        // const r = str;
        // const she = this;
        // const hl = she.__source.hightlight;

        // const TYPE_REG = /^type:(\w+)$/;
        return str;
      }
    },
    __source: {
      prevType: null
    },

    /**
     * 初始化 infoBar
     * @param {Object} op                             配置
     * @param {Object} op.foot                        状态栏页脚配置项
     * @param {String} op.foot.color                  页脚颜色
     * @param {Number} op.foot.size                   页脚尺寸
     * @param {String} op.head                        状态栏页头配置
     * @param {Number} op.head.size                   页头尺寸
     * @param {Object} op.head.key                    页头详细配置
     * @param {Object} op.head.key                    页头详细配置
     * @param {Object} op.head.key[name]              name 参数详细配置项
     *                 - name [String]                键值名称,定义后可
     *                                                直接通过 `util.infoBar[name]()` 进行调用
     *
     * @param {String} op.head.key[name].name         name 打印出来的名称
     * @param {String} op.head.key[name].color        name 字体颜色
     * @param {String} op.head.key[name].bgColor      name 背景颜色
     */
    init: function(op) {
      const self = this;
      const options = self.__options = util.extend(true, self.__options, op);

      Object.keys(options.head.key).forEach((key) => {
        if (/^end|print|init$/.test(key)) { // 方法保留字
          return;
        }
        if (options.head.key[key].name.length > options.head.size) {
          options.head.size = options.head.key[key].name.length;
        }
        self[key] = function() {
          return self.print.apply(self, [key].concat(util.makeArray(arguments)));
        };
      });
    },
    /**
     * @param {String} type        类型，默认有 done, info
     * @param {String} op.barLeft  状态栏左侧 文案设置
     * @param {String} op.barRight 状态栏右侧 文案设置
     * @param {String} op.foot     状态栏页脚 文案设置，不设自动隐藏
     */
    print: function(type, ctx, ctx2) {
      const she = this;
      const options = she.__options;
      const headInfo = options.head.key[type];
      let op = {
        barLeft: '',
        barRight: '',
        foot: ''
      };
      if (!(type in options.head.key)) {
        throw new Error(`type ${type} is not init`);
      }

      if (typeof ctx != 'object') {
        op.barLeft = ctx;
        if (ctx2) {
          op.foot = ctx2;
        }
      } else {
        op = util.extend(op, ctx);
      }

      op.barLeft = `${op.barLeft}`;
      op.barRight = `${op.barRight}`;
      op.foot = `${op.foot}`;

      let padding = process.stdout.columns;

      // build headbar
      const buildHeader = (info) => {
        padding = padding - options.head.size - 2;

        let co = chalk[info.color] || chalk.write;
        if (co[info.bgColor]) {
          co = co[info.bgColor];
        }
        return co(` ${info.name + fn.makeSpace(options.head.size - info.name.length)} `);
      };
      const buildFooter = (info) => {
        padding = padding - options.foot.size - 2;

        if (info.ctx.length > options.foot.size) {
          info.ctx = `${info.ctx.substr(0, options.foot.size - 3)}...`;
        }

        let co = chalk[info.color] || chalk.write;
        if (co[info.bgColor]) {
          co = co[info.bgColor];
        }
        return co(` ${fn.makeSpace(options.foot.size - info.ctx.length) + info.ctx}`);
      };
      const buildBar = (info) => {
        const runHl = she.__fn.hightlighter;
        const leftLen = info.barLeft.length;
        const rightLen = info.barRight.length;
        if (leftLen + rightLen > padding - 3) {
          const overSize = leftLen + rightLen - padding + 3;
          if (leftLen > overSize) {
            info.barLeft = `${info.barLeft.substr(0, leftLen - overSize - 3)}...`;
          } else if (rightLen > overSize) {
            info.barRight = `...${info.barRight.substr(overSize + 3)}`;
          } else {
            info.barRight = '';
            if (rightLen > padding - 2) {
              info.barLeft = `${info.barLeft.substr(0, padding - 5)}...`;
            }
          }
        }
        const spaceLen = padding - info.barLeft.length - info.barRight.length - 2;
        return ` ${runHl(info.barLeft)}${fn.makeSpace(spaceLen)}${runHl(info.barRight)} `;
      };


      const headStr = buildHeader(headInfo);
      let footStr = '';
      if (op.foot) {
        footStr = buildFooter(util.extend({}, options.foot, {ctx: op.foot}));
      }
      const barStr = buildBar(op);
      if (she.__source.preType == type) {
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
      }
      she.__source.preType = type;

      process.stdout.write(`${headStr}${barStr}${footStr}`);
      return she;
    },
    /**
     * 目前协定当一个状态栏已经停止不需要更新时，需要调用此方法进行结束
     * 也可以这样调用:
     * util.infoBar.done('123').end();
     */
    end: function() {
      process.stdout.write('\r\n');
      return this;
    }
  }
};

// 那些年拼措的单词
util.envPrase = util.envParse;

// 初始化 输出样式
util.msg.init();

// 初始化 状态条
util.infoBar.init();

module.exports = util;




