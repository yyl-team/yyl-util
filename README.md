# yyl-util 
a node util for yyl

## API 说明
### util.readdirSync(iPath, filter)
```
/**
 * 读取文件目录
 * @param {String} iPath 目录路径
 * @param {REGEX}  filter 忽略目录的正则表达式
 */
util.readdirSync(iPath, filter);
```

### util.envStringify(obj);
```
/**
 * 将obj 转成 命令行 env 形式 {name: jack} => --name jack
 * @param  {Object} obj 值对象
 * @return {String} str env 操作字符串
 */
util.envStringify(obj);
```

### util.envParse(argv);
```
/**
 * 将 数组转成 对象 [--name, jack] => {name: jack}
 * @param  {Array}  argv 数组
 * @return {Object} obj  值对象
 */
util.envParse(argv);
```

### util.openBrowser(url);
```
/**
 * 调用系统默认浏览器打开连接
 * @param {String} url 目标连接
 */
util.openBrowser(url);
```

### util.buildTree(op);
```
/**
 * 目录树输出
 * @param {String} op.path       当前目录, 默认为当前
 * @param {Array}  op.dirList    虚拟目录列表, 默认值为 []
 * @param {String} op.frontPath  目录前缀, 默认值为空
 * @param {Number} op.frontSpace 目录树前置空格数目 默认值为 2
 * @param {String} op.dirFilter  目录过滤, 默认值为空
 * @param {Array}  op.dirNoDeep  不展开的文件夹列表, 默认值为 []
 */
util.buildTree(op);
```

### util.findPathSync(iPath, root, filter, ignoreHide)
```
/**
 * 文件名搜索
 * @param  {String}  iPath      目标文件名
 * @param  {String}  root       搜索的根目录
 * @param  {Regex}   filter     搜索过滤正则表达式
 * @param  {Boolean} ignoreHide 过滤隐藏文件(.开头的文件)
 * @return {Array} r            搜索到的文件列表
 */
util.findPathSync(iPath, root, filter, ignoreHide);
```

### util.requireJs(iPath);
```
/**
 * 获取 js 内容
 * @param {String} iPath 文件路径
 * @return {JS}    js    返回 文件执行的结果
 */
util.requireJs(iPath);
```

### util.mkdirSync(toFile);
```
/**
 * 创建文件夹(路径上所有的 文件夹 都会创建)
 * @param {String} toFile 文件路径
 */
util.mkdirSync(toFile);
```

### util.makeCssJsDate();
```
/**
 * 创建 YYYYMMDDmmss 格式时间搓
 * @return {String} cssjsdate 时间搓
 */
util.makeCssJsDate();
```

### util.openPath(iPath);
```
/**
 * 通过 cmd/终端 打开 文件所在位置
 * @param {String} iPath 
 */
util.openPath(iPath);
```

### util.joinFormat();
```
/**
 * 路径转换, 会自动 把 \\ 变成 /
 * 参数同 path.join
 */
util.joinFormat();
```

### util.runCMD(str, callback, path, showOutput, newWindow);
```
/**
 * 运行 cmd
 * @param  {String|Array} str             cmd执行语句 or 数组
 * @param  {funciton}     callback(error) 回调函数
 *                        - error         错误信息
 * @param  {Boolean}      showOutput      显示日志
 * @param  {Boolean}      newWindow       新窗口打开
 * @return {Void}
 */
util.runCMD(str, callback, path, showOutput, newWindow);
```

### util.runSpawn(ctx, done, iPath, showOutput);
```
/**
 * 运行 单行 cmd
 * @param  {String}       str             cmd执行语句 or 数组
 * @param  {funciton}     callback(error) 回调函数
 *                        - error         错误信息
 * @return {Void}
 */
util.runSpawn(ctx, done, iPath, showOutput);
```

### util.runNodeModule(ctx, done, op);
```
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
util.runNodeModule(ctx, done, op);
```

### util.removeFiles(list, callback, filters);
```
/**
 * 删除文本
 * ------------
 * 单个文本方法
 * -------------
 * @param  {String}   path
 * @param  {function} callback(err, files)
 * @param  {RegExp}   filters
 *
 * --------------
 * 多个目录/文件方法
 * --------------
 * @param  {Array}    list
 * @param  {function} callback(err, files) 回调方法
 * @param  {RegExp}   filters              忽略文件用 滤镜，选填参数
 *
 * @return {Void}
 */
util.removeFiles(list, callback, filters);
```

### util.Promise(fn)
```
/**
 * util promise 方法
 */
util.Promise(fn)
```

### util.readFilesSync(iPath, filter);
```
/**
 * 获取目录下所有文件路径
 * @param  {String}          iPath                文件目录
 * @param  {Function}        callback(err, files) 复制成功回调函数
 *                           -err   [string]      错误信息
 *                           -files [array]       复制成功的文件列表
 * @param  {Regex|Function}  filter               文件过滤正则
 *                           filter(filePath)     文件过滤函数 返回 true 则加入到返回列表
 * @param  {String}          -filePath            文件目录
 * @param  {Boolean}         reverse              结果取相反
 * @return {Array}           files                文件列表
 */
util.readFilesSync(iPath, filter, reverse);
```

### util.copyFiles(list, callback, filters, render, basePath, silent);
```
/**
 * 拷贝文本
 * ------------
 * 单个文本方法
 * -------------
 * @param  {String}          path
 * @param  {String}          toPath
 * @param  {function}        callback
 * @param  {RegExp|function} filters
 * @param  {function}        render
 * @param  {string}          basePath
 * @param  {Boolean}         silent
 *
 * --------------
 * 多个目录/文件方法
 * --------------
 * @param  {Object}          list
 * @param  {function}        callback(err, files) 回调方法
 * @param  {RegExp|function} filters  忽略文件用 滤镜
 *                           filters(iPath)                过滤函数
 *                           - @param  {String}  iPath     文件路径
 *                           - @return {Boolean} isInclude 是否包含在内， false 则表示 ignore

 * @param  {function}        render(filename, content)    文本渲染用方法
 *                           - @param  {String}  filename 文件名称
 *                           - @param  {String}  content  文件内容
 *                           - @return {String}  content  过滤后的文本内容
 *
 * @param  {string}          basePath 相对路径
 * @param  {Boolean}         silent   是否隐藏 log
 * @return {Void}
 */
util.copyFiles(list, callback, filters, render, basePath, silent);
```

### util.timer
```
/**
 * 计时器相关函数
 * @param {Function} op.onMark 当发生记录时的回调函数
 * @param {Function} op.onEnd  当记录完成时回调函数
 */
util.timer.start(op);
```
```
/**
 * 计时器打点记录
 */
util.timer.mark(ctx);
util.timer.end();
util.timer.getNow();
```

### util.help(op)
```
/**
 * 帮助文本输出
 * @param  {Object} op 设置参数
 *                     - ustage   [string] 句柄名称
 *                     - commands [object] 操作方法列表 {key: val} 形式
 *                     - options  [object] 操作方法列表 {key: val} 形式
 * @return {Void}
 */
util.help(op);
```

### util.msg
```
/**
 * 错误输出
 * @param  {Object}        op.maxSize           最大字符长度，默认会随 type 字符长度而递增
 * @param  {Object}        op.type {key: color} 需要新增的类型
 * @param  {String}        key                  新增的 util.msg[name]
 * @param  {String|Object} color                新增的 log 的颜色 可以是 hex 如 #ffffff, 也可以是命名如 red
 * @param  {String}        color.name           输出展示的名字，默认与 key 一致
 * @param  {String}        color.color          新增的 log 的颜色 可以是 hex 如 #ffffff, 也可以是命名如 red
 * @return {Void}
 */
util.msg.init(op)
```
```
/**
 * 设置是否禁止输出 util.msg
 * @param {Boolean} bool 是否禁止 util.msg 输出
 */
util.msg.silent(bool);
```
```
/**
 * 错误输出
 * @param  {String} txt 文本内容
 * @return {Void}
 */
util.msg.error()
```
```
/**
 * 信息输出
 * @param  {String} txt 文本内容
 * @return {Void}
 */
util.msg.info()
```
```
/**
 * 成功输出
 * @param  {String} txt 文本内容
 * @return {Void}
 */
util.msg.success()
```
```
/**
 * 一般输出
 * @param  {String} txt 文本内容
 * @return {Void}
 */
util.msg.notice()
```
```
/**
 * 警告输出
 * @param  {String} txt 文本内容
 * @return {Void}
 */
util.msg.warn()
```
```
/**
 * 创造输出
 * @param {String} txt 文本内容
 */
util.msg.create()
```
```
/**
 * 输出分割线
 * @return {Object} msg
 */
util.msg.line()
```
```
/**
 * 换行
 */
util.msg.newline()
```
```
/**
 * 输出不换行的内容
 * @param  {String}  文本内容
 * @param  {Boolean} 是否换新的一行
 * @return {Void}
 */
util.msg.nowrap(txt, newLine)
```

### util.makeArray(obj)
```
/**
 * 将 arguments 变为数组
 */
util.makeArray(obj);
```

### util.type(obj)
```
/**
 * 判断对象类别
 * @param {Anything} 对象
 * @return {string}  类型
 */
util.type(obj);
```

### util.extend()
```
/**
 * 扩展方法(来自 jQuery)
 * extend([deep,] target, obj1 [, objN])
 * @base she.isPlainObject
 */
util.extend();
```

### util.get
```
/**
 * 获取远程文件内容
 * @param {String}   url    远程文件路径
 * @param {Object}   op     参数
 * @param {Function} done(str) 获取完成回调函数
 * @param {String}   str       获取回来的文件内容
 */
util.get(url, op, done);
util.get(url, done);
```

### util.pop(str)
```
/**
 * 调出系统及冒泡信息
 * @param {String} str 信息
 */
util.pop(str);
```

### util.compareVersion(v1, v2)
```
/**
 * 版本对比
 * @param  {String} v1     版本1
 * @param  {String} v2     版本2
 * @return {Number} result 结果
 *                         -  1 v1 大
 *                         - -1 v2 大
 *                         -  0 相等
 */
util.compareVersion(v1, v2);
```

### util.taskQueue
```
/**
 * 添加任务队列
 * @param {String}   type     队列唯一识别码, 可不填，默认为 'default'
 * @param {Function} delay    延迟执行
 * @param {Function} fn(next) 需要进入队列执行的方法
 *                   - next [Function] 执行下一队列方法
 *
 * @param {Number} delay      可选参数, 延迟执行， 单位 ms
 */
util.taskQueue.add(type, fn, delay);
```
```
/**
 * 主动触发下一队列任务
 * @param {String}   type     队列唯一识别码, 可不填，默认为 'default'
 */
util.taskQueue.next(type);
```

### util.debounce(func, wait, immediate)
```
/**
 * 直到 (wait)ms 后不再触发事件，则执行 func，确保不会连续多次调用函数，
 * 通常用于resize，scroll 等频繁触发事件
 * [Reference] https://davidwalsh.name/javascript-debounce-function
 * @param  {[Function]} func      [事件回调函数]
 * @param  {[Number]}   wait      [间隔]
 * @param  {[type]}     immediate [description]
 * @return {[Function]}           [延迟触发的函数]
 */
util.debounce(func, wait, immediate);
```

### util.md2JSON(iPath)
```
/**
 * @param {String}  iPath  markdown 文件 路径
 * @return {Object} result json 格式 对象
 */
util.md2JSON(iPath);
```

### util.path
```
/**
 * 同 path.join(), path.relative(), path.resolve() 但多了路径纠正逻辑
 */
util.path.join()
util.path.relative()
util.path.resolve()
```
```
/**
 * 可以将 ./, ../ 这类型相对路径 format 掉的 方法
 * @param  {String} iUrl 需要进行格式化的 url
 * @return {String} r
 */
util.path.formatUrl(iUrl)
```

### util.cleanScreen()
```
// 清空当前控制台
util.cleanScreen();
```

### util.openCMD(ctx)
```
/**
 * 新窗口打开命令
 * @param {String} ctx 命令语句
 */
util.openCMD(ctx);
```

### util.checkPortUseage(port, done)
```
/**
 * 检查端口是否可用
 * @param {Number}   port         需要检查的端口
 * @param {Function} done(canUse) 回调函数
 * @param {Boolean}  canUse       是否可用
 */
util.checkPortUseage(port, done);
```

### util.infoBar
```
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
util.infoBar.init(op)

/**
 * @param {String}       type        类型，默认有 done, info
 * @param {String|Array} op.barLeft  状态栏左侧 文案设置
 * @param {String}       op.barRight 状态栏右侧 文案设置
 * @param {String}       op.foot     状态栏页脚 文案设置，不设自动隐藏
 */
util.infoBar.print(type, op);

/**
 * 目前协定当一个状态栏已经停止不需要更新时，需要调用此方法进行结束
 * 也可以这样调用:
 * util.infoBar.done('123').end();
 */
util.infoBar.end();
```

### util.getStrSize(str)
```
/**
 * 获取带颜色的字符串长度
 * @param  {String} str
 * @return {Number} length
 */
util.getStrSize(str)
```

### util.substr(str, begin, len)
```
/**
 * 截取带颜色文字的长度
 * @param  {String} str   带颜色字符串
 * @param  {Number} begin 开始位置
 * @param  {Number} len   长度
 * @return {String} r     截取后的字符串
 */
util.substr(str, begin, len)
```

## 历史记录
在 [这里](./history.md)

