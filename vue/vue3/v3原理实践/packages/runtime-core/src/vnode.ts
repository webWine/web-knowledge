import { isArray, isString, ShapeFlags } from "@vue/shared";

export function isVnode(value: any) {
  return !!(value && value.__v_isVnode)
}

export const Text = Symbol('text')
/**
 * 判断两个虚拟节点是否相同
 * @param newVnode 
 * @param oldVnode 
 * type和key保持一致即认为虚拟节点相同
 */
export function isSameVnode(newVnode: any, oldVnode: any) {
  return (newVnode.type === oldVnode.type) && (newVnode.key === oldVnode.key)
}

export function createVnode(type: any, props: any, children: any = null) {
  let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
  const vnode = {
    __v_isVnode: true,
    key: props?.key,
    type,
    children,
    el: null, // 虚拟节点上对应的真实dom,后续diff算法使用
    props,
    shapeFlag
  }
  if (children) {
    let type = 0;
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN
    } else {
      children = String(children);
      type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag |= type
  }
  return vnode
}