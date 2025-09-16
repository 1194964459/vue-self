# 简单Diff
Diff算法是渲染器的核心。

当新旧 vnode 的子节点都是一组节点时，**为了以最小的性能开销完成更新操作，需要比较两组子节点，用于比较的算法就叫作 Diff 算法**


通过key来复用DOM元素，通过移动来减少不断创建DOM、销毁DOM带来的性能开销

简单 Diff 算法的核心逻辑是，拿**新的一组子节点中的节点**去**旧的一组子节点**中**寻找可复用的节点**。如果找到了，则记录该节点的**位置索引**。我们把这个位置索引称为**最大索引**。在整个更新过程中，如果一个节点的索引值 小于 最大索引，则说明该节点对应的真实 DOM 元素需要移动。

如何移动、添加、删除 虚拟节点对应的DOM元素呢？
```
# 迭代过程：
for newChildren
  for oldChildren
    新的节点在oldChildren中是否存在？若存在 则记录该节点的位置索引。然后与lastIndex比较...

# 是否要移动？
lastIndex：新节点在oldChildren中的最大索引值，初始为0。当前节点索引比它小 则移动；否则将lastIndex更新为比它大的值...

# 如何移动？
需要找到锚点元素，将节点插入到锚点之前。底层调用的是浏览器原生的insertBefore函数：parent.insertBefore(el, anchor)）

# 如何判断需要添加?
newVNode 在 oldChildren中没找到，则需要新增。
  - 新增位置是？需要找到它对应的真实DOM的下一个兄弟节点作为锚点。若不存在？则newVNode是容器的第一个子节点（即： container.firstChild）

# 需要判断需要删除？
newChildren 遍历完了，oldChildren还有值，则需要删除...
  - oldChildren再遍历一遍，看其子节点的值是否能在newChildren中找到？找不到的话 直接 unmount 掉
```