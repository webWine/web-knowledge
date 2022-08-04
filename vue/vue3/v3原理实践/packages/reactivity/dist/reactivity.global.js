var VueReactivity = (() => {
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

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    reactive: () => reactive
  });

  // packages/shared/src/index.ts
  function isObject(target) {
    return typeof target == "object" && target !== null;
  }

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var relyMap = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    if (!activeEffect)
      return;
    let keyMap = relyMap.get(target);
    if (!keyMap) {
      relyMap.set(target, keyMap = /* @__PURE__ */ new Map());
    }
    let effectSet = keyMap.get(key);
    if (!effectSet) {
      keyMap.set(key, effectSet = /* @__PURE__ */ new Set());
    }
    const shouldTrack = !effectSet.has(activeEffect);
    if (shouldTrack) {
      effectSet.add(activeEffect);
    }
    activeEffect.deps.push(effectSet);
  }
  function trigger(target, key, value) {
    const keyMap = relyMap.get(target);
    if (!keyMap)
      return;
    const effects = keyMap.get(key);
    const newEffects = new Set(effects);
    effects && effects.forEach((effect) => {
      if (effect !== activeEffect) {
        newEffects.add(effect);
      }
    });
    newEffects && newEffects.forEach((effect) => {
      if (effect == null ? void 0 : effect.options.scheduler) {
        effect == null ? void 0 : effect.options.scheduler(effect.run.bind(effect));
      } else {
        effect == null ? void 0 : effect.run();
      }
    });
  }

  // packages/reactivity/src/baseHandlers.ts
  var baseHandler = {
    get(target, key, reciver) {
      if (key === "__is_reactive" /* IS_REACTIVE */) {
        return true;
      }
      const currentValue = target[key];
      if (isObject(currentValue)) {
        reactive(currentValue);
      }
      track(target, key);
      return Reflect.get(target, key, reciver);
    },
    set(target, key, value, reciver) {
      const oldVal = target[key];
      if (oldVal !== value) {
        trigger(target, key, value);
      }
      return Reflect.set(target, key, value, reciver);
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    const isProxy = reactiveMap.get(target);
    if (isProxy) {
      return isProxy;
    }
    if (target["__is_reactive" /* IS_REACTIVE */]) {
      return target;
    }
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
