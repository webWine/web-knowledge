import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/event";
import { patchStyle } from "./modules/style";

/**
 * 属性设置
 * @param el 待处理的节点
 * @param key 
 * @param prevValue 
 * @param nextValue 
 *  prevValue=null,nextValue存在,创建
 *  prevValue存在,nextValue存在,替换或对比替换
 *  prevValue存在,nextValue=null,清除
 */
export function patchProp(el: HTMLElement, key: string, prevValue: any, nextValue: Object) {
  // 类 el.className
  if (key == "class") {
    patchClass(el, nextValue)
  } else if (key === "style") {
    // 样式 el.style
    patchStyle(el, prevValue, nextValue)
  } else if (/^on[^a-z]/.test(key)) {
    // events
    patchEvent(el, key, nextValue)
  } else {
    patchAttr(el, key, nextValue)
  }

  // events
  // 其他
}