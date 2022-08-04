/**
 * @title jsonp跨域实现
 * @description 1、jsonp跨域方式需要前后端配合才能使用，后端需要解析传输到后端的callback并将其再拼接返回给前端
 *              2、前端接用script标签实现，这是由于script标签不会产生跨域
 *              3、jsonp方式一般只适用于get提交方式，jsonp虽然可以实现post请求，但是比较繁琐复杂
 *              4、请求需要做超时设置
 */
// $.ajax({
//     url:"//127.0.0.1:8000/list",
//     methods:"get",
//     dataType:"jsonp",
//     success:res=>{
//         console.log(res);
//     }
// })

/**
 * 
 * @param {url} 请求地址
 * @param {method} 请求方式
 * @param {success} 请求成功回调函数
 * @param {error} 请求失败回调函数 
 * @param {timeOut} 超时时间设置 
 */
function jsonpTest(option) {
    // 创建script标签
    const script = document.createElement("script");
    // 生成随机的回调函数名，防止缓存
    const reqNo = Math.floor(Math.random() * 100000000);
    const callbackName = "jsonpCallback" + reqNo;
    if (typeof option.success == "function") {
        window[callbackName] = option.success;
    }
    // 设置超时时间
    const timeOut = option.timeOut || 3000;
    let timer = null;
    const _this = this;
    if (timeOut) {
        timer = setTimeout(() => {
            cleanUp();
            window[callbackName].call(this, new Error("超时了"));
            // 重置jsonp回调函数为一个空函数，利用空函数做一个假的取消请求，此时即使请求成功也仍然执行空函数
            window[callbackName]=function(){}
        }, timeOut);
    }
    // 删除节点、清空定时器
    function cleanUp() {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        if (timer) {
            clearTimeout(timer)
        }
    }
    script.onerror=function(e){
         option.error.call(this,e.type);
    }
    let url = option.url + (option.url.indexOf("?") > -1 ? "&" : "?") + "callback=" + callbackName;
    url.replace("?&", "?")
    script.src = url;
    document.body.appendChild(script);
}
jsonpTest({
    url: "//127.0.0.1:8000/list",
    success: function (res) {
        console.log(res);
    },
    error: function (err) {
        console.log("err", err);
    }
})