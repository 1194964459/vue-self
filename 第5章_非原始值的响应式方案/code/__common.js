// 用一个全局变量存储被注册的副作用函数
let activeEffect

/**
 * effect 函数用于注册副作用函数，同时收集依赖  看哪些属性值依赖当前的副作用函数
 * 副作用函数执行前需要清除之前所有的依赖，执行后再重建最新的依赖...
 * 
 * 关键点：effectFn.deps，cleanup()
 * @param {*} fn 
 */
export function effect(fn) {
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
    // 遍历 effectFn.deps 数组
    for (let i = 0; i < effectFn.deps.length; i++) {
        // deps 是依赖集合
        const deps = effectFn.deps[i]
        // 将 effectFn 从依赖集合中移除
        deps.delete(effectFn)
    }
    // 最后需要重置 effectFn.deps 数组
    effectFn.deps.length = 0
}

// 存储副作用函数的桶
const bucket = new WeakMap()

/**
 * 在 get 拦截函数内调用 track 函数追踪变化
 * @param {*} target 
 * @param {*} key 
 * @returns 
 */
export function track(target, key) {
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
export function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set(effects)  // 新增
    effectsToRun.forEach(effectFn => effectFn())  // 新增
    // effects && effects.forEach(fn => fn()) // 删除
}