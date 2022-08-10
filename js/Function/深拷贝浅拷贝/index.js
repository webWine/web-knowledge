import {getType} from "../../../share/objectType";
/**
 * 浅拷贝
 *   ——浅拷贝是指新创建一个对象，然后复制被拷贝对象的属性，对于引用类型的属性值，在拷贝时将会复制引用类型的指针
 *   ——浅拷贝与赋值的区别：
 *     ——1、浅拷贝与赋值不相等，浅拷贝只有对象内层的属性值相等，拷贝对象与被拷贝对象是不相等的
 *   ——浅拷贝对象的方法：
 *     ——1、object.assign({},被拷贝对象)
 *     ——2、...运算符，[...被拷贝对象]/{...被拷贝对象}
 *     ——3、concat()/slice(0)
 *     ——4、for...in,单层循环即可
 */

/**
 * 深拷贝
 *   ——深拷贝是指按照被拷贝对象的层级复制被拷贝对象的所有属性到新对象，复制后的每个对象都与原对象不相等
 * 深拷贝方法：假设被拷贝对象为A，拷贝后的对象为B
 *   ——1、B=JSON.parse(JSON.stringify(A))
 *        ——缺点：JSON.stringify()是碰见Date、RegExr、NaN、±Infinity、环引用(A中具B，B中有A)等将会失真
 *   ——2、普通遍历、递归(deepClone_0())
 *        ——缺点：无法解决环引用，将会导致栈溢出
 *   ——3、在方法2的基础上加上map结构，基础版，只处理了Array与Object（deepClone_1()）
 *   ——4、进阶版之可遍历数据，可遍历数据包括
 *        ——1、Map/Set/Array/Object
 *
 */
const A = {
    name: "ysa",
    age: "19",
    parents: {
        father: "yzr",
        mother: "lkx"
    }
};
(function (A) {
    // JSON.stringify方式
    function deepClone(target) {
        return JSON.parse(JSON.stringify(target))
    }

    const B = deepClone(A)
    console.log(A == B); // false
    console.log(A.parents == B.parents); //false
})(A);

(function (A) {
    // 普通递归深拷贝
    function deepClone_0(target) {
        if (typeof target != "object") {
            return target;
        }
        // 对象内也可能会有数组
        const temp = Object.prototype.toString.call(target) === "[object Array]" ? [] : {};
        for (const key in target) {
            temp[key] = deepClone_0(target[key])
        }
        return temp
    }

    const B = deepClone_0(A)
    console.log(A == B); // false
    console.log(A.parents === B.parents); //false
})(A);
// 实现环引用只能等对象创建结束后使用.元素符添加
A.aaa = A;
A.home = "world"
console.log(A);
(function (A) {
    // 使用map辅助的递归深拷贝
    function deepClone_1(target, map = new Map()) {
        if (typeof target != "object") {
            return target;
        }
        // 对象内也可能会有数组
        const temp = Object.prototype.toString.call(target) === "[object Array]" ? [] : {};
        if (map.get(target)) {
            // 解决循环引用
            return map.get(target)
        }
        // 初始化执行的时候就已经将A放在了Map中，所以后面执行到环引用时target值就与A相等，因此map.get(target)将会返回true，结束遍历
        map.set(target, temp);
        console.log(map.get(target));
        for (const key in target) {
            temp[key] = deepClone_1(target[key], map)
        }
        return temp
    }

    const B = deepClone_1(A);
    console.log(B);
    console.log(A === B); // false
    console.log(A.parents === B.parents); //false
})(A);
var C = {
    name: "yda",
    age: 18,
    parents: {
        father: "father",
        mother: "mother"
    },
    mapObj: new Map([["name", "yda"]]),
    setObj: new Set([1, 2, 3]),
    arr: [1, 2, 3],
    reg: /123/i,
    func: function () {
    },
    symbol: Symbol(123),
};
C.key = C;
/**
 * 进阶版深拷贝之可遍历数据的深拷贝
 * 步骤：
 *   ——1、判断入参类型，如果入参类型为基本类型直接返回
 *   ——2、对遍历得到的object类型数据根据对应的数据格式创建对象
 *   ——3、对得到的遍历后的引用数据类型再次遍历递归
 *   ——4、借用map，初始化时将原始数据作为key放到map中，将初始化的返回数据作为value存入map，等到递归发现递归时的对象等于原始对象时直接返回
 */
(function (C) {
    // 根据对象构造函数创建对应的对象,包含基本数据类型，需要排出function
    function createObj(target) {
        const objConstructor = target.constructor;
        return new objConstructor();
    }

    function deepClone_2(target, map = new WeakMap()) {
        // 若target为对象，则创建新的对象
        if (!(typeof target === "object" && target !== null)) {
            return target
        }
        let temp = null;
        if (typeof target !== "function") {
            temp = createObj(target);
        }
        if (getType(target, "Map")) {
            target.forEach((value, key) => {
                temp.set(key, deepClone_2(value, map))
            });
            return temp
        }
        if (getType(target, "Set")) {
            target.forEach((value) => {
                temp.add(deepClone_2(value, map))
            });
            return temp
        }
        if (map.get(target)) {
            // 防止循环引用
            return map.get(target)
        }
        // 初始化执行的时候就已经将A放在了Map中，所以后面执行到环引用时target值就与A相等，因此map.get(target)将会返回true，结束遍历
        map.set(target, temp);
        for (const key in target) {
            const currentVal = target[key];
            if (typeof currentVal == "object" && currentVal !== "null") {
                temp[key] = deepClone_2(target[key], map)
            } else {
                temp[key] = target[key]
            }

        }
        return temp
    }

    const D = deepClone_2(C);
    console.log("可遍历对象的深拷贝");
    console.log(D);
    console.log(C === D); // false
    console.log(C.mapObj === D.mapObj); //false
    console.log(C.setObj === D.setObj);//false
    console.log(C.parents === D.parents);//false
    console.log(C.arr === D.arr);//false
    console.log(C.reg === D.reg);//false
    console.log(C.func === D.func);//true
    console.log(C.symbol === D.symbol);//true
})(C);
// 不可遍历数据类型的深拷贝之function类型
// 原理：正则解析function，将params与函数体提取出来
(function (C) {

    function deepClone_2(target, map = new Map()) {
        // 若target为对象，则创建新的对象
        if (typeof target != "object") {
            return target
        }
        const temp = createObj(target);
        if (Object.prototype.toString.call(target) === "[object Map]") {
            target.forEach((value, key) => {
                temp.set(key, deepClone_2(value, map))
            });
            return temp
        }
        if (Object.prototype.toString.call(target) === "[object Set]") {
            target.forEach((value) => {
                temp.add(deepClone_2(value, map))
            });
            return temp
        }
        if (map.get(target)) {
            // 循环引用问题解决
            return map.get(target)
        }
        // 初始化执行的时候就已经将A放在了Map中，所以后面执行到环引用时target值就与A相等，因此map.get(target)将会返回true，结束遍历
        map.set(target, temp);
        for (const key in target) {
            temp[key] = deepClone_2(target[key], map)
        }
        return temp
    }

    const D = deepClone_2(C);
    console.log("可遍历对象的深拷贝");
    console.log(D);
    console.log(C === D); // false
    console.log(C.mapObj === D.mapObj); //false
    console.log(C.setObj === D.setObj);//false
    console.log(C.parents === D.parents);//false
    console.log(C.arr === D.arr);//false
})(C)
/**
 * @name createConstructor
 * @desc 根据对象的类型创建创建一个类型相同的对象
 * @tips 解决深拷贝动态创建Set、Map、数组等类型数据
 */
const createConstructor = target => {
    const _Constructor = target.constructor;
    return new _Constructor()
}
/**
 * @name clone
 * @desc 深拷贝数据方法
 */
const clone = (target, seenMap = new WeakMap()) => {
    // 基本数据类型数据直返回
    if (!getType(target, "Object")) return target;
    // 解决循环引用问题
    const hasObj = seenMap.get(target)
    if (hasObj) return hasObj;
    let copyObj = createConstructor(target);
    // 此处仅处理Map和Set，数组和对象会走到最下面的循环中继续递归执行返回
    if (getType(target, "Map")) {
        target.forEach((value, key) => {
            copyObj.set(key, clone(value, seenMap))
        })
        return copyObj;
    }
    if (getType(target, "Set")) {
        target.forEach(value => {
            copyObj.add(clone(value, seenMap))
        })
        return copyObj
    }
    seenMap.set(target, copyObj);
    const keysArr = Object.keys(target);
    keysArr.forEach(item => {
        const currentValue = target[item]
        if (getType(currentValue, "Object")) {
            copyObj[item] = currentValue
        } else if (getType(currentValue, "Function")) {
            copyObj[item] = copyFunction(currentValue)
        } else {
            copyObj[item] = clone(currentValue, seenMap)
        }
    })
    return copyObj;
}

/**
 * @name 拷贝函数
 * @param fn
 */
const copyFunction = fn => {
    if (fn.prototype) {
        const fnString = fn.toString();
        const paramsReg = /(?<=\().+(?=\)\s{0,}{)/;
        const bodyReg = /(?<=\)\s{0,}{)(.|\n)+(?=})/m;
        const paramString = paramsReg.exec(fnString);
        const body = bodyReg.exec(fnString);
        if (!body[0]) return null;
        if (!paramString) return new Function(body[0]);
        const paramsArr = paramString.split(",");
        return new Function(...paramsArr, body[0])
    } else {
        // 箭头函数
        return eval(fn)
    }
}

