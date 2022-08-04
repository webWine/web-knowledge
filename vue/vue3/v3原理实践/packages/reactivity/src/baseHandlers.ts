// import { baseHandlerKeyType, ReactiveFlag } from "./type"
import { reactive } from "./reactive"
import { isObject } from "@vue/shared"
import { track, trigger } from "./effect"
export type baseHandlerKeyType = symbol | string
import { ReactiveFlag } from "./reactive"


/**
 * 触发数据时为节省性能开销应该先判断数据是否改变,如果数据无变化则不应该触发trigger
 */
export const baseHandler = {
  get(target: object, key: baseHandlerKeyType, reciver: any) {
    if (key === ReactiveFlag.IS_REACTIVE) {
      return true
    }
    // 解决reactive的问题三
    const currentValue = (target as any)[key]
    if (isObject(currentValue)) {
      reactive(currentValue)
    }
    // 读取数据时进行依赖收集
    track(target, key)
    return Reflect.get(target, key, reciver)
  },
  set(target: object, key: baseHandlerKeyType, value: any, reciver: any) {

    const oldVal = (target as any)[key];
    if (oldVal !== value) {
      // 设置数据查找依赖触发副作用函数执行
      trigger(target, key, value)
    }

    return Reflect.set(target, key, value, reciver)
  }
}