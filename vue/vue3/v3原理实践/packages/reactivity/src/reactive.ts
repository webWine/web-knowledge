import { baseHandler } from "./baseHandlers"
// import { ReactiveFlag } from "./type"
export const enum ReactiveFlag {
  IS_REACTIVE = '__is_reactive'
}
/**
 * reactive响应类型
 * @param target  需要被声明为响应式数据的对象
 * 1、已经使用reactive声明过的变量继续使用reactive声明会返回同一个reactive
 *    ————可以将已声明的数据存储在某处在做比较,或者对已使用reactive声明过的变量加上标识
 * 2、重复对一个对象代理需要返回同一个代理对象
 *    ————将已代理的对象存储起来,在每次声明reactive时进行对比
 * 3、reactive是深层响应,即对象内的对象也要保持响应式
 *    ————判断当前value为对象时,重新使用reactive声明
 * 4、目标对象是数组
 * 5、目标对象是Set
 * 6、目标对象是Map
 */

const reactiveMap = new WeakMap()
export function reactive(target: object) {

  // 解决问题二
  const isProxy = reactiveMap.get(target)
  if (isProxy) {
    return isProxy
  }
  // 解决问题一
  if ((target as any)[ReactiveFlag.IS_REACTIVE]) {
    return target
  }
  const proxy = new Proxy(target, baseHandler)
  reactiveMap.set(target, proxy)
  return proxy
}


export function shallowReactive() {

}