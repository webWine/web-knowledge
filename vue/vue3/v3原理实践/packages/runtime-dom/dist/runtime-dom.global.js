var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Text: () => Text,
    createRenderer: () => createRenderer,
    createVnode: () => createVnode,
    h: () => h,
    isSameVnode: () => isSameVnode,
    isVnode: () => isVnode,
    render: () => render
  });

  // packages/shared/src/index.ts
  function isObject(target) {
    return typeof target == "object" && target !== null;
  }
  function isString(target) {
    return typeof target == "string";
  }
  function isArray(target) {
    return Array.isArray(target);
  }

  // packages/runtime-core/src/vnode.ts
  function isVnode(value) {
    return !!(value && value.__v_isVnode);
  }
  var Text = Symbol("text");
  function isSameVnode(newVnode, oldVnode) {
    return newVnode.type === oldVnode.type && newVnode.key === oldVnode.key;
  }
  function createVnode(type, props, children = null) {
    let shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
    const vnode = {
      __v_isVnode: true,
      key: props == null ? void 0 : props.key,
      type,
      children,
      el: null,
      props,
      shapeFlag
    };
    if (children) {
      let type2 = 0;
      if (isArray(children)) {
        type2 = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        type2 = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlag |= type2;
    }
    return vnode;
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions2) {
    console.log(renderOptions2);
    const {
      insert,
      remove,
      createTextNode,
      setElementText,
      setText,
      createElement,
      patchProp: patchProp2
    } = renderOptions2;
    const normalize = (child) => {
      if (isString(child)) {
        return createVnode(Text, null, child);
      }
      return child;
    };
    const mountChildren = (children, el) => {
      for (let i = 0; i < children.length; i++) {
        const child = normalize(children[i]);
        patch(null, child, el);
      }
    };
    const mountElement = (newVnode, container) => {
      const { type, props, shapeFlag, children } = newVnode;
      const el = newVnode.el = createElement(type);
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        setElementText(el, children);
      } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
      }
      ;
      if (props) {
        for (let key in props) {
          patchProp2(el, key, null, props[key]);
        }
      }
      insert(el, container);
    };
    const processText = (oldVnode, newVnode, el) => {
      if (oldVnode == null) {
        newVnode.el = createTextNode(newVnode.children);
        insert(newVnode.el, el);
      } else {
        if (oldVnode.children == newVnode.children) {
          setText(oldVnode.el, newVnode.children);
        }
      }
    };
    const patchProps = (oldProps, newProps, el) => {
      for (let key in newProps) {
        patchProp2(el, key, oldProps[key], newProps[key]);
      }
      for (let key in oldProps) {
        if (!newProps[key]) {
          patchProp2(el, key, oldProps[key], null);
        }
      }
    };
    const unmountChildren = (children) => {
      for (let i = 0; i < children.length; i++) {
        unmount(children[i]);
      }
    };
    const patchChildren = (oVnode, nVnode, el) => {
      const oldChild = oVnode && oVnode.children;
      const newChild = nVnode && nVnode.children;
      let oldShapeFlag = oVnode.shapeFlag;
      let newShapeFlag = nVnode.shapeFlag;
      if (newShapeFlag & 8 /* TEXT_CHILDREN */) {
        if (oldShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(oldChild);
        }
        if (oldChild !== newChild) {
          setElementText(el, newChild);
        }
      } else if (newShapeFlag & 16 /* ARRAY_CHILDREN */) {
        if (oldShapeFlag & 16 /* ARRAY_CHILDREN */) {
        } else {
          if (oldShapeFlag & 8 /* TEXT_CHILDREN */) {
            setElementText(el, "");
          }
          mountChildren(newChild, el);
        }
      } else {
        if (oldShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(oldChild);
        } else if (oldShapeFlag & 8 /* TEXT_CHILDREN */) {
          setElementText(el, "");
        }
      }
    };
    const patchElement = (oVnode, nVnode) => {
      console.log("******patchElement****");
      let el = nVnode.el = oVnode.el;
      let oldProps = oVnode.props || {};
      let newProps = nVnode.props || {};
      patchProps(oldProps, newProps, el);
      patchChildren(oVnode, nVnode, el);
    };
    const processElement = (oldVnode, newVnode, container) => {
      if (!oldVnode) {
        mountElement(newVnode, container);
      } else {
        patchElement(oldVnode, newVnode);
      }
    };
    const patch = (oldVnode, newVnode, container) => {
      if (oldVnode == newVnode)
        return;
      if (oldVnode && !isSameVnode(oldVnode, newVnode)) {
        unmount(oldVnode);
        oldVnode = null;
      }
      const { type, shapeFlag } = newVnode;
      switch (type) {
        case Text:
          processText(oldVnode, newVnode, container);
          break;
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(oldVnode, newVnode, container);
          }
      }
    };
    const unmount = (vnode) => {
      remove(vnode.el);
    };
    const render2 = (vnode, container) => {
      console.log(vnode, container);
      if (vnode) {
        patch(container._vnode || null, vnode, container);
      } else {
        if (container._vnode) {
          unmount(container._vnode);
        }
      }
      container._vnode = vnode;
    };
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/h.ts
  function h(type, propsChildren, children) {
    const l = arguments.length;
    if (l == 2) {
      if (isObject(propsChildren) && !isArray(propsChildren)) {
        if (isVnode(propsChildren)) {
          return createVnode(type, null, [propsChildren]);
        }
        return createVnode(type, propsChildren);
      } else {
        return createVnode(type, null, propsChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l == 3 && isVnode(children)) {
        children = [children];
      }
      return createVnode(type, propsChildren, children);
    }
  }

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert(child, parent, anchor = null) {
      parent.insertBefore(child, anchor);
    },
    remove(child) {
      const parentNode = child.parentNode;
      parentNode && parentNode.removeChild(child);
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    querySelector(selector) {
      return document.querySelector(selector);
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling;
    },
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createText(text) {
      return document.createTextNode(text);
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.setAttribute(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue) {
      el.className = nextValue;
    } else {
      el.removeAttribute("class");
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  var createInvoker = (cb) => {
    const invoker = (e) => invoker.value(e);
    invoker.value = cb;
    return invoker;
  };
  function patchEvent(el, eventName, nextValue) {
    let invokers = el._evi || (el._evi = {});
    let exits = invokers[eventName];
    if (exits && nextValue) {
      exits.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListener(event, invoker);
      } else if (exits) {
        el.removeEventListener(event, exits);
        invokers[eventName] = null;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, prevValue, nextValue) {
    const style = el.style;
    if (!nextValue) {
      el.removeAttribute("style");
    } else {
      for (const key in nextValue) {
        style[key] = nextValue[key];
      }
      if (prevValue) {
        for (const key in prevValue) {
          if (!nextValue[key]) {
            style[key] = "";
          }
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, prevValue, nextValue) {
    if (key == "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  function render(vnode, container) {
    createRenderer(renderOptions).render(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
