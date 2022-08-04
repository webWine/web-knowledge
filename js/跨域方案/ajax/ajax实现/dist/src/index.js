/**
 * 1、创建request请求，即XHR对象
 *    ——创建XHR对象时，是具有兼容性问题的，在早期的ie浏览器（ie7以前版本）里是不支持XMLHttpRequest的，它支持一个叫ActiveXObject的构造函数来创建请求
 */
function createXHR() {
    if (XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (ActiveXObject) {
        if (typeof arguments.callee.activeXString != string) {
            const versons = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP"];
            let i = 0;
            let len = 0;
            for (i = 0, len = versons.length; i < len; i++) {
                try {
                    new ActiveXObject(versons[i]);
                    arguments.callee.activeXString = versons[i];
                    break;
                } catch (e) {
                    console.log(e);
                }
            }
            return new ActiveXObject(arguments.callee.activeXString)
        }
    } else {
        throw new Error("No XMR Object avaliable")
    }
}
const xhr = createXHR();

/**
 * 2、使用XHR
 *    ——2.1、调用open(请求方式,url,是否使用异步)，，open方法并不会发送真正的请求，而是启动一个请求以备发送
 *    ——2.2、调用send(),send必须接受一个参数（作为请求主体发送的数据，如果不需要请求主题发送数据，则必须传入null）
 *    ——2.3、send方法是一个同步方法，send后面的程序会等到send执行完才开始执行
 *    ——2.4、send结束后，xhr对象将会收到响应并将响应数据填充到xhr对象中，响应数据简介如下：
 *           ——responseText：作为响应主题被返回的文本
 *           ——responseXML：如果响应的内容类型是“text/xml”或“application/xml”，这个属性将保存响应数据的XML DOM文档
 *           ——status：响应的HTTP状态
 *           ——statusText：HTTP状态的说明
 *    ——2.5、收到响应后检查status状态，以200作为成功标志，此时服务器响应的数据都已经就绪，响应数据均可访问，此外，状态吗为304表示请求资源未被修改，
 *           可以使用浏览器中缓存的版本，这也意味着304响应是有效的
 *    ——2.6、回到2.3，使用同步方式请求我们能够得到响应数据，但是同步请求总是不太好的，会降低用户体验，使用异步总会带来一些更好的效果，
 *           因此，xhr提供了一个属性来帮助我们完成异步操作
 *    ——2.7、借助readyState属性，我们能够达成异步操作，监听readyState，当readyState发生变化将会触发onreadystatechange事件，readyState具有以下值：
 *           0：未初始化，尚未调用open()方法；
 *           1：启动，已经调用open方法，但尚未调用send方法
 *           2：已调用send方法，但尚未收到响应
 *           3：已经接收到部分响应数据
 *           4：已经接收到全部响应数据，而且已经可以在客户端使用了
 *           *：onreadystatechange事件要放到open方法前面，保证浏览器的兼容性
 *    ——2.8、在响应前可以调用abort方法取消异步请求 ————————待尝试
 *           ——调用该方法后，xhr会停止触发onreadystatechange事件，而且不再允许访问与响应相关的属性
 *    ——2.9、设置请求头，前端设置请求头须在open之后send之前
 *    ——2.10、超时设置，XMLHttpRequest实例有一个timeout属性，为timeout赋值即可指定请求的超时时间，并且还具有一个超时回调函数ontimeout
 *    ——2.11、网络异常,XMLHttpRequest实例的onerror方法可以监听网络异常
 */
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        // 如果不需要异步发送请求可以注释onreadystatechange事件，将下方的条件语句放到send后面即可完成同步请求
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            console.log("success");
            // 返回的response是一个字符串,但是一般来说我们需要的是一个json数据,因此这里我们可以通过json.parse转换,也可以通过请求头设置来更改response结果的类型
            console.log(xhr.response);
        } else {
            console.log("fail");
        }

    }

};
xhr.responseType = "json"
xhr.open("get", "//127.0.0.1:8000/ordinary", true);
// 设置超时时应将请求置为异步请求
xhr.timeout = 5000;
xhr.ontimeout = function () {
    console.log("请求超时，取消请求");
    xhr.abort()
};
xhr.onerror = function () {
    console.log("网络异常,请重试");
}
xhr.send(null);



//
/**
 * 封装一个ajax请求
 * @param {url} 请求地址
 * @param {method} 请求方式，默认为get
 * @param {params} 请求参数
 * @param {timeout} 超时时间
 * @param {isAsync} 是否异步，默认异步
 * */
function ajaxRequest(option) {
    let {
        method = "get",
            url,
            params,
            timeout = 5000,
            isAsync = true
    } = option
    return new Promise((resolve, reject) => {
        const xhr = new createXHR();
        xhr.responseType = "json";
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response)
                } else {
                    reject(new Error("请求失败"))
                }
            }
        };

        if (method == "get") {
            if (url.indexOf("?") > -1) {
                url = "&" + handleParam(params);
            } else {
                url = "?" + handleParam(params);
            }
        }
        xhr.open(method, url, isAsync);
        xhr.timeout = timeout;
        xhr.ontimeout = () => {
            reject(new Error("请求超时"))
        }
        xhr.onerror = () => {
            reject(new Error("网络异常"))
        };
        if (method == "post") {
            // post具有参数时需要设置请求头来指定post参数格式
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(handleParam(params))
    })
}

function handleParam(params) {
    let result = ""
    if (!params) {
        return
    } else {
        for (const key in params) {
            result += ("&" + key + "=" + params[key])
        }
    }
    result = result.substring(1);
    return result
}

// 测试
function test() {
    return new Promise((resolve, reject) => {
        ajaxRequest({
            params: {
                admin: "ysa",
                password: "123456"
            },
            method: "post",
            timeout: 2000,
            url: "//127.0.0.1:8000/post-test"
        }).then((res) => {
            console.log("——————测试请求——————");
            console.log(res);
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
test()