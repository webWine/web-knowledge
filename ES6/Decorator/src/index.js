/**
 * Decorator——装饰器实战
 *   ——装饰器是一种函数，写成@+函数名，它可以放在类和类方法定义的前面
 *   ——示例：
 *     @testDecorator
 *     class HandleResponse{
 *       @testDecorator_one
 *       add(){}
 *     }
 *     类的装饰器：接收一个参数，该参数为类本身，也可以添加多个参数，在外面再包一层函数来使用其他参数
 *     function testDecorator(target){}
 *     类方法的装饰器：接收三个参数，target(类的原型对象)、name(装饰的属性名)、descriptor(该属性的描述对象)，该方法就相当于Object.defineProperty(target,name,descriptor)
 *     function testDecorator_one(target,name,descriptor){}
 */
@description
class Math{
    
    @readonly
    name = 'math';

    @log
    @expand(2)
    add(a,b){
        return a+b
    }
    // @readonly
    @expand(2)
    read(){
        return `${this.name}Math is beautiful`
    }
}
/**
 * 装饰器函数
 * @param {*} target，装饰器的第一个函数，对应的是装饰器将要装饰的类 
 */
function description(target){
    // 添加静态属性
    target.responseMsg = "简单的一些计算方法"
}

// 类方法的装饰器

/**
 * 
 * @param {*} target，类的原型对象 
 * @param {*} name 装饰的属性名
 * @param {*} descriptor  该属性的描述对象，
 */
function log(target,name,descriptor){
    // descriptor值如下
    // {
    //     value:"当前值",
    //     enumerable:"是否可枚举", 
    //     configurable:""
    //     writable:"是否可写"
    // }
    let oldValue = descriptor.value;
    descriptor.value= function(){
        console.log(`${name}的结果为：`,oldValue.apply(this,arguments));
        return oldValue.apply(this,arguments)
    }
    return descriptor
}
function readonly(target,name,descriptor){
    descriptor.writable = false;
    return descriptor
}
function expand(multiple){
    return function(target,name,descriptor){
        const oldValue = descriptor.value;
        descriptor.value = function(){
            switch(typeof oldValue.apply(this,arguments)){
                case "number":
                    return oldValue.apply(this,arguments)*multiple
                default:
                    const resType = typeof oldValue.apply(this,arguments);
                    console.log(`${name}属于${resType}类型，无法进行倍数计算` );
                    return oldValue.apply(this,arguments) 
            }
            
        }
    }
}
const math = new Math();
math.name="sss"
console.log(math.name);
math.add(1,3)
math.read();