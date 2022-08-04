import { effect } from "./effect";
interface WatchOptions {
  // 是否立即执行的标志
  immediate?: true,
  // post:将副作用函数放到微任务重,等待DOM更新结束后执行
  flush?: 'pre' | 'post' | 'sync'
}
/**
 * watch监听函数
 * @param val 
 * 1、需要返回新值和旧值
 * 2、具有可选项immediate等
 * 3、
 */
/**
 * 
 * @param source 一个函数或对象,作为函数会返回监听对象的值
 * @param callback 
 * @param options 
 */
export function watch(source: any, callback: any, options: WatchOptions = {}) {
  let getter: any;
  if (typeof source == 'function') {
    getter = source
  } else {
    // source可能会有多层结构,遍历循环source对象,就会不断触发代理对象的get,进而将source上的所有属性都与effect形成一个依赖关系
    getter = () => traverse(source)
  }
  let newVal: any, oldVal: any;
  // 待执行的回调
  const job = () => {
    newVal = effectFn()
    callback(newVal, oldVal);
    oldVal = newVal
  }
  const effectFn = effect(getter, {
    //  watch在非立即执行情况下是只有当数据变化后才会执行,并不会立即执行,所以这里需要传入lazy为true控制effect首次不执行
    lazy: true,
    scheduler() {
      getter()
      if (options.flush) {
        const p = Promise.resolve();
        p.then(() => {
          job()
        })
      } else {
        job()
      }
    }
  })
  // getter就是source的优化版,source实际上是一个待观测值或是一个返回观测值的函数
  oldVal = effectFn()
}

// 为了便利对象的所有属性触发track进而将其与effect绑定依赖关系
function traverse(source: any, seen = new Set()) {
  // 如果被观测对象是一个基本类型值或已经被转化过就直接返回
  if (typeof source !== "object" || source !== null || seen.has(source)) return;
  seen.add(source)
  for (const k in source) {
    traverse(source[k], seen)
  }
  return source
}
