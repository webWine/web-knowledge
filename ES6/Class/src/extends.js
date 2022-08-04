/**
 * @类的继承
 *    TODO_1:通过extends继承
 *    TODO_2:继承后子类会具有所有父类的属性和方法
 *    TODO_3:继承父类后,必须在子类构造函数中调用super()后,才可以新建实例,否则会报错
 *    TODO_4:constructor中调用super后才可以使用this,在此以前调用的this将会报错
 *    TODO_5:Object.getPrototypeOf()方法可以用来从子类上获取父类;Object,getPrototypeOf(ChindrenClass) == FatherClass
 *    TODO_6:super虽然作为的是父类的构造函数,但是其返回的是子类的实例,相当于FatherClass.prototype.constructor.call(ChindrenClass)
 *    TODO_7:super作为函数调用时,只能在constructor中调用,在其他地方调用将会报错
 *    TODO_8:super作为对象时,在普通方法中,指向父类的原型对象,在静态方法中指向父类
 */
console.log("类的继承");


/**
 * @类的prototype属性和__proto__属性
 *  TODO_1:子类的__proto__属性,表述构造函数的继承,总是指向父类
 *  TODO_2:子类的prototype属性的__proto__属性,表示方法的继承,总是指向父类的prototype属性
 */