const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "js/boundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        port: 3001,
        hot: true,
        open: true,
        // 设置跨域代理,本地只用于开发环境,生产环境需使用node做中间层处理
        proxy: {
            "/": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
            filename: "index.html"
        })
    ]
}