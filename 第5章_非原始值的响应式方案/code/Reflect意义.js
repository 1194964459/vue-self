import { effect, track, trigger } from './__common.js'

const obj = {
    foo: 1,
    get bar() {  // 访问器属性
        return this.foo   // 这里的this指向谁？
    }
}

const p = new Proxy(obj, {
    // 拦截读取操作
    get(target, key, receiver) {
        // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
        track(target, key)
        // 返回属性值
        // return target[key]   //TODO:
        return Reflect.get(target, key, receiver)
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶里取出并执行
        trigger(target, key)
        return true
    }
})

// -----  开始调用 -----------
effect(
    () => {
        // console.log(p.bar)
        // console.log(obj.bar)
        console.log(obj.foo)
    }
)

// TODO:执行更新，副作用会执行吗？
p.foo++
