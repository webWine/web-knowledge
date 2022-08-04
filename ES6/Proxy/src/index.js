/**
 * Proxy原理:相当于在目标对象前架设一层“拦截”,外界访问该对象时,都必须先通过这层拦截,因此提供一种机制,可以对外界的访问进行过滤和改写,其实就是相当于对象的拦截器,在访问对象前后在拦截器中做一些自定义的处理
 * 使用方法:const proxy = new Proxy(target,handler);target就是需要拦截的对象,handler是拦截方法的集合对象,handler必须是一个对象,其中包含了拦截方法
 * 重点:——要使Proxy起作用,必须针对Proxy的实例进行操作,即针对上面的proxy操作,target经过拦截代理后变身为了proxy.
 *     ——如果handler是一个空对象,则没有任何拦截效果,访问proxy就相当于访问target
 *     ——target可以是任何类型的对象,包括原生数组,函数,甚至另外一个代理
 *     ——handler通常以一个函数作为属性的对象,各属性的含义分别定义了在执行各种操作代理proxy的行为,handler目前具有13种属性
 *       ——1、get()
 *       ——2、set()
 *       ——3、apply()
 *       ——4、has()
 *       ——5、construct()
 *       ——6、ownKeys()
 *       ——7、getPrototypeOf()
 *       ——8、setPrototypeOf()
 *       ——9、defineProperty()
 *       ——10、deleteProperty()
 *       ——11、getOwnPropertyDescriptor()
 *       ——12、isExtendsible()
 *       ——13、preventExtensions()
 */
/**
 * 1、get()
 * 作用:拦截对象的读取操作,读取操作需满足基本的条件,例如如果设置了对象的属性不可修改,该属性已赋值,当通过代理后,在get属性中修改方法时会报错
 */
const obj = {};
// const proxy = new Proxy(obj, {
//   get: (target, prop, receiver) => {
//     return 20;
//   }
// })
// console.log(proxy.num);
// 设置obj的属性值不可修改
Object.defineProperty(obj, "num", {
  configurable: false,
  enumerable: false,
  value: 10,
  writable: false
})
console.log(obj.num);
const p = new Proxy(obj, {
  get: () => {
    return 20
  }
})
console.log(p.num); // TypeError
Object.defineProperty(obj, "num", {
  get: () => {
    return 20
  }
})
console.log(obj.num); // TypeError


/**
 * 2、set()
 * 作用:拦截对象的属性值设置操作
 */