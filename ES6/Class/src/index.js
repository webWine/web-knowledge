/**
 * Class
 * Class是在ES6中规范的，类只是一个语法糖，他的很多功能都能额通过ES5去完成，只不过通过类的方式使用会使代码含义显得更直观
 * 类与构造函数从某方面来说是一致的，只不过类中的方法都是绑定在了类的原型对象上的，构造函数的方法可以绑定在自身实例上，也可以绑定在原型对象上
 */

/**
 * 构造函数与类的用法
 */
// 构造函数
function Person(name) {
  this.name = name;
  this.getName = function () {
    return this.name
  }
}
class PersonClass {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
const person = new Person("ysa");
const personClass = new PersonClass("gx");
console.log(person.getName());
console.log(personClass.getName());

// 类本身就指向构造函数
console.log("类的原型对象的构造函数与类本身是否相等:", PersonClass == PersonClass.prototype.constructor);


/**
 * constructor方法
 *    类的默认方法,通过new 命令生成对象实例时,自动调用该方法
 *    默认返回实例对象,也可以指定返回另外一个对象
 *    类中必须包含该函数,如果未显式的定义,类也会默认为其添加该函数
 */

/**
 * 类的实例
 *    ——必须使用new命令生成,如果忘记加上new,将会报错
 *    ——实例的属性除非显式的定义在其本身,否则都定义在其原型上
 *    ——与ES5一样,类的所有实例共享一个原型对象
 *      ——这也就意味着,可以通过实例的__proto__属性来为类添加方法,但是__proto__只是各浏览器厂商提供的一个私有属性,并不是语言本身特性,所以这里在定义的时候可以选用Object.getPropertyOf()
 */
console.log("绑定到构造函数中this中的属性是否属于实例的属性:", personClass.hasOwnProperty("name")); // true
console.log("类中定义的方法是否属于类的实例:", personClass.hasOwnProperty("getName")); //false
console.log("类的方法是否存在类的原型对象中:", personClass.__proto__.hasOwnProperty("getName")); //true
const personClass_one = new PersonClass("gx");
console.log("同一类的不同实例的原型对象关系为:", personClass_one.__proto__ == personClass.__proto__); //true
// 添加类方法
const personProperty = Object.getPrototypeOf(personClass_one);
personProperty.setName = function () {
  this.name = "update"
  return this.name
}

console.log(personClass_one.setName()); // update
console.log(personClass_one.getName()); //update
console.log(personClass.getName()); // gx


/**
 * 取值函数和存值函数(get/set)
 *    ——像在ES5中一样,类中可以使用取值函数和存值函数队某一属性的值进行拦截操作
 *    
 */
class SetAndGet {
  constructor() {
    this.value = "init value"
  }
  get value() {
    return "get value"
  }
  set value(str) {
    console.log(str + " value");
    return str + "value"
  }
}
const setAnGet = new SetAndGet();
console.log("get属性修改后的值为:", setAnGet.value);
setAnGet.value = "update"


/**
 * TODO_1:类中的环境默认就是严格模式,无需再手动设置为严格模式 
 * TODO_2:类不存在变量提升
 * TODO_3:类本质上只是ES5构造函数的一层封装,所以他也继承了很多ES5的特性,就包括name属性
 * TODO_4:在某个方法前加*,就表示该方法是一个Generator函数
 * TODO_5:类方法内部的this指向默认指向类的实例,一旦单独使用该方法将可能报错,解决方法:
 *        ——1、在函数内部绑定this指向为类的实例
 *        ——2、使用箭头函数
 */

/**
 * @静态方法
 *    静态方法是类本身的方法，只能通过类名访问，不能通过类的实例直接访问
 *    使用方法：static fun
 * TODO_1:类的静态方法中如果有this，那么该this指向的是类本身，而不是类实例
 * TODO_2:父类的静态方法可以被子类继承，其实类的所有属性都是能被继承的，但是继承后静态方法中的this指向子类
 */
class StaticFun {
  static getName() {
    return this.names
  }
}
let staticFun = new StaticFun();
staticFun.names = "实例属性";
StaticFun.names = "类的属性";
console.log(StaticFun.getName()); // 类的属性
// console.log(staticFun.getName()); //报错
/**
 * @静态属性
 *   静态属性是指类本身的属性，而不是类实例的属性，即Class.propName
 */
class StaticTest {
  static name = "staticTest";
}
StaticTest.value = "test"
console.log(StaticTest.value, StaticTest.name); // 这两个属性都可以读取并输出，他们都是类的静态属性




/**
 * @私有方法/私有属性
 *   TODO_1:实现方法1——使用特殊的方法名，例如_getName(),通过复杂化方法名达到私有的目的，但其仍然能够被外部访问
 *   TODO_2:方法2——利用Symbol生成独一无二的Symbol值，以该值作为函数名，但是仍然会被Reflect访问
 *   TODO_3:方法3——将私有方法移出类
 *   TODO_3:方法3——最新提案提出了使用#标记函数及属性使其变为私有,目前还在提案中
 *          ——1、私有属性或私有方法只能在类的内部被访问（只能通过当前类的实例访问，this也是指向当前实例的），在类的外部无法访问
 *          ——2、私有属性或私有方法可以与静态类型结合，得到私有静态属性、静态私有方法，这些将会结合二者的特性
 */
// 测试方法3
class Test {
  fun(fn) {
    bar.call(this, fn)
  }
}

function bar(baz) {
  return this.snaf = baz
}

// 方法4
class Test4 {
  // #funName
  // # fun() {

  // }
}

/**
 * @私有属性的判断
 *   ——1、利用try...catch语句访问私有属性或方法看是否报错，如果没有报错说明该类是具有该私有属性或私有方法的
 *   ——2、in运算符，私有属性 in 实例   如果私有属性在存在与实例对应的类中，该运算符将会返回true
 */
const test_4 = new Test4();

//方法1
class Test5 {
  // #funName;
  use(obj) {
    // try{
    //   obj.#funName
    // }catch(e){
    //   console.log("私有变量funName不存在");
    // }

    // 或者，目前还在提案中，使用有一定问题
    // if(#funName in obj){
    //   console.log("私有变量funName存在");
    // }
  }
}

/**
 * @静态块
 *  静态属性的初始化要么写在类的外部,要么写在类的constructor函数中
 *      ——1、写在类外部,将类的逻辑写在外部,这不符合代码的规范
 *      ——2、写在constructor中,但这样会在每次实例化类的时候都会重新运行一次
 * 为解决以上问题,ES2022提出一个静态块的概念:
 *    在类的内部生成一个代码块,在类生成时运行一次,主要作用是完成静态属性的初始化
 *       ——1、静态块内不能有return语句
 *       ——2、静态块内可以使用this以及类名纸袋当前类
 *       ——3、将私有属性与外部代码分享
 */
// 1、写在类外部
class Out {
  static a;
  static b;
}
Out.a = 2;
console.log("Out", Out.a);
// 2、写在constructor中
class Inner {
  static a;
  constructor(num) {
    console.log("constructor", num);
    Inner.a = num
  }
}
const inner = new Inner(1);
const inner_one = new Inner(2)
console.log("Inner", Inner.a);


// 静态块实现
class Test6 {
  static {
    // this和类名都指向当前类
    this.a = "a";
    Test6.b = "b";
  }
}
console.log(Test6.a, Test6.b); // a b

// 静态块内部与外部代码共享私有属性
// let getX;
// class Test7 {
//   // #x = 1;
//   static {
//     getX = obj => obj.x
//   }
// }
// getX(new Test7())


/**
 * TODO new.target
 *   该属性一般用于构造函数中,返回new命令作用的构造函数,如果函数不是通过构造函数实例化或者是Reflect.construct(),将会返回undefined
 *   class内部调用new.target将返回类名
 *   class子类继承父类后,new.target将会返回子类类名
 *   new.target返回的不是字符串
 */
// class内返回类名
class Test8 {
  constructor() {
    console.log(new.target === Test8);
  }
}
class Test9 extends Test8 {
  constructor() {
    super()
  }
}
const test8 = new Test8() //true
const test9 = new Test9() //false


