# Node.js

## 模块化
一个js文件就是一个模块。一个模块内的变量是私有的。

### 导出模块
可以将一个模块内的内容向外暴露给其他模块使用，提高复用性。方法：
- module.exports
  ```js
  module.export = {
    //向外暴露的内容
  }
  ```
- exports
  ```js
  exports.变量 = 内容
  ```

### 加载模块
使用其他模块暴露出的内容：
```js
const 变量 = require('模块名')
```
Node会依次在一下目录搜寻模块：
1. `/usr/local/lib/node/`
2. `/home/user/projects/node_modules/`
3. `/home/user/node_modules/`
4. `/home/node_modules/`
5. `/node_modules/`

::: tip
- `module.exports` 与 `exports` 都是`js`对象，且有一层隐含关系，即：`exports === module.exports`
- 最终暴露的是`moudule.exports`中的内容。
- 当使用`exports = 值`，将改变exports的引用值，exports的暴露作用将失效。要使用`exports.变量 = 值`的方式。
- `require`是根据导入的模块下的`package.json`中的`main`属性所指定的文件。当不存在`package.json`文件或不存在`main`属性时，将自动导入`index.js`或`index.node`。
:::

## npm
`npm`（Node package managmer），是`Node.js`自带的包管理工具。

搜索可用的模块：https://www.npmjs.com/

### 常用命令
#### init  
- 功能：初始化包。并以交互的方式生成一个`package.json`文件
```sh
npm init
```  

#### install  
- 功能：下载并安装包
- 参数：`-S` 生产环境安装；`-D`：开发环境暗转；`-g`：全局安装
```sh
# 简写
npm i

npm install [-S] ${module-name}
npm install -D ${module-name}
npm install -g ${module-name}

# 安装指定版本的包
npm install ${module-name}@module-version
```

#### remove
- 删除包
```sh
npm remove

# 简写
npm r
```

### 配置镜像
- 直接配置
  ```sh
  npm config set registry https://registry.npmmirror.com/
  ```

- 工具配置  
  
  使用`nrm`配置npm的镜像地址`npm registry manager`

  1. 安装nrm
  ```sh
  npm i -g nrm
  ```
  2. 修改镜像
  ```sh
  nrm use taobao
  ```
  3. 检查是否配置成功
  ```sh
  npm config list
  ```

## yarn
### yarn介绍
`yarn`是有Facebook推出一种新的包管理工具，为了解决`npm`的一些问题。  
官网地址：https://yarnpkg.com/

yarn官方宣称的特点：
- 速度更快。缓存已下载的包；利用并行下载；
- 更好的安全信。校验包的完整性。
- 更高的可靠性。使用详细、简介的文件格式和明确的安装算法，能够保证在不同的系统上无差异的工作。

### yarn安装
```sh
npm i -g yarn
```

## nvm
NVM（Node Version Manager）。Node.js版本管理工具，方便切换不同版本的Node.js

GitHub地址：
- windows：https://github.com/coreybutler/nvm-windows
- linux：https://github.com/nvm-sh/nvm

常用命令：
```sh
# 安装
nvm install ${nodejs-version} | latest

# 指定版本
nvm use ${nodejs-version}

# 查询已安装/已发布的版本
nvm list [installed] or [available]

# 卸载
nvm uninstall ${nodejs-version}
```

## 参考文献
1. [尚硅谷-Node.js Bilibili](https://www.bilibili.com/video/BV1gM411W7ex?p=69&vd_source=82c8936823dd2e33632d42e87e1732ba)
2. https://javascript.ruanyifeng.com/nodejs/module.html#toc0