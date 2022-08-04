/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("/**\r\n * 1、创建request请求，即XHR对象\r\n *    ——创建XHR对象时，是具有兼容性问题的，在早期的ie浏览器（ie7以前版本）里是不支持XMLHttpRequest的，它支持一个叫ActiveXObject的构造函数来创建请求\r\n */\r\nfunction createXHR() {\r\n    if (XMLHttpRequest) {\r\n        return new XMLHttpRequest();\r\n    } else if (ActiveXObject) {\r\n        if (typeof arguments.callee.activeXString != string) {\r\n            const versons = [\"MSXML2.XMLHTTP.6.0\", \"MSXML2.XMLHTTP.3.0\", \"MSXML2.XMLHTTP\"];\r\n            let i = 0;\r\n            let len = 0;\r\n            for (i = 0, len = versons.length; i < len; i++) {\r\n                try {\r\n                    new ActiveXObject(versons[i]);\r\n                    arguments.callee.activeXString = versons[i];\r\n                    break;\r\n                } catch (e) {\r\n                    console.log(e);\r\n                }\r\n            }\r\n            return new ActiveXObject(arguments.callee.activeXString)\r\n        }\r\n    }\r\n    else {\r\n        throw new Error(\"No XMR Object avaliable\")\r\n    }\r\n}\r\nconst xhr = createXHR();\r\n\r\n/**\r\n * 2、使用XHR\r\n *    ——2.1、调用open(请求方式,url,是否使用异步)，，open方法并不会发送真正的请求，而是启动一个请求以备发送\r\n *    ——2.2、调用send(),send必须接受一个参数（作为请求主体发送的数据，如果不需要请求主题发送数据，则必须传入null）\r\n *    ——2.3、send方法是一个同步方法，send后面的程序会等到send执行完才开始执行\r\n *    ——2.4、send结束后，xhr对象将会收到响应并将响应数据填充到xhr对象中，响应数据简介如下：\r\n *           ——responseText：作为响应主题被返回的文本\r\n *           ——responseXML：如果响应的内容类型是“text/xml”或“application/xml”，这个属性将保存响应数据的XML DOM文档\r\n *           ——status：响应的HTTP状态\r\n *           ——statusText：HTTP状态的说明\r\n *    ——2.5、收到响应后检查status状态，以200作为成功标志，此时服务器响应的数据都已经就绪，响应数据均可访问，此外，状态吗为304表示请求资源未被修改，\r\n *           可以使用浏览器中缓存的版本，这也意味着304响应是有效的\r\n *    ——2.6、回到2.3，使用同步方式请求我们能够得到响应数据，但是同步请求总是不太好的，会降低用户体验，使用异步总会带来一些更好的效果，\r\n *           因此，xhr提供了一个属性来帮助我们完成异步操作\r\n *    ——2.7、借助readyState属性，我们能够达成异步操作，监听readyState，当readyState发生变化将会触发onreadystatechange事件，readyState具有以下值：\r\n *           0：未初始化，尚未调用open()方法；\r\n *           1：启动，已经调用open方法，但尚未调用send方法\r\n *           2：已调用send方法，但尚未收到响应\r\n *           3：已经接收到部分响应数据\r\n *           4：已经接收到全部响应数据，而且已经可以在客户端使用了\r\n *           *：onreadystatechange事件要放到open方法前面，保证浏览器的兼容性\r\n *    ——2.8、在响应前可以调用abort方法取消异步请求 ————————待尝试\r\n *           ——调用该方法后，xhr会停止触发onreadystatechange事件，而且不再允许访问与响应相关的属性\r\n *    ——2.9、设置请求头，前端设置请求头须在open之后send之前\r\n *    ——2.10、超时设置，XMLHttpRequest实例有一个timeout属性，为timeout赋值即可指定请求的超时时间，并且还具有一个超时回调函数ontimeout\r\n */\r\nxhr.onreadystatechange = function () {\r\n    if (xhr.readyState == 4) {\r\n        // 如果不需要异步发送请求可以注释onreadystatechange事件，将下方的条件语句放到send后面即可完成同步请求\r\n        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {\r\n            console.log(\"success\");\r\n        } else {\r\n            console.log(\"fail\");\r\n        }\r\n        \r\n    } \r\n    \r\n};\r\nxhr.open(\"get\", \"//127.0.0.1:8000/list\", false);\r\nxhr.timeout = 5000;\r\nxhr.ontimeout = function (){\r\n    console.log(\"请求超时，取消请求\");\r\n    xhr.abort()\r\n}\r\nxhr.send(null);\r\nconsole.log(xhr);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;