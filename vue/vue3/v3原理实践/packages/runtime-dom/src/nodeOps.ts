export const nodeOps = {
  // 增加、删除、修改、查询
  //增加
  /**
   * 
   * @param child 子节点
   * @param parent 父节点
   * @param anchor 参照物,如果有参照物则表示在anchor前插入
   */
  insert(child: Element, parent: Element, anchor = null) {
    // insertBefore在某个节点前插入
    parent.insertBefore(child, anchor)
  },
  /**
   * 删除
   * @param child 子节点
   */
  remove(child: Element) {
    const parentNode = child.parentNode;
    parentNode && parentNode.removeChild(child)
  },

  /**
   * 修改元素中内容
   * @param el 
   * @param text 
   */
  setElementText(el: Element, text: string) {
    // 此处不用innerHTML,因为innerHTML会造成代码侵入有一定的安全风险
    el.textContent = text
  },
  /**
   * 修改文本节点
   * @param node 
   * @param text 
   */
  setText(node: Element, text: string) {
    node.nodeValue = text
  },
  createTextNode(text: string) {
    return document.createTextNode(text)
  },
  /**
   * 查询
   * @param selector 
   */
  querySelector(selector: any) {
    return document.querySelector(selector)
  },
  /**
   * 获取父节点
   * @param node 
   */
  parentNode(node: Element) {
    return node.parentNode
  },
  /**
   * 获取兄弟节点
   * @param node 
   * @returns 
   */
  nextSibling(node: any) {
    return node.nextSibling
  },
  /**
   * 创建元素
   * @param tagName 
   */
  createElement(tagName: any) {
    return document.createElement(tagName)
  },
  /**
   * 创建文本节点
   * @param text 
   */
  createText(text: string) {
    return document.createTextNode(text)
  }
}