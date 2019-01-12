# yyl-util 2.0
a node util for yyl

* yyl-util 已根据功能拆分为 `yyl-os`, `yyl-fs`, `yyl-file-replacer`, `yyl-print`

## API 说明
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

### util.requireJs(iPath);
```
/**
 * 获取 js 内容
 * @param {String} iPath 文件路径
 * @return {JS}    js    返回 文件执行的结果
 */
util.requireJs(iPath);
```

### util.makeCssJsDate();
```
/**
 * 创建 YYYYMMDDmmss 格式时间搓
 * @return {String} cssjsdate 时间搓
 */
util.makeCssJsDate();
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

### util.makeAwait(fn)
```
/**
 * 截取带颜色文字的长度
 * @param  {function} fn(next, reject) 让函数变成 await 形式
 * @param  {function} next
 * @param  {function} reject
 * @return {Promise} r
 */
util.makeAwait(fn)
```

### util.waitFor(ms)
```
/**
 * 等待 x ms 后继续执行
 * @param  {number} ms 等待时长
 * @return {Promise}
 */
util.waitFor(ms)
```

### util.shortEnvParse(str)
```
/**
 * 短名字符串解析
 * @param  {String} str 输入字符串
 * @return {Object} 解析后对象
 */
util.shortEnvParse(str)
```

### util.shortEnvStringify(obj)
```
/**
 * 短名字符串解析
 * @param  {Object} obj 输入对象
 * @return {String} 解析后字符串
 */
util.shortEnvStringify(obj)
```

### util.makeAsync(fn)
```
/**
 * 将 fn(done) 类型异步回调函数变成 async 函数
 * @param  {Function} fn async 函数
 * @param  {Boolean} isMocha 是否用于 mocha
 * @return {Function}
 */
util.makeAsync(fn, isMocha);
```


## 历史记录
在 [这里](./history.md)

