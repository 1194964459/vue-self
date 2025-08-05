# 挂载与更新（渲染器）

## 一、HTML Attributes 与 DOM Proper
```js
<input id="my-input" type="text" value="foo" />
```
HTML Attributes 指的就是定义在 HTML 标签上的属性，这里指的就是 id="my-input"、type="text" 和value="foo"。

当浏览器解析这段 HTML 代码后，会创建一个与之相符的 DOM 元素对象，我们可以通过JavaScript 代码来读取该 DOM 对象：
```js
const el = document.querySelector('#my-input')
```
这个 DOM 对象会包含很多属性（properties）。

注意：HTML Attributes 的作用是设置与之对应的 DOMProperties 的初始值。
