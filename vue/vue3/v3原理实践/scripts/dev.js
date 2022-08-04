const minimist = require("minimist");
const {resolve} = require('path')
const { build } = require("esbuild")
// 获取命令行参数
const params = minimist(process.argv.slice(2)) // node scripts/dev.js reactivity -f global 


// 打包目标
const target = params._[0] || 'reactivity';
const format = params.f || "global";

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
// iife 立即执行函数 
// cjs node中的模块 module.exports
// esm 浏览器中的esModule模块  import {ref} from "vue"
const outputFormat = format.startsWith('global') ? 'iife' : format === "cjs" ? "cjs" : 'esm'
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)
const entryFile = resolve(__dirname, `../packages/${target}/src/index.ts`)

build({
  entryPoints: [entryFile],
  outfile,
  bundle: true, // 所有的包打包到一起
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions.name,
  platform: format == "cjs" ? 'node' : "browser",
  watch: {
    onRebuild(error) {
      if (!error) {
        console.log("rebuilt")
      }
    }
  }
}).then(() => {
  console.log("watching");
})