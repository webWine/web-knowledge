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
        port: 3000,
        hot: true,
        open: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,"index.html"),
            filename:"index.html"
        })
    ]
}