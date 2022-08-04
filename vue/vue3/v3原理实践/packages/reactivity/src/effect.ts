import { baseHandlerKeyType } from "./type";
export type ReactiveEffectType = undefined | ReactiveEffect;
interface EffectOptions {
  scheduler?: (fn: any) => void,
  lazy?: boolean
}



// 当前活动的副作用函数
let activeEffect: ReactiveEffectType = undefined;
class ReactiveEffect {
  private active = true
  private fn: Function
  // 解决effect嵌套引用问题,当前effect执行结束后将当前执行的activeEffect改变为正确的指向
  // 解决effect的问题一
  public parent: ReactiveEffectType = undefined;
  public deps: Set<ReactiveEffect>[] = []
  constructor(fn: Function, public options: EffectOptions) {
    this.fn = fn;
    this.options = options
  }
  run() {
    try {
      if (!this.active) return;
      cleanup(this)
      this.parent = activeEffect;
      // 当副作用函数执行时,将当前副作用函数的相关信息绑定到当前活动的副作用函数中
      activeEffect = this;
      // fn执行时将会进行变量读取操作,进一步触发track
      return this.fn()
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
}


/**
 * @name 副作用函数
 * @param callback ,副作用函数的回调函数
 * @desc 
 *      1、副作用函数的回调函数中具有响应式对象reactive声明的变量,当回调执行后会读取数据(经过代理对象的get),
 *         此时在代理对象的读取数据中拦截收集变量与副作用函数的对应关系
 *      2、在后续修改reactive声明的变量时,会经过代理对象的set中,此时就可以根据步骤一得到
 *         的绑定关系查询当前对象绑定的副作用函数并执行该副作用函数
 * @tips
 *     1、effect可以嵌套执行;
 *     2、effect具有一个调度函数scheduler;
 *     3、分支模式导致的残留的副作用函数,举个例子:在副作用函数中使用三元表达式:xxx=obj.name ? obj.age : 'not'
 *       当obj.name为true时将会收集obj.age及对应的effect,此时将obj.name改为false,按理说再修改obj.age应该不会触发effct菜正常
 *       但实际上,obj.age与effect始终在依赖集合中未去除,因此一旦修改obj.age就将会触发effect,原因既然了,那么解决方案就很清晰,
 *       我们在每次执行副作用函数时就将依赖关系清除即可;
 *       ——当分支模式副作用函数开始执行时,当前正在执行的副作用函数就是与分支模式中两个变量具有依赖关系的副作用函数,
 *         因此在副作用中将变量绑定的副作用函数集合(该集合在后续引用时就是一个引用地址)也绑定在当前正在执行的副作用函数中,这样当执行副作用函数时,就可以同时清理当前副作用函数中的所有依赖关系
 */
export function effect(callback: Function, options: EffectOptions = {}) {
  const _effect = new ReactiveEffect(callback, options);
  if (options.lazy) {
    return _effect.run.bind(_effect)
  } else {
    // run函数中会执行callback,因此需要先执行一遍run函数,得到reactive与effect的依赖关系
    return _effect.run()
  }


}
/**
 * 依赖清除
 */
function cleanup(effect: ReactiveEffect) {
  const deps = effect.deps;
  deps.length > 0 && deps.forEach(item => {
    item && item.delete(effect)
  });
  effect.deps.length = 0
}


/**
 * @name 依赖收集
 * @param target 
 * @param key 
 * @desc 收集当前对象的key以及当前当前对象对应的key对应的副作用函数,但是仅仅收集key与effect的对应关系是不对的,考虑下面的例子
 *       多个对象都有name属性,那么如果只收集key与effect的关系到最后将会乱套,因此我们需要讲对象也绑定上去,那关键元素就包括:
 *       target、key、effect,很明显一个key可能会绑定多个effect,因此key和effect是一个一对多的关系,为避免多次执行,
 *       对于同样的effect我们可以只添加一次.观察target是一个对象, 只有map可以将对象作为key,因此就得到下面的结构:
 *        Map(target,Map(key,Set([effect])))
 */
const relyMap = new WeakMap()
export function track(target: object, key: baseHandlerKeyType) {
  // 响应式effect的run函数在执行时触发了此处,并将activeEffect赋值,这也就意味着如果activeEffect为假,其实并不会触发此处
  if (!activeEffect) return;
  let keyMap = relyMap.get(target)
  if (!keyMap) {
    relyMap.set(target, (keyMap = new Map()))
  }
  let effectSet = keyMap.get(key)
  if (!effectSet) {
    keyMap.set(key, (effectSet = new Set()))
  }
  const shouldTrack = !effectSet.has(activeEffect);
  if (shouldTrack) {
    effectSet.add(activeEffect);
  }
  // !注意  这里的effectSet在往activeEffect存时实际上存的是一个引用地址
  activeEffect.deps.push(effectSet)
}

/**
 * 根据依赖触发副作用函数
 * @param target 
 * @param key 
 * @param value 
 * 根据target、key查询在track阶段绑定的副作用函数,并循环执行
 */
export function trigger(target: object, key: baseHandlerKeyType, value: any) {
  const keyMap = relyMap.get(target)
  if (!keyMap) return;
  const effects = keyMap.get(key);
  // 这里有一个坑,试想一下在一个副作用函数中我们去为一个响应式数据赋值,并在外面也进行赋值,那么当外面的赋值操作触发trigger执行run后,
  // 副作用函数内部的响应式数据继续赋值,那么此时正在执行的effect还未执行完,立马又会产生一个新的effect逐渐递归下去就会产生无数个effect
  const newEffects = new Set<ReactiveEffectType>(effects);
  effects && effects.forEach((effect: ReactiveEffectType) => {
    if (effect !== activeEffect) {
      newEffects.add(effect)
    }
  });

  newEffects && newEffects.forEach((effect: ReactiveEffectType) => {
    // 调度函数实现
    if (effect?.options.scheduler) {
      effect?.options.scheduler(effect.run.bind(effect))
    } else {
      effect?.run()
    }
  });
}
