/*eslint indent: [ "warn", 4 , {"SwitchCase": 1}]*/
'use strict';
var
    chalk = require('chalk'),
    notifier = require('node-notifier'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

var
    cache = {
        popConfig: {
            interval: 5000,
            intervalKey: 0,
            timer: 0,
            queues: []
        },
        // taskQueue 用储存字段
        taskQueue: {}
    },
    IS_WINDOWS = process.platform == 'win32',
    USERPROFILE = process.env[IS_WINDOWS? 'USERPROFILE': 'HOME'],
    MD_REG = { // markdown 文件解析用 RegExp
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

var
    util = {
        readdirSync: function(iPath, filter) {
            var
                files = fs.readdirSync(iPath),
                r = [];

            if (filter) {
                files.forEach(function(str) {
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
            var r = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && (obj[key] || obj[key] === 0)) {
                    r.push('--' + key);
                    r.push(obj[key]);
                }
            }
            return r.join(' ');
        },

        envParse: function(argv) {
            var iArgv;
            if (typeof argv == 'string') {
                iArgv = argv.split(/\s+/);
            } else {
                iArgv = util.makeArray(argv);
            }

            var r = {};
            var reg = /^--(\w+)/;

            for (var i = 0, key, nextKey, len = iArgv.length; i < len; i++) {
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
                address = 'http:' + address;
            }
            if (IS_WINDOWS) {
                util.runCMD('start ' + address);
            } else {
                util.runCMD('open ' + address);
            }
        },

        /**
         * 目录输出
         */
        buildTree: function(op) {
            var
                options = {
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
                },
                o = util.extend(options, op),
                deep = function(iPath, parentStr) {
                    var
                        list = readdirSync(iPath),
                        space = '',
                        iParentStr;


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

                    list.sort(function(a, b) {
                        var
                            makeIndex = function(str) {
                                if (/^\./.test(str)) {
                                    return 1;
                                } else if (~str.indexOf('.')) {
                                    return 2;
                                } else {
                                    return 3;
                                }
                            },
                            aIdx = makeIndex(a),
                            bIdx = makeIndex(b);

                        if (aIdx == bIdx) {
                            return a.localeCompare(b);
                        } else {
                            return bIdx - aIdx;
                        }
                    });

                    list.forEach(function(filename, i) {
                        if (o.dirFilter && filename.match(o.dirFilter)) {
                            return;
                        }
                        var
                            isDir = isDirectory(util.joinFormat(iPath, filename)),
                            noDeep = ~o.dirNoDeep.indexOf(filename),
                            l1, l2,
                            rStr = '';

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
                        rStr = space + l1 + l2 + ' ' + filename;

                        r.push(rStr);

                        if (isDir && !noDeep) {
                            deep(util.joinFormat(iPath, filename), rStr);
                        }
                    });
                },
                r = [],
                i = 0,
                len,
                space = '',
                readdirSync,
                isDirectory;

            if (o.dirList.length) { // 虚拟的
                // 处理下数据
                for (i = 0, len = o.dirList.length; i < len; i++) {
                    o.dirList[i] = util.joinFormat(o.dirList[i].replace(/[/\\]$|^[/\\]/, ''));
                }
                if (o.path) {
                    o.path = util.joinFormat(o.path);
                }

                readdirSync = function(iPath) {
                    var r = [];
                    if (o.path === '' && o.path == iPath) {
                        o.dirList.forEach(function(oPath) {
                            var filename;
                            filename = oPath.split('/').shift();
                            if (filename) {
                                r.push(filename);
                            }
                        });
                    } else {
                        o.dirList.forEach(function(oPath) {
                            var filename;
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
                    var r = false;
                    for (var i = 0, len = o.dirList.length; i < len; i++) {
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
                    var list = [];

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
                var list = o.frontPath.split(/[\\/]/);
                list.forEach(function(str, i) {
                    var l1, l2;
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
                var iName = o.path.split(/[\\/]/).pop();
                r.push(space + iName);
            }

            deep(o.path, r.length && o.frontPath? r[r.length - 1]: space);

            // 加点空格
            r.unshift('');
            r.push('');
            console.log(r.join('\n'));
        },

        /**
         * 文件名搜索
         */
        findPathSync: function(iPath, root, filter, ignoreHide) {
            var
                iRoot = root || path.parse(__dirname).root,
                r = [];

            (function deep(fPath) {
                if (!fs.existsSync(fPath)) {
                    return;
                }

                var list;

                try {
                    list = fs.readdirSync(fPath);
                } catch (er) {
                    return;
                }

                list.forEach(function(str) {
                    if (ignoreHide) {
                        if (/^\./.test(str)) {
                            return;
                        }
                    }
                    var wPath = util.joinFormat(fPath, str);
                    util.msg.replace(chalk.yellow('[info] searching:' + wPath));
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
            if (fs.existsSync(iPath)) {
                if (path.isAbsolute(iPath)) {
                    try {
                        return require(iPath);
                    } catch (er) {
                        return;
                    }
                } else {
                    if (/^([/\\]|[^:/\\]+[/\\.])/.test(iPath)) {
                        try {
                            return require(util.joinFormat('./', iPath));
                        } catch (er) {
                            return {};
                        }
                    } else {
                        try {
                            return require(iPath);
                        } catch (er) {
                            return;
                        }
                    }
                }
            } else {
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
            var
                now = new Date(),
                addZero = function(num) {
                    return num < 10 ? '0' + num : '' + num; };
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
                util.runCMD('start ' + iPath.replace(/\//g, '\\'), undefined, __dirname, false );
            } else {
                util.runCMD('open ' + iPath);
            }
        },

        /**
         * 路径转换
         * 参数同 path.join
         */
        joinFormat: function() {
            var iArgv = Array.prototype.slice.call(arguments);
            var r = path.join.apply(path, iArgv);

            if (/^\.[\\/]/.test(iArgv[0])) {
                r = './' + r;
            }

            if (!/[/\\]$/.test(iArgv[iArgv.length - 1])) {
                r = r.replace(/[/\\]$/, '');
            }

            return r
                .replace(/\\/g, '/')
                // 修复 mac 下 //web.yystaitc.com 会 被 path.join 变成 /web.yystaitc.com  问题
                .replace(/^(\/+)/g, /^\/\//.test(iArgv[0])? '//': '$1')
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
            var myCmd = require('child_process').exec,
                child;
            if (showOutput === undefined) {
                showOutput = true;
            }
            if (!str) {
                return callback('没任何 cmd 操作');
            }
            if (!/Array/.test(Object.prototype.toString.call(str))) {
                str = [str];
            }

            child = myCmd(str.join(' && '), {
                maxBuffer: 2000 * 1024,
                cwd: path || ''
            }, function(err) {
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
            var iSpawn = require('child_process').spawn;
            var ops;
            var hand;
            var cwd = iPath || process.cwd();
            var PROJECT_PATH = process.cwd();
            var child;

            if (IS_WINDOWS) {
                hand = 'cmd.exe';
                ops = ['/s', '/c', ctx];
            } else {
                hand = '/bin/sh';
                ops = ['-c', ctx];
            }

            child = iSpawn(hand, ops, {
                cwd: cwd,
                silent: showOutput? true: false,
                stdio: [0, 1, 2]
            });
            child.on('exit', function(err) {
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

            var ops = ctx.split(/\s+/);
            var hand = ops.shift();
            var opstr = ops.join(' ');
            var nodeBinPath = op.nodeBinPath;

            if (!nodeBinPath) {
                if (IS_WINDOWS) {
                    nodeBinPath = path.join(USERPROFILE, 'AppData/Roaming/npm');
                } else {
                    nodeBinPath = '';
                }
            }

            var bin;
            if (IS_WINDOWS) {
                bin = path.join(nodeBinPath, hand + '.cmd');
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

            var rmFile = function(file, filters) {
                    if (!fs.existsSync(file) || (filters && filters.test(file))) {
                        return;
                    }
                    try {
                        fs.unlinkSync(file);
                    } catch (er) {}
                },
                rmPath = function(iPath, filters) {
                    var list = fs.readdirSync(iPath);

                    list.forEach(function(item) {
                        var file = path.join(iPath, item);
                        if (!filters || !filters.test(file)) {
                            var stat = fs.statSync(file);
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

            list.forEach(function(item) {
                if (!item || !fs.existsSync(item)) {
                    return;
                }

                var stat = fs.statSync(item);
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
            var she = this;
            she.queue = [];
            she.current = 0;
            she.then = function(fn) {
                if (typeof fn == 'function') {
                    she.queue.push(fn);
                }
                return she;
            };
            she.start = function() {
                var myArgv = Array.prototype.slice.call(arguments);
                she.resolve.apply(she, myArgv);
            };

            she.resolve = function() {
                var myArgv = Array.prototype.slice.call(arguments);
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
            var
                r = [],
                deep = function(rPath) {
                    if (!fs.existsSync(rPath)) {
                        return;
                    }

                    var list = fs.readdirSync(rPath);

                    list.forEach(function(str) {
                        var mPath = util.joinFormat(rPath, str);
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
                var flist = {};
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
            var
                isIgnore = function(iPath) {
                    var rPath;
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
            var count = [];
            var fileCopy = function(file, toFile, filters, render, finish) {
                    if (!fs.existsSync(file) || isIgnore(file)) {
                        return finish();
                    }
                    var content = fs.readFileSync(file);
                    // 如果中途文件夹不存在 则创建
                    util.mkdirSync(path.dirname(toFile));

                    fs.writeFile(toFile, render(file, content), function() {
                        if (basePath && !silent) {
                            util.msg.create(util.joinFormat(path.relative(basePath, toFile)));
                        }

                        count.push(toFile);
                        util.timer.mark();
                        finish();
                    });
                },
                pathCopy = function(iPath, toPath, done, filters) {
                    if (!fs.existsSync(iPath) || isIgnore(iPath)) {
                        return done();
                    }

                    fs.readdir(iPath, function(err, list) {
                        var padding = list.length;
                        if (!padding) {
                            return done();
                        }

                        list.forEach(function(item) {
                            if (/^\./.test(item)) {
                                if (!--padding) {
                                    return done();
                                }
                            }

                            var myFile = iPath + item,
                                targetFile = toPath + item,
                                stat = fs.statSync(myFile);

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

                                pathCopy(myFile + '/', targetFile + '/',  function() {
                                    if (!--padding) {
                                        return done();
                                    }
                                }, filters);
                            } else {
                                fileCopy(myFile, targetFile, filters, render, function() {
                                    if (!--padding) {
                                        return done();
                                    }
                                });
                            }
                        });
                    });
                },
                paddingCheck = function() {
                    if (!padding) {
                        if (callback) {
                            callback(null, count);
                        }
                    }
                },
                padding = 0,
                paddingJian = function() {
                    padding--;
                    paddingCheck();
                };

            padding++;

            var
                copyit = function(ipath, toPath) {
                    if (!fs.existsSync(iPath)) {
                        util.msg.warn('copy file is not exist:', iPath);
                    } else {
                        var stat = fs.statSync(iPath);
                        if (util.type(toPath) != 'array') {
                            toPath = [toPath];
                        }

                        toPath.forEach(function(item) {
                            if (stat.isDirectory()) {
                                padding++;
                                pathCopy(iPath + '/', item + '/', paddingJian, filters);
                            } else {
                                padding++;
                                fileCopy(iPath, item, filters, render, paddingJian);
                            }
                        });
                    }
                };
            for (var iPath in list) {
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
                var op = o || {};
                var she = this;
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
                var she = this;
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
                var
                    she = this,
                    r = {
                        time: new Date() - she.now,
                        source: she.source.splice(0)
                    };
                she.now = undefined;
                she.onMark = undefined;
                if (she.onEnd) {
                    she.onEnd(r);
                    she.onEnd = undefined;
                } else {
                    util.msg.nowrap(chalk.green(' ' + r.time + 'ms\n'));
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
            var
                accountMaxKeyLen = function(arr) {
                    var maxLen = 0;
                    for (var key in arr) {
                        if (arr.hasOwnProperty(key) && maxLen < key.length) {
                            maxLen = key.length;
                        }
                    }
                    return maxLen;
                },
                textIndent = function(txt, num) {
                    var r = '';
                    for (var i = 0, len = num; i < len; i++) {
                        r += ' ';
                    }
                    return r + txt;
                },
                compose = function(ikey, arr) {
                    var r = [],
                        maxkeyLen = accountMaxKeyLen(arr),
                        i, len;
                    r.push('');
                    r.push(chalk.yellow(textIndent(ikey + ':', baseIndent)));

                    for (var key in arr) {
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
                },
                baseIndent = 2,
                r = [];

            if (op.usage) {
                r.push(
                    textIndent(chalk.yellow('Usage: ') + (op.usage || '') +' <command>', baseIndent)
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
                var self = this;
                self.source.silent = bool;
            },
            init: function(op) {
                var self = this;
                util.extend(true, self.source, op);

                var
                    makeFn = function(key, color) {
                        var fnName = key;
                        var iPrint = key;
                        var iColor = color;
                        var colorCtrl;

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
                            var iArgv = util.makeArray(arguments),
                                r = [];

                            r.push((function() {
                                var blanks = new Array(self.source.maxSize - iPrint.length + 1).join(' ');
                                return colorCtrl.bold(iPrint + blanks);
                            })());
                            iArgv.forEach(function(str) {
                                r.push(colorCtrl(str));
                            });
                            this.log.apply(this, r);
                        };
                    };

                for (var key in self.source.type) {
                    if (self.source.type.hasOwnProperty(key)) {
                        makeFn(key, self.source.type[key]);
                    }
                }
            },
            replace: function() {
                var self = this;
                if (self.source.silent) {
                    return;
                }

                var
                    iArgv = util.makeArray(arguments),
                    str = iArgv.join(' ');
                if (str.length > 40) {
                    str = str.substr(0, 25) + '...' + str.substr(str.length - 15);
                }
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(str);
            },

            log: function() {
                var self = this;
                if (self.source.silent) {
                    return;
                }

                var iArgv = util.makeArray(arguments),
                    now = new Date().toString().replace(/^.* (\d+:\d+:\d+).*$/, '$1');

                iArgv.unshift('['+ chalk.gray(now) +']');
                console.log.apply(console, iArgv);
            },
            /**
             * 输出分割线
             * @return {Object} msg
             */
            line: function() {
                var self = this;
                if (self.source.silent) {
                    return this;
                }
                console.log('\n' + chalk.gray('----------------------'));
                return this;
            },
            newline: function() {
                var self = this;
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
                var self = this;
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
            var type,
                toString = Object.prototype.toString;
            if (obj === null) {
                type = String(obj);
            } else {
                type = toString.call(obj).toLowerCase();
                type = type.substring(8, type.length - 1);
            }
            return type;
        },

        isPlainObject: function (obj) {
            var she = this,
                key,
                hasOwn = Object.prototype.hasOwnProperty;

            if (!obj || she.type(obj) !== 'object') {
                return false;
            }

            if (obj.constructor &&
                !hasOwn.call(obj, 'constructor') &&
                !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
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
            var she = this,
                options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

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

            for (; i<length; i++) {
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
            var myfn,
                myQuery;

            if (typeof arguments[1] == 'function') {
                myfn = arguments[1];
                myQuery = {};
            } else if (typeof arguments[1] == 'object') {
                myQuery = arguments[1];
                myfn = arguments[2];
            }
            var queryData = require('querystring').stringify(myQuery),
                urlAcc = require('url').parse(url),
                opt = {
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

            var myReq = http.request(opt, function(result) {
                var chunks = [],
                    size = 0;

                result.on('data', function(chunk) {
                    size += chunk.length;
                    chunks.push(chunk);
                });

                result.on('end', function() {
                    var myBuffer = Buffer.concat(chunks, size);

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

            var
                popConfig = cache.popConfig,
                now = new Date(),
                handler = function() {
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
                popConfig.intervalKey = setTimeout(function() {
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




            var semver = /^[v^~]?(?:0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)?)?$/i;
            var patch = /-([0-9A-Za-z-.]+)/;

            function split(v) {
                var temp = v.replace(/^(v|\^|~)/, '').split('.');
                var arr = temp.splice(0, 2);
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

            var s1 = split(v1);
            var s2 = split(v2);

            for (var i = 0; i < 3; i++) {
                var n1 = parseInt(s1[i] || 0, 10);
                var n2 = parseInt(s2[i] || 0, 10);

                if (n1 > n2) {
                    return 1;
                }
                if (n2 > n1) {
                    return -1;
                }
            }

            if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
                var p1 = patch.exec(s1[2])[1].split('.').map(tryParse);
                var p2 = patch.exec(s2[2])[1].split('.').map(tryParse);

                for (i = 0; i < Math.max(p1.length, p2.length); i++) {
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
                var self = this;
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

                var
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
                var self = this;
                type = type || 'default';

                if (!cache.taskQueue[type]) {
                    return;
                }

                if (cache.taskQueue[type].length > 0) {
                    var lastFn = cache.taskQueue[type].pop();
                    cache.taskQueue[type].length = 0;
                    if (typeof lastFn == 'function') {
                        lastFn(function() {
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
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
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
            var iCnt = fs.readFileSync(iPath).toString();
            var iCntArr = iCnt.split(/[\r\n]+/);

            var
                treePoint = function(op) {
                    var r ;

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
                },
                buildPoint = function(op) {
                    if (op && op.parent) {
                        var DEEP = {
                            other: -1,
                            h1: 1,
                            h2: 2,
                            h3: 3,
                            h4: 4,
                            h5: 5,
                            h6: 6
                        };
                        var deep = DEEP[op.type] || DEEP.other;
                        var iParents = op.parent.parents;
                        var iParent;


                        if (~deep) { // !other
                            if (iParents) {
                                if (deep <= op.parent.deep) {
                                    iParent = iParents[deep - 1];
                                } else {
                                    iParent = op.parent;
                                    var iDeep = iParent.deep;
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
                            var
                                item = {
                                    type: op.type,
                                    ctx: [op.ctx]
                                };
                            if (op.type == 'script') {
                                item.syntax = op.extend.syntax;
                                item.gloup = op.extend.gloup;
                            }
                            if (op.parent.contents.length) {
                                var iCnt = op.parent.contents.slice().pop();
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
                },
                r = buildPoint(),
                currentPoint = r;

            var
                // 用于 判断 是否处在 script 里面
                scriptStart = null,
                scriptGloup = 0,
                eachFn = function(str, i) { // 逐行读取
                    var type, ctx, reg, nextStr, r, extendInfo;
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

                    ctx = str.replace(reg, '$1');
                    currentPoint = buildPoint({
                        type: type,
                        ctx: ctx,
                        parent: currentPoint,
                        extend: extendInfo
                    });

                    return r;
                };

            for ( var i = 0, res; i < iCntArr.length; ) {
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
                    obj.contents.map(function(item) {
                        if ('gloup' in item) {
                            delete item.gloup;
                        }
                        return item;
                    });
                }
                if (obj.children && obj.children.length) {
                    obj.children.map(function(item) {
                        return deepit(item);
                    });
                }

                return obj;
            })(r);
            return r;
        },
        path: {
            join: function() {
                var iArgv = util.makeArray(arguments);
                return util.joinFormat.apply(util, iArgv);
            },
            relative: function() {
                var iArgv = util.makeArray(arguments);
                return util.joinFormat(path.relative.apply(path, iArgv));
            },
            resolve: function() {
                var iArgv = util.makeArray(arguments);
                return util.joinFormat(path.resolve.apply(path, iArgv));
            },
            formatUrl: function() {
                var
                    iArgv = util.makeArray(arguments),
                    iUrl = util.joinFormat.apply(util.joinFormat, iArgv),
                    REG = {
                        FIND_PARENT: /\/[^/]+\.\.\//,
                        FIND_CURRENT: /\/\.\//,
                        FIRST_CURRENT: /^\.\//
                    },
                    r = iUrl;
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

        infoBar: {
            __source: {
                keyword: {
                    'type:number': 'gray'
                },
                foot: {
                    color: 'black',
                    bgColor: 'white'
                },
                head: {
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
            },
            // 初始化 infobar
            init: function(op) {
                var self = this;
                self.__source = util.extend(true, self.__source, op);
                Object.keys(self.__source.head).forEach(function(key) {
                    self[key] = function() {
                        self.print.apply(self, [key].concat(util.makeArray(arguments)));
                    };
                });
            },
            print: function(type, ctx) {
                var self = this;
                var source = self.__source;
                var op;
                if (!(type in source.head)) {
                    throw new Error('type ' + type + ' is not init');
                }

                if (typeof ctx != 'object') {
                    op = {
                        barLeft: ctx + ''
                    };
                } else {
                    op = ctx;
                }
                // TODO
            }
        }
    };

// 那些年拼措的单词
util.envPrase = util.envParse;

// 初始化 输出样式
util.msg.init();

module.exports = util;




