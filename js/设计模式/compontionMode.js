/**
 * @title 组合模式
 * @description 通过一个大的类去控制一个个小类，本质上是将需要的小类动态添加到大的控制类中，通过控制类统一处理各小类
 * @principle
 */
class Controller {
    constructor(name){
        this.name = name;
        this.componseArr = [];
    }

    /**
     * 添加各小类方法
     */
    add(fun){
        this.componseArr.push(fun) 
    }
    /**
     * 初始化方法
     */
    init(){
        console.log("Controller开始执行");
        this.componseArr.forEach((item,index)=>{
            item.init.apply(this)
        })  
    }
}

// 各小类，以人的活动为例，起床——洗漱——上班
/**
 * 起床
 */
class GetUp{
    constructor(){}
    init(){
        console.log(this.name + "要起床了");
    }
}
/**
 * 洗漱
 */
class WashUp{
    constructor(){}
    init(){
        console.log(this.name + "要洗漱了");
    }
}
/**
 * 洗漱
 */
 class Work{
    constructor(){}
    init(){
        console.log(this.name + "要上班了");
    }
}
const controller = new Controller("杨书安");
controller.add(new GetUp())
controller.add(new WashUp)
controller.add(new Work)
controller.init();