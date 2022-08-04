export function patchClass(el: Element, nextValue: any) {
  if (nextValue) {
    el.className = nextValue;
  } else {
    el.removeAttribute('class')  // 如果新的class无内容,则移除class
  }
}