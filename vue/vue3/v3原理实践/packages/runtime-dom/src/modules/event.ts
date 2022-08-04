
const createInvoker = (cb: Function) => {
  const invoker = (e: any) => invoker.value(e);
  invoker.value = cb;
  return invoker
}

/**
 * 事件处理
 * @param el 
 * @param prevValue 
 * @param nextValue 
 *    v3在这里做了优化,正常来说绑定事件需要: 卸载事件——>绑定事件,
 *    但如果将事件的绑定方法绑定在一个动态属性上,这样就可以通过修改动态属性来完成事件的替换,减少了事件添加和移除的开销
 */

export function patchEvent(el: Element, eventName: any, nextValue: any) {
  let invokers = (el as any)._evi || ((el as any)._evi = {})

  let exits = invokers[eventName]  // 查询是否已绑定过事件

  if (exits && nextValue) { // 已绑定过
    exits.value = nextValue;
  } else {
    let event = eventName.slice(2).toLowerCase();
    if (nextValue) {
      const invoker = invokers[eventName] = createInvoker(nextValue);
      el.addEventListener(event, invoker)
    } else if (exits) { // 新的事件不存在了,但是有老的
      el.removeEventListener(event, exits);
      invokers[eventName] = null;
    }
  }

}