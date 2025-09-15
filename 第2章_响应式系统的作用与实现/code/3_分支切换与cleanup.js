// 用一个全局变量存储被注册的副作用函数
let activeEffect

/**
 * effect 函数用于注册副作用函数，同时收集依赖  看哪些属性值依赖当前的副作用函数
 * 副作用函数执行前需要清除之前所有的依赖，执行后再重建最新的依赖...
 * 
 * 关键点：effectFn.deps，cleanup()
 * @param {*} fn 
 */
function effect(fn) {
    // TODO:新增1
    const effectFn = () => {
        // 调用 cleanup 函数完成清除工作
        cleanup(effectFn)
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = []
    effectFn()
}

/**
 * 每次副作用函数执行时，根据 effectFn.deps 获取所有相关联的依赖集合，进而将副作用函数从依赖集合中移除
 * @param {*} effectFn 
 */
function cleanup(effectFn) {
    console.log('清理前的：', effectFn.deps)
    // 遍历 effectFn.deps 数组
    for (let i = 0; i < effectFn.deps.length; i++) {
        // deps 是依赖集合  TODO:这里的deps是Bucket中每个key对应的set；改变这里相当于修改了Bucket中每个属性值对应的set
        const deps = effectFn.deps[i]
        // 将 effectFn 从依赖集合中移除
        deps.delete(effectFn)
    }
    // 最后需要重置 effectFn.deps 数组  TODO:这里是必要的，上述代码运行后是：[Set(0),Set(0)]，
    // 尽管Set的长度为空，但是数组长度并没修改；反观 Bucket 是没这个操作的，不过这样更好，正好省的新建Set
    effectFn.deps.length = 0
    console.log('清理后的：', effectFn.deps)
}

// const data = { text: 'hello world' }
const data = { ok: true, text: 'hello world' }

// 存储副作用函数的桶
const bucket = new WeakMap()

// TODO:痛点2：
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
        track(target, key)
        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶里取出并执行
        trigger(target, key)
    }
})


/**
 * 在 get 拦截函数内调用 track 函数追踪变化
 * @param {*} target 
 * @param {*} key 
 * @returns 
 */
function track(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}

/**
 * 在 set 拦截函数内调用 trigger 函数触发变化
 * @param {*} target 
 * @param {*} key 
 * @returns 
 */
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    // TODO:变更，避免无限递归！
    const effectsToRun = new Set(effects)  // 新增
    effectsToRun.forEach(effectFn => effectFn())  // 新增
    // effects && effects.forEach(fn => fn()) // 删除
}

effect(
    // 匿名副作用函数
    () => {
        console.log('effect run') // 会打印 2 次
        document.body.innerText = obj.ok ? obj.text : 'not'
    }
)

setTimeout(() => {
    obj.ok = false
}, 1000)
