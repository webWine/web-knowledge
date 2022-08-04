var VueRuntimeCore = (() => {
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

  // packages/runtime-core/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    createRenderer: () => createRenderer,
    h: () => h
  });

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions) {
    const {
      hostInsert,
      hostRemove,
      hostSetElementText,
      hostSetText,
      hostCreateElement,
      patchProp
    } = renderOptions;
    const mountElement = (newVnode, container) => {
      const el = hostCreateElement(container);
      if (typeof newVnode.children == "string") {
        hostSetElementText(newVnode.children, el);
      } else if (Array.isArray(newVnode.children)) {
      }
      ;
      if (newVnode.props) {
        for (const key in newVnode.props) {
          patchProp(el, null, newVnode.props);
        }
      }
      hostInsert(el, container);
    };
    const patch = (oldVnode, newVnode, container) => {
      if (!oldVnode) {
        mountElement(newVnode, container);
      } else {
      }
    };
    const render = (vnode, container) => {
      console.log(vnode, container);
      if (vnode) {
        patch(container._vnode, vnode, container);
      } else {
        if (container._vnode) {
        }
      }
      container._vnode = vnode;
    };
    return {
      render
    };
  }

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
        return createVnode(type, propsChildren);
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
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-core.global.js.map
