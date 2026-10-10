# 客户端：dsb 命令行与结构化留档

`dsb` 是 Go 实现的命令行客户端，负责参数解析、HTTP 调用、退出码和 UTF-8 留档。浏览器操作由服务端执行。安装、多目标和后端管理见 [客户端安装与管理](./37.md)，可靠采集见 [上下文与证据](./38.md)。本章提供当前可执行入口，不依赖已经移除的 Python 客户端。

## 1. 常用命令

```powershell
dsb methods
dsb --port 10049 health
dsb --port 10049 --id 1001 start --browser chrome --headful
dsb --port 10049 --id 1001 run go_to_url -p url=https://example.com --out navigation.json
dsb --port 10049 --id 1001 state --text-only
dsb --port 10049 --id 1001 close
```

1001 为数字示例 ID，使用前确认没有被占用。同一任务复用 ID，结束时只关闭自己的任务。`methods` 是 CLI 子命令，`list_methods` 是协议方法，也可通过 `dsb run list_methods` 调用；不能写成 `dsb list_methods`。

### 选择浏览器 profile

```powershell
dsb profiles
dsb profile list
dsb profile clone --name litongjava --source-user-data-dir "<Chrome User Data>" --source-profile-directory Default
dsb --id 1001 start --browser chrome --headful --profile litongjava
# 或选择现有独立目录，不与 --profile 混用
dsb --id 1001 start --browser chrome --headful --user-data-dir "<独立 User Data>" --profile-directory "Profile 5"
```

以上两种 `start` 是替代方案，不要连续执行来尝试切换正在运行的共享浏览器。显式 profile 只支持 Chrome；未传浏览器或传 `auto` 也选择 Chrome。未知名称、路径错误与启动失败不回退。先查看任务，只关闭自己的任务，不能为换 profile 关闭别人的页签。字段契约与离线克隆限制见 [profile 列表、克隆与选择](./39.md)。

## 2. 复杂参数放入文件

保存 `params.json`：

```json
{"selector":"#display-name","text":"示例用户","mode":"type"}
```

```powershell
dsb --id 1001 run input_text_by_selector --params "@params.json"
dsb --id 1001 js "@collect.js" --out collected.json
```

参数文件也支持带 method、params 的完整请求体，由客户端提取 params。中文、多行 JavaScript 和复杂选择器优先使用文件，避免多层引号转义。

## 3. 输出模式与退出码

| 选项 | 用途 |
| --- | --- |
| --summary / --compact | 简化终端摘要 |
| --json | 输出 JSON |
| --select data.fields | 只投影一个字段路径，支持点分隔和数字数组下标 |
| --out response.json | 保存完整 UTF-8 JSON 响应，优先于终端投影 |
| --grep 关键词 | 只展示匹配行；可同时保存完整响应 |
| --response-mode compact | 请求服务端裁剪回执，与终端摘要不是一回事 |

退出码：0 成功，1 传输或协议错误，2 业务失败，3 客户端用法或输出处理错误。不要只凭退出码推断动作没有执行。响应字段缺失是在收到回执后才能判断的；应读取留档或 `dsb last`，不要重复发送业务动作。

`--select` 不执行表达式，不支持逗号分隔多字段。需要多个字段，先保存完整响应再处理。选择路径缺失时默认输出 null 并报错；值明确为 JSON null 则是有效选择。宽松兼容模式见 [单路径选择与防重复执行](./37.md)。

客户端 `--out` 直接写 UTF-8；不要用 shell 的 `> 文件` 代替，也不要把 stderr 混进 JSON。优先用宿主文本读取工具读文件，不从终端摘要里截取大括号猜测 JSON。

## 4. 批量与异步

保存 `commands.json`：

```json
[
  {"get_title": {}},
  {"get_url": {}}
]
```

```powershell
dsb --id 1001 batch commands.json
dsb --id 1001 batch commands.json --async --wait
```

默认发生动作错误后停止，只有独立且可以继续的步骤才使用 `--keep-going`。HTTP 超时不表示动作未执行；异步作业复用返回的 jobId 查询，不重新提交。详见 [批量与作业](./26.md)。

## 5. 留档与复核

每次调用保存请求与响应；读取自己当前会话的文件，避免混淆不同任务。终端投影不改变完整留档。

```text
logs/agent/<会话>/001.req.json
logs/agent/<会话>/001.res.json
logs/agent/<会话>/steps.log
```

留档可能包含页面原文和敏感数据，不公开整份 Cookie、账号信息或凭据。模型只读到截断预览时，不能声称阅读了全部响应；采集数、展示数、已读数和有效样本数分别统计。

## 6. PowerShell 集成

PowerShell 可以直接调用同一个 dsb，无须另写 HTTP 封装。每条依赖命令完成后检查原生进程退出码，并保留 stderr 诊断：

```powershell
dsb --id 1001 state --out state.json
if ($LASTEXITCODE -ne 0) {
  throw "Read the response and diagnostics before continuing"
}
```

不要使用 `Select-Object -First` 提前关闭 dsb 的输出管道；需要少量字段时优先用 `--select`，需要保存时使用 `--out`。旧的 Python Client 类和包装脚本不再作为当前工程集成入口。
