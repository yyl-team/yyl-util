# 版本信息
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