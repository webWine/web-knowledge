type Style = string | Record<string, string | string[]> | null
/**
 * style处理
 * @param el 
 * @param prevValue 
 * @param nextValue 
 *   style是一个对象,所以需要做对比
 */
export function patchStyle(el: HTMLElement, prevValue: any, nextValue: any) {
  const style = el.style;
  if (!nextValue) {
    el.removeAttribute("style")
  } else {
    // 先用新的值覆盖style,等新的覆盖结束,清空旧的style中不再使用的值 
    for (const key in nextValue) {
      style[(key as any)] = nextValue[key]
    }
    if (prevValue) {
      for (const key in prevValue) {
        if (!nextValue[key]) {
          style[(key as any)] = ''
        }
      }
    }

  }

}
