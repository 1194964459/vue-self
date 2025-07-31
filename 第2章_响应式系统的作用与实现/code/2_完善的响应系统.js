/**
 * 在“1_响应式数据基本实现.js”中有几点可以优化的：
 * 1. 副作用函数(effect)是硬编码，一旦名字写错，上述代码就工作不了了 
 *     => 采用“注册副作用函数”机制
 *     => 这样，不管副作用是匿名函数，还是别的，都能正常工作？？？
 * 
 */

// 用一个全局变量存储被注册的副作用函数
let activeEffect

// effect 函数用于注册副作用函数
function effect(fn) {
    // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给 activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}