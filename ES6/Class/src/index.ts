const age: number = 10;
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
    this.getName = function (): string {
        return this.name
    }
}
class PersonClass {
    name: string
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name
    }
}
const person = new Person("ysa");
const personClass = new PersonClass("gx");
console.log(person.getName());
console.log(personClass.getName());

// 类本身就指向构造函数
console.log(PersonClass == PersonClass.prototype.constructor);


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
 */
console.log(personClass.hasOwnProperty("name"));   // true
console.log(personClass.hasOwnProperty("getName")); //false

