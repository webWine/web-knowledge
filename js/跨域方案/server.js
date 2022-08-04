const express = require("express");
const app = express();
app.listen(8000, _ => {
    console.log("服务器启动成功");
})
// CORS(跨域资源共享方案)
// app.all('*', function (req, res, next) {
//     // 上面的 * 表示所有请求都会加上跨域设置
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     next();
// });
app.get("/jsonp", (req, res) => {
    console.log("req", req.query);
    let {
        callback
    } = req.query;
    const data = {
        responseCode: "0000",
        message: "跨域接口请求成功"
    }
    // jsonp配合代码
    res.send(`${callback}(${JSON.stringify(data)})`)
})
app.get("/ordinary", (request, response) => {
    const data = {
        responseCode: "0000",
        message: "普通接口"
    };
    response.send(JSON.stringify(data))
})
app.get("/timeout", (request, response) => {
    const data = {
        responseCode: "0000",
        message: "超时接口"
    };
    setTimeout(() => {
        response.send(JSON.stringify(data))
    }, 7000)
})
app.post("/post-test", (request, response) => {
    const data = {
        responseCode: "0000",
        message: "post请求成功"
    };
    response.send(JSON.stringify(data))
})