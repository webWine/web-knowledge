const express = require("express");
const app = express();
app.listen(1002, _ => {
  console.log("服务器启动成功");
})
app.use(express.static("./"))