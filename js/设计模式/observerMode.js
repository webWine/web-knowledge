/**
 * @title 观察者模式
 * @description 观察者观察被观察者，当被观察者发生改变时通知观察者,观察者根据被观察者传递的消息发起操作
 */

// 以对象值变化为例
/**
 * 观察者
 */
class Observer {
    constructor(identity) {
        this.identity = identity
    }
    /**
     * 观察者需要定义好自己的反应信息
     */
    importentInfo(name) {
        console.log(name + " " + this.identity+",您好，你的孩子名字发生变化啦");
    }
}

/**
 * 被观察者
 */
class Observered {
    constructor() {
        this.name = '';
        this.observerArr = [];
    }
    setValue(name) {
        this.name = name;
        this.notice();
    }
    /**
     * 添加观察者,观察者可能有多个
     */
    addObserver(observer) {
        this.observerArr.push(observer)
    }
    /**
     * 通知被观察者
     */
    notice() {
        this.observerArr.forEach(item => {
            item.importentInfo(this.name)
        })
    }
}
const observered = new Observered();
observered.addObserver(new Observer("老师"))
observered.addObserver(new Observer("妈妈"))
observered.addObserver(new Observer("爸爸"))
observered.setValue("杨书安")
