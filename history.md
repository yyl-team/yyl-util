# 版本信息
## 2.3.9(2020-02-01)
* fix: 调整 `yyl.forEach` 类型
## 2.3.8(2020-02-26)
* fix: 修复 `util.path.resolve` 在执行 `util.path.resolve('//www.testhost.com', 'a.html')` 时结果不符合预期的bug
* fix: 重新 划分 单元测试

## 2.3.7(2019-10-11)
* fix: 修复 `util.cmdProcess` cmds 在 node xx.js 情况下参数获取不正确问题

## 2.3.6(2019-09-25)
* feat: 修改 `util.requireJs` 实现方式
* feat: 补充 d.ts 注释

## 2.3.5(2019-07-23)
* fix: 修复 `util.matchVersion(ver1, ver)` 遇到 `github:xxx` version 时 处理不了问题

## 2.3.3(2019-06-01)
* fix: npm publish ignore .git file
## 2.3.2(2019-05-31)
* feat: `util.cmdParse(process.argv, typeMap)` 新增 `typeMap` 用于定义 env 的类型, 如是 boolean 类型 则可省略后面的参数，如 `--remote`
## 2.3.1(2019-05-21)
* fix: 入口写错了

## 2.3.0(2019-05-21)
* fix: 新增 `util.cmdParse(process.argv)` 函数

## 2.2.0(2019-02-26)
* fix: 新增 `util.matchVersion(ver1, ver)` 函数

## 2.1.1(2019-02-21)
* feat: `util.makeAsync()` 能正常 throw error
## 2.1.0(2019-01-16)
* fix: 新增 `util.forEach(arr, fn)` 函数

## 2.0.0(2019-01-12)
* delete: 删除 `util.readdirSync()` 函数
* delete: 删除 `util.openBrowser()` 函数
* delete: 删除 `util.buildTree()` 函数
* delete: 删除 `util.findPathSync()` 函数
* delete: 删除 `util.mkdirSync()` 函数
* delete: 删除 `util.openPath()` 函数
* delete: 删除 `util.joinFormat()` 函数
* delete: 删除 `util.runCMD()` 函数
* delete: 删除 `util.runSpawn()` 函数
* delete: 删除 `util.runNodeModule()` 函数
* delete: 删除 `util.removeFiles()` 函数
* delete: 删除 `util.Promise()` 函数
* delete: 删除 `util.readFilesSync()` 函数
* delete: 删除 `util.copyFiles()` 函数
* delete: 删除 `util.timer` 函数
* delete: 删除 `util.help()` 函数
* delete: 删除 `util.msg` 函数
* delete: 删除 `util.help()` 函数
* delete: 删除 `util.get()` 函数
* delete: 删除 `util.pop()` 函数
* delete: 删除 `util.taskQueue` 函数
* delete: 删除 `util.debounce()` 函数
* delete: 删除 `util.md2JSON()` 函数
* delete: 删除 `util.cleanScreen()` 函数
* delete: 删除 `util.openCMD()` 函数
* delete: 删除 `util.checkPortUseage()` 函数
* delete: 删除 `util.infoBar` 函数
* delete: 删除 `util.getStrSize()` 函数
* delete: 删除 `util.substr()` 函数
* fix: 添加 `util.waitFor()` 函数
* fix: 添加 `util.makeAsync()` 函数
* fix: 添加 `util.shortEnvParse()` 函数
* fix: 添加 `util.shortEnvStringify()` 函数


## 1.15.1(2019-01-08)
* fix: 修复 `util.envParse()` boolean 处理 bug

## 1.15.0(2018-12-21)
* fix: 新增 `util.makeAwait(fn)` 方法

## 1.14.4(2018-08-13)
* feat: linux 下 `util.openBrowser()` `util.openPath()` 改为不做处理

## 1.14.3(2018-04-18)
* fix:  修复 `util.infoBar.print()` 显示多行时会少了最后一个字的问题

## 1.14.2(2018-03-21)
* fix:  新增 `util.readFilesSync(iPath, filter, ignoreFilter)` `ignoreFilter` 参数

## 1.13.1(2018-03-20)
* fix:  `util.requireJs()` 如果内容报错 会抛出错误

## 1.13.0(2018-03-03)
* fix:  `util.infoBar.print(type, op)` `barLeft:Array` 时 支持换行
## 1.12.4(2018-02-26)
* fix:  修复 组件 获取`process.stdout.columns` 有时候会出现 获取不到问题

## 1.12.3(2018-02-24)
* fix:  修复 `util.runCMD(cmd, done, path, showLog, newWindow)` 在 window 上不回调问题

## 1.12.2(2018-02-22)
* fix:  修复 `util.runCMD(cmd, done, path, showLog, newWindow)` 在 mac 上有几率出现 先执行 `yyl server start` 后打开新 tab 的问题

## 1.12.1(2018-02-20)
* fix:  修复 `util.runCMD(cmd, done, path, showLog, newWindow)` 在 mac 上新窗口打开时 路径不对问题

## 1.12.0(2018-02-20)
* fix: `util.runCMD(cmd, done, path, showLog, newWindow)` `newWindow` 参数

## 1.11.1(2018-01-31)
* fix: 修复 `util.requireJs(iPath)` 当 路径 被格式化后， 获取回来的还是有缓存 的问题

## 1.11.0(2018-01-29)
* fix: 新增 `util.getStrSize(str)` 方法
* fix: 新增 `util.substr(str, begin, len)` 方法
* feat: `util.infoBar.print` 支持带颜色的文本

## 1.10.8(2018-01-28)
* feat: `util.infoBar.print` `op.barLeft` 支持多行输出

## 1.10.7(2018-01-28)
* fix: 修复 `util.infoBar.print` 在没有 `op.foot` 时显示问题

## 1.10.6(2018-01-27)
* fix: 新增 `util.copyFiles(list, done)` done 回调函数新增 `files` 变量
* fix: 新增 `util.removeFiles(list, done)` done 回调函数新增 `files` 变量

## 1.10.5(2018-01-22)
* fix: 新增 `util.infoBar` 系列状态条方法
* fix: 新增 `util.getTime()` 方法
* feat: `util.requireJs(iPath)` 方法增加去掉缓存功能
* [TODO] `util.openCMD()` 在mac 上 有问题

## 1.10.4(2018-01-22)
* fix: 新增 `util.checkPortUseage(port, done)` 方法

## 1.10.3(2018-01-22)
* fix: 新增 `util.openCMD(ctx)` 方法

## 1.10.2(2018-01-18)
* feat: 修改  `util.runSpawn()` 实现方式

## 1.10.1(2018-01-16)
* fix: 新增 `util.cleanScreen()` 方法

## 1.10.0(2018-01-15)
* fix: 新增 `util.runNodeModule()` 方法

## 1.9.4(2017-12-26)
* fix: 新增 `util.path.formatUrl()` 方法

## 1.9.3(2017-12-22)
* fix: 新增 `util.path.join()` 方法
* fix: 新增 `util.path.relative()` 方法
* fix: 新增 `util.path.resolve()` 方法

## 1.9.2(2017-12-21)
* feat: `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 中的 `filter` 支持 函数形式
* feat: `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 中的 `filter` 如配置有 `basePath` 参数， 则过滤的 路径 为 相对于 `basePath` 的路径
* fix: `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 新增 `silent` 属性
* fix: `util.copyFiles(file, toFile, callback, filter, render, basePath, silent)` 拷贝文件有时候会出现先回调后进行拷贝文件的问题
* fix: 新增 `util.msg.silent(bool)` 方法

## 1.8.0(2017-12-05)
* fix: 新增 `util.md2JSON(iPath)` 方法

## 1.7.0(2017-11-23)
* fix: 引入 `mocha` 单元测试

## 1.6.4(2017-11-10)
* fix: 新增 `util.readFilesSync(path, filter)` 中 filter 的 类型

## 1.6.0(2017-11-09)
* fix: 新增 `util.msg.init(type)` 方法

## 1.5.0(2017-10-24)
* fix: 新增 `util.debounce`, `util.throttle` 方法

## 1.4.3(2017-09-14)
* fix: util.envStringify bugfix

## 1.4.2(2017-08-10)
* fix: util.envPrase => util.envParse

## 1.4.1(2017-08-10)
* feat: 补完 readme api 文档

## 1.4.0(2017-07-13)
* feat: util.taskQueue.add 新增 delay 参数

## 1.3.7(2017-06-22)
* feat: util.runCMD 将 本质执行 exec 设置 maxBuffer为一个极大值

## 1.3.6(2017-06-22)
* feat: util.openBrowser() 支持不带协议的 url 打开

## 1.3.5(2017-06-22)
* fix: 修复 util.joinFormat //www.testhost.com 类似这样没指定协议的路径时匹配返回不正确问题

## 1.3.0(2017-06-19)
* fix: 新增 util.taskQueue 方法 用于gulp watch 队列执行

## 1.2.0(2017-06-19)
* fix: 新增 util.compareVersion 方法 用于对比版本号(package.json 那种)

## 1.1.0(2017-06-19)
* fix: 新增 util.pop 方法 用于触发windows 的 冒泡提醒(node-notifier 二次封装)

## 1.0.0(2017-01-10)
* fix: 诞生
