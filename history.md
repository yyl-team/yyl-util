# 版本信息
## 1.12.0(2018-02-20)
* [ADD] `util.runCMD(cmd, done, path, showLog, newWindow)` `newWindow` 参数

## 1.11.1(2018-01-31)
* [FIX] 修复 `util.requireJs(iPath)` 当 路径 被格式化后， 获取回来的还是有缓存 的问题

## 1.11.0(2018-01-29)
* [ADD] 新增 `util.getStrSize(str)` 方法
* [ADD] 新增 `util.substr(str, begin, len)` 方法
* [EDIT] `util.infoBar.print` 支持带颜色的文本

## 1.10.8(2018-01-28)
* [EDIT] `util.infoBar.print` `op.barLeft` 支持多行输出

## 1.10.7(2018-01-28)
* [FIX] 修复 `util.infoBar.print` 在没有 `op.foot` 时显示问题

## 1.10.6(2018-01-27)
* [ADD] 新增 `util.copyFiles(list, done)` done 回调函数新增 `files` 变量
* [ADD] 新增 `util.removeFiles(list, done)` done 回调函数新增 `files` 变量

## 1.10.5(2018-01-22)
* [ADD] 新增 `util.infoBar` 系列状态条方法
* [ADD] 新增 `util.getTime()` 方法
* [EDIT] `util.requireJs(iPath)` 方法增加去掉缓存功能
* [TODO] `util.openCMD()` 在mac 上 有问题

## 1.10.4(2018-01-22)
* [ADD] 新增 `util.checkPortUseage(port, done)` 方法

## 1.10.3(2018-01-22)
* [ADD] 新增 `util.openCMD(ctx)` 方法

## 1.10.2(2018-01-18)
* [EDIT] 修改  `util.runSpawn()` 实现方式

## 1.10.1(2018-01-16)
* [ADD] 新增 `util.cleanScreen()` 方法

## 1.10.0(2018-01-15)
* [ADD] 新增 `util.runNodeModule()` 方法

## 1.9.4(2017-12-26)
* [ADD] 新增 `util.path.formatUrl()` 方法

## 1.9.3(2017-12-22)
* [ADD] 新增 `util.path.join()` 方法
* [ADD] 新增 `util.path.relative()` 方法
* [ADD] 新增 `util.path.resolve()` 方法

## 1.9.2(2017-12-21)
* [EDIT] `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 中的 `filter` 支持 函数形式
* [EDIT] `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 中的 `filter` 如配置有 `basePath` 参数， 则过滤的 路径 为 相对于 `basePath` 的路径
* [ADD] `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 新增 `silent` 属性
* [FIX] `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 拷贝文件有时候会出现先回调后进行拷贝文件的问题
* [ADD] 新增 `util.msg.silent(bool)` 方法

## 1.8.0(2017-12-05)
* [ADD] 新增 `util.md2JSON(iPath)` 方法

## 1.7.0(2017-11-23)
* [ADD] 引入 `mocha` 单元测试

## 1.6.4(2017-11-10)
* [ADD] 新增 `util.readFilesSync(path, filter)` 中 filter 的 类型

## 1.6.0(2017-11-09)
* [ADD] 新增 `util.msg.init(type)` 方法

## 1.5.0(2017-10-24)
* [ADD] 新增 `util.debounce`, `util.throttle` 方法

## 1.4.3(2017-09-14)
* [FIX] util.envStringify bugfix

## 1.4.2(2017-08-10)
* [FIX] util.envPrase => util.envParse

## 1.4.1(2017-08-10)
* [EDIT] 补完 readme api 文档

## 1.4.0(2017-07-13)
* [EDIT] util.taskQueue.add 新增 delay 参数

## 1.3.7(2017-06-22)
* [EDIT] util.runCMD 将 本质执行 exec 设置 maxBuffer为一个极大值

## 1.3.6(2017-06-22)
* [EDIT] util.openBrowser() 支持不带协议的 url 打开

## 1.3.5(2017-06-22)
* [FIX] 修复 util.joinFormat //www.yy.com 类似这样没指定协议的路径时匹配返回不正确问题

## 1.3.0(2017-06-19)
* [ADD] 新增 util.taskQueue 方法 用于gulp watch 队列执行

## 1.2.0(2017-06-19)
* [ADD] 新增 util.compareVersion 方法 用于对比版本号(package.json 那种)

## 1.1.0(2017-06-19)
* [ADD] 新增 util.pop 方法 用于触发windows 的 冒泡提醒(node-notifier 二次封装)

## 1.0.0(2017-01-10)
* [ADD] 诞生
