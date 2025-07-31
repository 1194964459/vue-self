/**
 * 理论知识：
 *    1. 虚拟DOM是用来描述真实DOM的普通JS对象，渲染器会把这个对象转换为真实的DOM
 */
/**
 * 虚拟Dom编写 
 */
const vnode = {
    tag: 'div',
    props: {
        onClick: () => alert('hello')
    },
    children: '点我'
}

/**
 * 渲染器：
 * @param {*} vnode 虚拟Dom对象
 * @param {*} container 挂载点，一个真实DOM元素，渲染器把虚拟DOM渲染到该挂载点下
 */
function renderer(vnode, container) {
    const el = document.createElement(vnode.tag)

    // props: 属性、事件
    for (let key in vnode.props) {
        // 若以on开头，说明是事件
        if (/^on/.test(key)) {
            el.addEventListener(key.substring(2).toLowerCase(), vnode.props[key])
        }
    }

    if (typeof vnode.children === 'string') {
        el.appendChild(document.createTextNode(vnode.children))
    }
    else if (Array.isArray(vnode.children)) {
        // 使用当前元素el作为挂载点
        vnode.children.forEach(child => {
            renderer(child, el)
        });
    }

    // 将元素挂载到挂载点下
    container.appendChild(el)

}

renderer(vnode, document.body)