/**
 * h方法具有多样性
 * 1、h('div')
 * 2、h('div',{style:xxx})
 * 3、h('div',null,'xxx','xxx')
 * 4、h('div ')
 */

import { isArray, isObject } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type: string, propsChildren: any, children: any) {
  const l = arguments.length;
  if (l == 2) {
    // 参数长度为2具有以下几种可能
    // 1、h(‘div’,{style:xxx})
    // 2、h('div',h('span'))
    // 3、h('div',[h(' '),h('span')])
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren)) {
        return createVnode(type, null, [propsChildren])
      }
      return createVnode(type, propsChildren)
    } else {
      return createVnode(type, null, propsChildren)
    }
  }
  else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l == 3 && isVnode(children)) { // 特殊情况 h('div',null,h('span'))
      children = [children]
    }

    return createVnode(type, propsChildren, children)
  }
}