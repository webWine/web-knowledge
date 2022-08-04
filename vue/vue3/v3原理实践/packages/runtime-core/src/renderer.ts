import { isString, ShapeFlags } from "@vue/shared"
import { isSameVnode, Text, createVnode } from "./vnode";


export function createRenderer(renderOptions: any) {
  console.log(renderOptions);

  const {
    insert,
    remove,
    createTextNode,
    setElementText,
    setText,
    createElement,
    patchProp
  } = renderOptions

  const normalize = (child: any) => {
    if (isString(child)) {
      return createVnode(Text, null, child)
    }
    return child
  }

  const mountChildren = (children: any, el: HTMLElement) => {
    for (let i = 0; i < children.length; i++) {
      const child = normalize(children[i])
      patch(null, child, el)
    }
  }
  /**
   * 挂载节点
   * @param newVnode 
   * @param container 
   * 处理节点的props属性,需要讲props属性创建上去
   */
  const mountElement = (newVnode: any, container: any) => {

    const { type, props, shapeFlag, children } = newVnode;
    const el = newVnode.el = createElement(type);
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      setElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)

    };
    if (props) {
      for (let key in props) {
        patchProp(el, key, null, props[key])
      }
    }
    insert(el, container)
  }
  const processText = (oldVnode: any, newVnode: any, el: any) => {
    if (oldVnode == null) { // 旧节点不存在
      newVnode.el = createTextNode(newVnode.children)
      insert(newVnode.el, el)
    } else {
      // 直接替换
      if (oldVnode.children! == newVnode.children) {
        setText(oldVnode.el, newVnode.children)
      }
    }
  }
  const patchProps = (oldProps: any, newProps: any, el: HTMLElement) => {
    for (let key in newProps) {
      patchProp(el, key, oldProps[key], newProps[key])
    }
    for (let key in oldProps) {
      if (!newProps[key]) { // 新的属性不在具有老的属性时删除老的属性
        patchProp(el, key, oldProps[key], null)
      }
    }

  }
  const unmountChildren = (children: any) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
    }
  }
  /**
   * 子节点children对比,key和type相同则认为节点相同
   * @param oVnode 
   * @param nVnode 
   * @param container 
   */
  const patchChildren = (oVnode: any, nVnode: any, el: any) => {
    // 比较虚拟节点儿子的差异
    const oldChild = oVnode && oVnode.children;
    const newChild = nVnode && nVnode.children;
    let oldShapeFlag = oVnode.shapeFlag;
    let newShapeFlag = nVnode.shapeFlag;

    // children 比较,children具有三种可能:文本、空、数组

    // 新的为文本
    // 文本  文本     更新文本即可
    // 文本  空       更新文本即可
    // 文本  数组     卸载文本节点后创建子节点
    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新节点是文本,老节点是数组;删除老节点;创建新节点
        unmountChildren(oldChild);

      }
      if (oldChild !== newChild) {// 创建新节点或更新节点
        setElementText(el, newChild)
      }
    } else if (newShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 新节点为数组
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {// 数组 数组      diff算法

      } else {
        if (oldShapeFlag & ShapeFlags.TEXT_CHILDREN) {  // 老节点为文本,先移除文本,再挂载节点
          setElementText(el, '');
        }
        mountChildren(newChild, el)
      }
    } else { // 新节点为空
      // 老节点若存在移除老节点
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(oldChild)
      } else if (oldShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        setElementText(el, '');
      }

    }

    // 数组 数组      diff算法
  }
  /**
   * 节点对比
   * @param oldVnode 
   * @param newVnode 
   * @param container 
   * 1、如果新老节点完全没关系,删除老的,添加新的
   * 2、老的和新的一样,复用,属性可能不同,更新属性
   * 3、当前节点相同,比较儿子
   */
  const patchElement = (oVnode: any, nVnode: any) => {
    console.log("******patchElement****");
    let el = nVnode.el = oVnode.el; // 节点复用,此时新节点还没有创建节点
    let oldProps = oVnode.props || {};
    let newProps = nVnode.props || {}

    patchProps(oldProps, newProps, el)
    patchChildren(oVnode, nVnode, el)

  }

  const processElement = (oldVnode: any, newVnode: any, container: any) => {
    if (!oldVnode) {
      mountElement(newVnode, container)
    } else {
      // 旧节点存在执行更新逻辑
      patchElement(oldVnode, newVnode)
    }
  }
  /**
   * 
   * @param oldVnode 
   * @param newVnode 可能为文本,递归后产生
   * @param container 
   */
  const patch = (oldVnode: any, newVnode: any, container: any) => {
    if (oldVnode == newVnode) return;
    if (oldVnode && !isSameVnode(oldVnode, newVnode)) {
      unmount(oldVnode);
      oldVnode = null
    }
    // if (!oldVnode) {
    // 旧节点不存在,说明需要挂载新节点
    const { type, shapeFlag } = newVnode
    switch (type) {
      case Text:
        processText(oldVnode, newVnode, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVnode, newVnode, container)
        }
    }
    // } else {
    //   // 旧节点存在,与新节点进行比较
    // }
  }
  /**
   * 卸载节点
   */
  const unmount = (vnode: any) => {
    remove(vnode.el)
  }
  const render = (vnode: any, container: any) => {
    console.log(vnode, container);

    if (vnode) {
      // 新的vnode存在,进行“打补丁”操作
      patch(container._vnode || null, vnode, container)
    } else {
      // 新的vnode不存在,若老的vnode存在则需要将老的vnode挂载的节点注销
      if (container._vnode) {
        unmount(container._vnode);
      }
    }
    container._vnode = vnode;
  }
  return {
    render
  }
}