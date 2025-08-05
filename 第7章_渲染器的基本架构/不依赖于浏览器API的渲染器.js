/**
 * 不依赖于浏览器API的简易渲染器实现：
 * 
 * 我们可以将这些操作 DOM 的 API 作为配置项，该配置项可以作为createRenderer 函数的参数。
 */

/**
 * 定义一个渲染器
 * @param {*} options 配置项
 * @returns 
 */
function createRenderer(options) {
    // 通过 options 得到操作 DOM 的 API
    const {
        createElement,
        insert,
        setElementText
    } = options

    function mountElement(vnode, container) {
        // 调用 createElement 函数创建元素
        const el = createElement(vnode.type)
        if (typeof vnode.children === 'string') {
            // 调用 setElementText 设置元素的文本节点
            setElementText(el, vnode.children)
        }
        // 调用 insert 函数将元素插入到容器内
        insert(el, container)
    }

    /**
     * 渲染器会使用 newVNode 与上一次渲染的 oldVNode 进行比较，试图找到并更新变更点。
     * 这个过程叫作“打补丁”​（或更新）​，英文通常用patch 来表达
     * 
     * @param {*} n1 旧vnode
     * @param {*} n2 新vnode
     * @param {*} container 容器
     */
    function patch(n1, n2, container) {
        // 如果 n1 不存在，意味着挂载，则调用 mountElement 函数完成挂载
        if (!n1) {
            mountElement(n2, container)
        } else {
            // n1 存在，意味着打补丁，暂时省略
        }
    }

    /**
     * 
     * @param {*} vnode 新vnode，
     * @param {*} container 
     */
    function render(vnode, container) {
        if (vnode) {
            // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
            patch(container._vnode, vnode, container)
        } else {
            // 旧 vnode 存在，且新 vnode 不存在，说明是卸载（unmount）操作
            // 只需要将 container 内的 DOM 清空即可
            if (container._vnode) {
                container.innerHTML = ''   // TODO:这里还待改进，因为目前是DOM操作
            }
        }
        container._vnode = vnode
    }

    return {
        render
    }
}


const renderer = createRenderer({
    createElement(tag) {
        console.log(`创建元素 ${tag}`)
        return { tag }
    },
    setElementText(el, text) {
        console.log(`设置 ${JSON.stringify(el)} 的文本内容：${text}`)
        el.textContent = text
    },
    insert(el, parent, anchor = null) {
        console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`)
        parent.children = el
    }
})

const vnode = { type: 'h1', children: 'hello' }
// 使用一个对象模拟挂载点
const container = { type: 'root' }

renderer.render(vnode, container)