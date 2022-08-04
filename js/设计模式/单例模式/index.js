/**
 * @title 单例模式
 * @description 保证一个类仅有一个实例，并提供一个访问他的全局访问点
 */

/**
 * @title 基本的单例模式实现
 */
function Person() {
    return function (){
        console.log(this.count)
    }
};
// var SingleTon = (function () {
//     var instance = null;
//     return function () {
//         if (!instance) {
//             instance = new Person();
//         }
//         return instance
//     }
// })()
// var person1 = new SingleTon();
// var person2 = new SingleTon();
// console.log("person1" + (person1 === person2 ? "=" : "≠") + "person2");

/**
 * @title 透明的单例模式
 * @description 用户从这个类中创建对象时，可以向使用其他普通类一样（指使用new方式）——将上面的基本单例模式的Person放到SingleTon中就是一个简单的透明单例模式
 * @advantage
 * @shortcoming  1、使用了匿名执行函数及闭包
 *               2、并且在函数内部实例化了一个person，如果在后期维护时需要将上面的peoson改为student那就需要去根源修改了，这显然不符合代码规范
 */

/**
 * @title 代理单例模式
 * @description 通过代理类与具体的单例结合使用构成，上面的“基本单例实现”就是
 * @shortcoming 在代理类中写死了具体的“单例”，当需要更换具体“单例”时还需要操作代理类，这不符合“单一职责规范”
 */

/**
 * @title 惰性单例
 * @description 在程序需要时再创建对象实例，这也和上面的基本模式一样，重点是instance只在使用时才声明
 */

/**
 * @title 单例设计最优解
 * @description 在基础单例设计的基础上融汇"单一职能原则"，也就是将person提取出来
 * */
var SingleTon = (function () {
    var instance = null;
    this.count = 1;
    const _this = this;
    return function (fn) {
        _this.count++;
        if (!instance) {
            console.log(_this.count)
            instance = fn.apply(_this,arguments);
        }
        return instance
    }
})()

var person1 = new SingleTon(new Person());
var person2 = new SingleTon(new Person());
console.log("person1" + (person1 === person2 ? "=" : "≠") + "person2");