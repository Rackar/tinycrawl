# 爬虫

## 介绍

node.js 下的小爬虫，用到了简单的几个库。可写入 json 或 mongodb，可配置 sock5 代理。

## 运行参数

- 是否写入 mongodb

  `-noDB` 启动时加上则不写入 db

- 是否写入 JSON

  `-noJSON` 启动时加上则不写入 json

- 是否使用本地 7070 代理

  `-useProxy` 启动时加上则开启本地 sock5 7070 端口代理

## 调试时设置参数

调试时需要修改./vscode/launch.json，将参数加入 args 数组。如：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "program": "${workspaceFolder}\\index.js",
      "args": ["-useProxy"]
    }
  ]
}
```

## 小工具

utils 里面有 3 个小工具，一个 await 延时，一个格式化日期，一个去处 js 对象 key 中的'.'(无法写入 mongo)
