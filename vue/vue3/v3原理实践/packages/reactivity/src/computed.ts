import { effect } from "./effect";
interface ComputedRef<T = any> {
  readonly value: T
}
type ComputedGetter<T> = (...args: any[]) => T
/**
 * 
 * @param fn 回调函数
 * 1、回调函数具有返回值,该返回值可以通过.value访问
 * 2、computed具有缓存效果,即当回调函数中的变量无变化时,多次访问computed返回的值会懒计算,使用脏值判断
 * 3、computed并不是立即执行的,只有用户在使用computed时才会执行,因此需要在调度函数中进行设置,传入一个参数到effect中,供effect选择使用
 */
export function computed<T>(getter: ComputedGetter<T>) {
  let dirty = true
  // 在effect中,我们回先执行一次ReactiveEffect中的run函数,该函数最终会将传入effect的回调函数getter执行,
  // 在ccomputed中,用户总是期望computed会返回getter的执行结果,所以我们可以在effect的run中将getter的结果传出
  const effectFn = effect(getter, {
    lazy: true,
    // 响应式数据变化时会触发该调度函数
    scheduler() {
      dirty = true
    }
  })
  const obj: ComputedRef<T> = {
    get value() {
      // 脏值检测为真的时候才需要重新获取数据
      let res;
      if (dirty) {
        // computed地磁执行时会触发effectFn,从而执行ReactiveEffect进而实现依赖收集
        res = effectFn()
        dirty = false
      }
      return res
    }
  }
  return obj
}