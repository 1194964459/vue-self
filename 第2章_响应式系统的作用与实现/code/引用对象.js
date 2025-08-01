/**
 * 在 JavaScript 中，对象是引用类型。
 * 
 * 当你将对象赋值给变量或作为属性添加到另一个对象时，实际上传递的是对象的引用（内存地址），而不是对象的副本。
 */
let b = { xx: '1' }
let a = { b }
console.log(a)  // { b: { xx: '1' } }
b.xx = '2'
console.log(a)   // { b: { xx: '2' } }