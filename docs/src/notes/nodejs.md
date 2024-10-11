# Node.js

## 模块化
一个js文件就是一个模块。一个模块内的变量是私有的。

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

::: tip
- `module.exports` 与 `exports` 都是`js`对象，且有一层隐含关系，即：`exports` === `module.exports`
- 最终暴露的内容是`moudule.exports`的内容。
- 当使用`exports = 值`，将改变exports的引用值，exports的暴露作用将失效。要使用`exports.变量 = 值`的方式。
:::

使用其他模块暴露出的内容：
```js
const 变量 = require('模块名')
```

## 参考文献
1. [尚硅谷-Node.js Bilibili](https://www.bilibili.com/video/BV1gM411W7ex?p=69&vd_source=82c8936823dd2e33632d42e87e1732ba)