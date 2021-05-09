# yyl-util

## lerna 常用命令

### 项目初始化

```bash
yarn install
```

### 创建 A 组件, 以 typescript 模式

```bash
lerna create A --typescript
```

### 给 A 组件安装 子 packages B 作为依赖

```bash
lerna add B --scope A
```

### 显示当前项目 包含的 packages

```bash
lerna list
```
