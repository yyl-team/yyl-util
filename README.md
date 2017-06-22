# yyl-util 
a node util for yyl

## API 说明
```
/**
 * 调用系统默认浏览器打开连接
 * @param {String} url 目标连接
 */
util.openBrowser(url);

/**
 * 调出系统及冒泡信息
 * @param {String} str 信息
 */
util.pop(str);

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

/**
 * 添加任务队列
 * @param {String}   type     队列唯一识别码, 可不填，默认为 'default'
 * @param {Function} fn(next) 需要进入队列执行的方法
 *                   - next [Function] 执行下一队列方法
 *
 * @param {Number} delay      可选参数, 延迟执行， 单位 ms
 */
util.taskQueue.add(type, fn);

/**
 * 主动触发下一队列任务
 * @param {String}   type     队列唯一识别码, 可不填，默认为 'default'
 */
util.taskQueue.next(type);
```

## 版本信息
### 1.3.6(2017-06-22)
* [EDIT] util.openBrowser() 支持不带协议的 url 打开

### 1.3.5(2017-06-22)
* [FIX] 修复 util.joinFormat //www.yy.com 类似这样没指定协议的路径时匹配返回不正确问题

### 1.3.0(2017-06-19)
* [ADD] 新增 util.taskQueue 方法 用于gulp watch 队列执行

### 1.2.0(2017-06-19)
* [ADD] 新增 util.compareVersion 方法 用于对比版本号(package.json 那种)

### 1.1.0(2017-06-19)
* [ADD] 新增 util.pop 方法 用于触发windows 的 冒泡提醒(node-notifier 二次封装)

### 1.0.0(2017-01-10)
* [ADD] 诞生
