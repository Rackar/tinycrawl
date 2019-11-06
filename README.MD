# 爬虫

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
