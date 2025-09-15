/**
 * 注意：该代码会无限循环下去，因为：
 * 
 * 语言规范中对此有明确的说明：
 *     1. 在调用 forEach 遍历 Set集合时，如果一个值已经被访问过了，但该值被删除并重新添加到集合，
 *     2. 如果此时 forEach 遍历没有结束，那么该值会重新被访问。
 */
// const set = new Set([1])
// set.forEach(item => {
//     set.delete(1)
//     set.add(1)
//     console.log('遍历中')
// })


const set = new Set([1])

const newSet = new Set(set)

/**
 *  使用 new Set(set) 会创建一个新的 Set 实例对象，拥有独立的内存地址。
 *  
 *  即使新集合 newSet 包含与原集合 set 相同的元素，但它们在进行==判断时，依旧为false
 * 
 *  == 运算符比较引用类型时，比较的是它们的引用地址而非内容。
 */
console.log(newSet == set)  // false

// 将遍历操作与新增、删除操作分别用不同的对象操作，即可避免无限循环
newSet.forEach(item => {
    set.delete(1)
    set.add(1)
    set.add(2)
    console.log('遍历中')
})
console.log('set:', set)
console.log('newSet:', newSet)

// set: Set(2) { 1, 2 }
// newSet: Set(1) { 1 }