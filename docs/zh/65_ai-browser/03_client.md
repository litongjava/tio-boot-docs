# 客户端：dsb 命令行、Python 与 PowerShell

完成 [第一个任务](./03.md) 后，可以选择命令行、Python 库或 PowerShell 客户端接入同一个 HTTP 服务。客户端负责组装请求、处理响应和本地留档；真正的浏览器操作仍由 Java 服务执行。

## 1. 客户端入口与运行目录

| 入口 | 适用场景 |
| --- | --- |
| client/dsb.py | 跨平台命令行和 Python 程序，使用标准库 |
| client/dsb.cmd | Windows 包装，委托给 Python 客户端 |
| client/dsb | Linux/macOS 包装 |
| scripts/trace/browse.ps1 | PowerShell 中发送 JSON、筛选结果与留档 |

下面的命令都从项目根目录执行。Windows PowerShell 调用包装脚本时使用 .\\client\\dsb.cmd；参数含 &、^ 或 % 等字符时，优先通过 JSON 文件传递，避免包装层解释特殊字符。

## 2. 常用命令行调用

```shell
python client/dsb.py --port 10049 health
python client/dsb.py methods click
python client/dsb.py --id 1001 start --headful
python client/dsb.py --id 1001 run go_to_url -p url=https://example.com
python client/dsb.py --id 1001 state --full
python client/dsb.py --id 1001 run get_form_state --select data.fields
python client/dsb.py --id 1001 close
```

1001 是教学任务 ID，使用前先确认未被占用。--base-url、--host、--port 指定服务位置；命令行配置优先于客户端环境配置，再使用默认值。环境配置包含 DSB_BASE_URL、DSB_HOST、DSB_PORT、DSB_TASK_ID、DSB_SESSION 等。

### 参数较复杂时使用文件

保存 params.json：

```json
{"selector":"#display-name","text":"示例用户","mode":"type"}
```

在已有任务中调用：

```shell
python client/dsb.py --id 1001 run input_text_by_selector --params @params.json
```

-p k=v 由客户端解析常见数字、布尔和 JSON 值。复杂对象、中文脚本或多行文本适合放在文件中。

参数文件里写**整个请求体**也可以：文件内容为 `{"id":1001,"method":"request_human_input","params":{…}}` 时，客户端按 `method` 字段识别，只取 `params` 那一层再发送。留档文件、文档示例、别人贴过来的载荷都可以原样存下来直接使用。`batch` 同样认三种写法：纯数组、`{"commands":[…]}`、整个请求体。

### 三种“精简”不是一回事

| 选项 | 行为 |
| --- | --- |
| --summary / --compact | 精简本地终端输出，不会改变服务端请求 |
| --response-mode compact | 在请求信封设置 responseMode，让服务裁剪响应 |
| --select data.fields | 在客户端按字段路径投影结果 |

--diagnostics 与 responseMode 同属请求信封，不放在 params 内。需要完整回执时使用 --json，并按任务需要选择字段。

--select 对**失败响应同样生效**：批量回执里只要有一步失败、整批 `ok` 就是 false，但 `data.results` 依然完整返回，因此 `--select data.results.N.…` 正是「只看失败那一步」的用法。只有路径确实不存在时（例如单条命令没有 data.results）才退回打印整封，并在 stderr 说明。

## 3. 批量执行与异步查询

保存 commands.json：

```json
[
  {"get_title": {}},
  {"get_url": {}}
]
```

```shell
python client/dsb.py --id 1001 batch commands.json
python client/dsb.py --id 1001 batch commands.json --async --wait
```

CLI 默认遇到动作失败停止，--keep-going 允许继续；断言停止由 --stop-on-expect-failure 单独控制。Python Client.batch 的 stop_on_error 默认值是 false，业务代码应显式传入，不能把 CLI 默认值套用到库调用。

异步提交返回 jobId，后续用 job 查询。HTTP 超时不等于动作未执行，尤其不要自动重新发送提交类批次。完整语义见 [批量与作业](./26.md)。

## 4. 在 Python 程序中使用

下面示例可保存为项目根目录的 browser_client_example.py。只有 start 成功后才进入 finally 关闭自己的任务，避免启动失败时关闭已被其他任务占用的教学 ID。

```python
import sys
sys.path.insert(0, "client")
from dsb import Client, TransportError

def require_ok(response):
    if not 200 <= response.status < 300 or not response.ok:
        raise RuntimeError(response.msg or str(response.data))
    return response.data

def main():
    client = Client(port=10049, task_id=1001, session="tutorial")
    require_ok(client.start(headless=True))
    try:
        require_ok(client.command("go_to_url", {"url": "https://example.com"}))
        state = require_ok(client.command("get_browser_state", {}))
        print(state.get("text", ""))
        result = client.batch(
            [{"get_title": {}}, {"get_url": {}}],
            stop_on_error=True)
        print(require_ok(result))
        job = require_ok(client.batch(
            [{"get_title": {}}], asynchronous=True, stop_on_error=True))
        completed = client.wait_job(job["jobId"])
        job_data = require_ok(completed)
        if job_data.get("status") != "done":
            raise RuntimeError("异步作业未成功完成：" + str(job_data))
        print(job_data)
    finally:
        closed = client.close()
        if not closed.ok:
            print("任务关闭失败：", closed.msg, file=sys.stderr)

if __name__ == "__main__":
    try:
        main()
    except TransportError as error:
        print("传输失败，请核对服务和任务状态：", error, file=sys.stderr)
        raise SystemExit(1)
```

Client.command 的业务失败不抛异常，调用方检查 response.ok、msg、data；连接失败、超时和无法解析的响应抛 TransportError。Client.wait_job 返回 Response 对象，应通过 completed.data 读取作业状态和逐步结果，不能把它当成字典，也不能把“轮询结束”当作任务成功。

## 5. 上传和页面脚本

```shell
python client/dsb.py upload data/sample.txt
python client/dsb.py --id 1001 js @scripts/page-title.js
python client/dsb.py --id 1001 js @scripts/page-title.js --retry-on-spurious
```

upload 将本地文件暂存到服务端；它本身不会选择网页里的文件输入框。读取返回的 path 后，再调用 upload_file，参数见 [文件操作](./22.md)。js 通过 execute_js 执行页面脚本，读取与修改页面的脚本应按任务需要区分，不能对修改操作盲目重试。

--retry-on-spurious 对应服务端的 retryOnSpurious（见[防重复提交](./08.md)与 [JavaScript 执行](./21.md)）：撞上事件泵投递的对象释放异常时，由服务端自动重发一次。`js` 与 `run` 两个子命令都有这个开关 —— `js` 用于只读脚本，`run` 用于任何命令（包含动作类）。**动作类要先确认上一次没生效再加**：重发可能等于重复提交；服务端的默认行为是动作类一次都不重发，只有带上这个开关才放行。

## 6. PowerShell 客户端

保存 request.json：

```json
{"id":1001,"method":"get_title","params":{}}
```

```powershell
pwsh scripts/trace/browse.ps1 -Health -Port 10049
pwsh scripts/trace/browse.ps1 -PayloadFile request.json -Session tutorial -Json
pwsh scripts/trace/browse.ps1 -Last -Session tutorial -Json
```

-Last 读取本会话上一次保存的响应，不重新发送浏览器命令。-PayloadJson 适合短 JSON，复杂请求使用 -PayloadFile；-TimeoutSec 设置 HTTP 超时。

Python 客户端默认对终端输出和留档脱敏；PowerShell 客户端默认只对落盘内容脱敏，终端仍显示原文。二者共享操作协议，但输出与脱敏行为不同。

## 7. 日志、退出码与调用链

Python 默认在 logs/agent/会话名 下写入编号 req.json、res.json 和 steps.log。编号接续已有记录；--no-record 可关闭留档。脱敏是按规则处理，截图和未知敏感字段仍需另行检查。

| CLI 退出码 | 含义 |
| --- | --- |
| 0 | 调用成功 |
| 1 | 传输或响应协议错误 |
| 2 | 业务失败 |
| 3 | 参数用法错误 |

```text
CLI 参数或 Python 方法调用
  → Client.command 组装 id / method / params
  → Client.request 发送 HTTP、解码、解析 JSON
  → Response 提供 ok / msg / data
  → Client._record 保存请求和响应
  → Printer 或调用程序展示结果
```

下面给出当前客户端实现。它们是现有模块中的方法，依赖同文件的辅助函数；直接使用仓库中的完整客户端，不需要自行拼接这些片段。

## 源码：HTTP 传输与 JSON 解码

HTTP 错误响应仍尝试读取 JSON；网络失败与非 JSON 响应转为 TransportError。

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def request(self, path: str, *, method: str = "GET", body: bytes | None = None,
                content_type: str | None = None, query: dict | None = None,
                timeout: float | None = None) -> Response:
        url = self._url(path)
        if query:
            url = url + "?" + urllib.parse.urlencode({k: v for k, v in query.items() if v is not None})
        headers = {"Accept": "application/json", "User-Agent": f"dsb/{__version__}"}
        if content_type:
            headers["Content-Type"] = content_type
        if body is not None and content_type is None:
            headers["Content-Type"] = "application/octet-stream"
        request = urllib.request.Request(url, data=body, headers=headers, method=method)
        started = time.time()
        try:
            with urllib.request.urlopen(request, timeout=timeout or self.timeout) as response:
                raw = response.read()
                status = response.status
                encoding = response.headers.get("Content-Encoding", "")
        except urllib.error.HTTPError as error:  # 服务端自己回了 4xx/5xx
            raw = error.read()
            status = error.code
            encoding = error.headers.get("Content-Encoding", "") if error.headers else ""
        except urllib.error.URLError as error:
            raise TransportError(f"连不上 {url}:{error.reason}(服务起了吗?地址对吗?)") from None
        except TimeoutError:
            raise TransportError(f"请求超时 {url}(超过 {timeout or self.timeout:.0f} 秒)") from None
        elapsed_ms = int((time.time() - started) * 1000)

        text = _decode_body(raw, encoding)
        try:
            envelope = json.loads(text)
        except ValueError:
            raise TransportError(
                f"响应不是合法 JSON({url},HTTP {status},耗时 {elapsed_ms}ms):{text[:300]}") from None
        if not isinstance(envelope, dict):
            raise TransportError(f"响应不是 JSON 对象({url}):{text[:200]}")
        return Response(url, status, envelope, text, elapsed_ms)
```

## 源码：统一命令封装

信封级字段与 params 分开设置，成功和传输失败都进入留档流程。

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def command(self, method: str, params: dict | None = None, *, task_id: int | str | None = None,
                timeout: float | None = None, label: str | None = None) -> Response:
        """发一条命令。失败(业务失败)不抛异常,由调用方看 `ok`;传输失败抛 TransportError。"""
        payload = {"id": _as_task_id(task_id if task_id is not None else self.task_id),
                   "method": method, "params": params or {}}
        # responseMode / diagnostics 是**信封级**字段(与 method/params 平级),不是 params 里的东西
        if self.response_mode:
            payload["responseMode"] = self.response_mode
        if self.diagnostics:
            payload["diagnostics"] = True
        try:
            response = self.request(PATH_COMMAND, method="POST", body=_json_bytes(payload),
                                    content_type="application/json", timeout=timeout)
        except TransportError as error:
            self._record(label or method, payload, None, str(error))
            raise
        self.last_response = response
        self._record(label or method, payload, response)
        return response
```

## 源码：批量参数封装

注意库调用的 stop_on_error 默认值，以及 async 如何进入服务端参数。

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def batch(self, commands: list, *, stop_on_error: bool = False, stop_on_expect_failure: bool = False,
              asynchronous: bool = False, max_duration_ms: int | None = None,
              timeout: float | None = None, task_id: int | str | None = None) -> Response:
        """跑一批命令。`asynchronous=True` 时立刻返回 jobId(不占用 HTTP 超时)。"""
        params: dict = {"commands": commands, "stopOnError": stop_on_error}
        if stop_on_expect_failure:
            params["stopOnExpectFailure"] = True
        if asynchronous:
            params["async"] = True
        if max_duration_ms:
            params["maxDurationMs"] = max_duration_ms
        return self.command("commands", params, task_id=task_id, timeout=timeout, label="commands")
```

## 源码：轮询异步作业

按 jobId 查询，不重复提交原命令；终态内容仍需由业务代码核验。

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def wait_job(self, job_id: str, *, poll: float = 1.0, timeout: float = 600.0,
                 on_tick=None) -> Response:
        """轮询异步任务直到结束(running 之外的状态都算结束)"""
        deadline = time.time() + timeout
        last = None
        while True:
            last = self.job(job_id)
            status = (last.data or {}).get("status") if isinstance(last.data, dict) else None
            if on_tick:
                on_tick(last)
            if status and status != "running":
                return last
            if time.time() >= deadline:
                raise TransportError(f"等任务 {job_id} 超时(超过 {timeout:.0f} 秒,最后状态 {status})")
            time.sleep(poll)
```

## 源码：请求和响应留档

先脱敏再保存，日志文件写入失败不改变浏览器动作结果。

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def _record(self, label: str, payload, response: Response | None, error: str | None = None) -> None:
        """把这一次调用落盘:NNN.req.json / NNN.res.json + 一行 steps.log"""
        if not self.record:
            return
        index = self.counter
        self.counter += 1
        try:
            self.record_dir.mkdir(parents=True, exist_ok=True)
            request_text = json.dumps(self._mask(payload), ensure_ascii=False, indent=2)
            (self.record_dir / f"{index:03d}.req.json").write_text(request_text, encoding="utf-8")
            if response is not None:
                response_text = json.dumps(self._mask(response.envelope), ensure_ascii=False, indent=2)
            else:
                response_text = json.dumps({"sendFailed": True, "error": error}, ensure_ascii=False, indent=2)
            (self.record_dir / f"{index:03d}.res.json").write_text(response_text, encoding="utf-8")

            stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if response is None:
                line = f"{stamp} #{index:03d} id={self.task_id} {label} SEND-FAILED {error}"
            else:
                verdict = "OK" if response.ok else "FAIL"
                detail = _summarize(response.data)
                line = (f"{stamp} #{index:03d} id={self.task_id} {label} {verdict} "
                        f"{response.elapsed_ms}ms{detail}")
                if not response.ok:
                    line += f" msg={response.msg}"
            with (self.record_dir / "steps.log").open("a", encoding="utf-8") as handle:
                handle.write(line + "\n")
        except OSError as error_io:  # 落盘失败不该让调用失败
            if self.verbose:
                print(f"[warn] 记录失败:{error_io}", file=sys.stderr)
```

## 源码：CLI 与响应对象

命令行参数在 build_client 中组装成 Client；cmd_run 负责加载命令参数并将服务业务状态转换为退出码。Response.ok 读取响应信封里的 ok；HTTP 状态另存于 status，需要时由调用方分别检查。

::: details 展开 build_client

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def build_client(args) -> Client:
    """按「命令行 > 环境变量 > 内置默认值」的优先级拼出客户端"""
    def opt(name, fallback=None):
        value = getattr(args, name, None)
        return fallback if value is None else value

    base_url = opt("base_url") or os.environ.get("DSB_BASE_URL")
    host = opt("host") or os.environ.get("DSB_HOST") or DEFAULT_HOST
    port = opt("port") or int(os.environ.get("DSB_PORT") or DEFAULT_PORT)
    task_id = opt("id") or os.environ.get("DSB_TASK_ID") or DEFAULT_TASK_ID
    session = None if getattr(args, "no_record", False) else (
        opt("session") or os.environ.get("DSB_SESSION") or DEFAULT_SESSION)
    patterns = tuple(opt("redact_pattern", ()) or ())
    env_patterns = os.environ.get("DSB_REDACT")
    if env_patterns:
        patterns += tuple(part for part in re.split(r"[,;]", env_patterns) if part.strip())
    return Client(base_url=base_url, host=host, port=port, task_id=task_id,
                  timeout=opt("timeout", DEFAULT_TIMEOUT), session=session,
                  redact_enabled=not getattr(args, "no_redact", False), redact_patterns=patterns,
                  verbose=getattr(args, "verbose", False), record_dir=opt("record_dir"),
                  response_mode=getattr(args, "response_mode", None),
                  diagnostics=bool(getattr(args, "diagnostics", False)))
```

:::

::: details 展开 cmd_run

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def cmd_run(client: Client, args, out: Printer) -> int:
    params = load_payload(args.params, args.param)
    response = client.command(args.method, params)
    picked = pick_index(response.envelope, args.index) if args.index is not None else None
    out.response(response, label=args.method, payload=picked)
    return EXIT_OK if response.ok else EXIT_BUSINESS
```

:::

::: details 展开 cmd_batch

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
def cmd_batch(client: Client, args, out: Printer) -> int:
    text = read_batch_source(args.file)
    try:
        commands = json.loads(text)
    except ValueError as error:
        raise UsageError(f"批量命令不是合法 JSON:{error}") from None
    if isinstance(commands, dict) and "commands" in commands:
        commands = commands["commands"]  # 允许直接喂 {"commands":[...]} 或整个请求体
    if not isinstance(commands, list):
        raise UsageError("批量命令必须是数组,例如 [{\"get_title\":{}},{\"get_url\":{}}]")

    response = client.batch(commands, stop_on_error=not args.keep_going,
                            stop_on_expect_failure=args.stop_on_expect_failure,
                            asynchronous=args.async_mode, max_duration_ms=args.max_duration_ms)
    if args.async_mode:
        out.response(response, label="commands(async)")
        if not response.ok or not args.wait:
            return EXIT_OK if response.ok else EXIT_BUSINESS
        job_id = (response.data or {}).get("jobId")
        if not job_id:
            out.warn("服务端没有返回 jobId,无法等待")
            return EXIT_BUSINESS
        return wait_and_report(client, out, job_id, poll=args.poll, timeout=args.wait_timeout)
    out.response(response, label="commands",
                 payload=pick_index(response.envelope, args.index) if args.index is not None else None)
    return EXIT_OK if response.ok else EXIT_BUSINESS
```

:::

::: details 展开 Response

源码：`client/dsb.py`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```python
class Response:
    """一次调用的结果:服务端信封 + 本地观测信息"""

    def __init__(self, url: str, status: int, envelope: dict, raw: str, elapsed_ms: int):
        self.url = url
        self.status = status
        self.envelope = envelope
        self.raw = raw
        self.elapsed_ms = elapsed_ms

    @property
    def ok(self) -> bool:
        return bool(self.envelope.get("ok"))

    @property
    def code(self) -> int:
        return int(self.envelope.get("code") or 0)

    @property
    def msg(self) -> str:
        return self.envelope.get("msg") or ""

    @property
    def data(self):
        return self.envelope.get("data")

    def __repr__(self) -> str:  # pragma: no cover - 只为调试方便
        return f"<Response ok={self.ok} code={self.code} msg={self.msg!r} elapsed={self.elapsed_ms}ms>"
```

:::

## 源码：PowerShell 完整客户端

按 param 参数声明、JSON 读取、HTTP 请求、Write-Response 和日志写入的顺序阅读。不要将 PowerShell 的终端输出脱敏策略与 Python 客户端混为一谈。

::: details 展开 browse.ps1

源码：`scripts/trace/browse.ps1`。以下为当前实现，可放回原类中阅读；依赖同类字段和辅助方法，并非独立编译单元。

```powershell
﻿<#
.SYNOPSIS
  把一条命令发给本地浏览器服务,并把**发出去的请求**与**收回来的响应**都留档到本地。
  顺带把几件每次都要手写的小事也包进来:换端口(-Port)、只取业务结果(-Json / -Index)、
  探活(-Health)、复看上一次(-Last)。

.DESCRIPTION
  服务端自己在 logs/trace/ 下也留了一份审计(见 CommandTraceLog),这个脚本是客户端这一侧的另一半:
  它记录「我到底发了什么」(发送前就落盘,连没连上服务都能看出来),并给每次调用编一个可读的序号,
  便于按顺序复看整个过程。

  每个会话一个目录 logs/agent/<会话名>/:
    NNN.req.json    第 NNN 次调用发出去的请求体(原文)
    NNN.res.json    第 NNN 次调用收回来的响应体(原文,含整页 data.text)
    steps.log       每次调用一行:时间/序号/任务/方法/成败/耗时/关键字段

  两种「不发命令」的用法:
    -Health  只 GET 一次健康检查地址(/playwright/health),报告 ok/失败后退出,用来判断服务起没起来;
    -Last    不重发,直接把该会话最新一份 NNN.res.json 重新打出来(同样认 -Json / -Index)。
  这两种用法都不会新建会话目录、不会写 .current、不会写新的 NNN 文件。

  结果取值口径(给 -Json / -Index 用,免得每个调用方各写一遍 ConvertFrom-Json):
    单条命令      data.result,没有 result 就退到 data;
    commands 批次 data.results[i].data.result,同样没有 result 就退到那一条的 data。

.PARAMETER PayloadFile
  请求体 JSON 文件的路径(UTF-8)。用文件而不是命令行参数,是为了中文与引号不用层层转义。
  例:{"id":1001,"method":"go_to_url","params":{"url":"https://example.com"}}

.PARAMETER PayloadJson
  直接用一段 JSON 字符串当请求体(简单调用时方便,复杂的还是用 -PayloadFile)。

.PARAMETER Session
  会话目录名;默认沿用 logs/agent/.current 里记着的那一个,没有就按时间戳新建。

.PARAMETER NewSession
  强制新开一个会话目录。

.PARAMETER Compact
  只在屏幕上打印摘要(时间线那一行 + 关键字段),不打印完整响应体。默认打印完整响应 JSON —— 因为
  data.text 这类内容正是调用方要读的。

.PARAMETER Json
  只打印**命令结果**本身(漂亮 JSON),不打印摘要行、不打印文件路径、不打印脱敏提示,方便直接管道给
  别的工具(例如 | ConvertFrom-Json、| jq)。落盘的那份请求/响应照旧写,脱敏照旧生效。
  commands 批次打印「每条命令的结果」组成的数组;单条命令打印 data.result(没有就 data)。

.PARAMETER Index
  只输出 commands 批次里第 N 条命令的结果(N 从 0 起)。配 -Json 时就是「只吐这一条」;
  不配 -Json 时打印摘要行 + 这一条的结果。不填就是整批/整条输出。越界会报错并以 1 退出。

.PARAMETER Last
  不重发命令,直接把该会话最新一份 NNN.res.json(按文件名序号取最新)重新打出来。
  用于「刚才那次到底回了什么」的复查;-Json / -Index 同样生效,输出是当时那份(已脱敏的)原文。
  不给 -Session 时用 .current 记着的会话;会话目录不存在或没有 NNN.res.json 时报错并以 1 退出。

.PARAMETER Health
  只做一次健康检查:GET <base>/../health,打印 ok/失败与响应体后退出,不发命令、不落盘。
  加 -Json 时只打印响应体。服务没起来或响应异常时以 1 退出。

.PARAMETER Port
  服务端口,默认 10049。给了 -Port 又没给 -BaseUrl 时,地址按 http://localhost:<Port>/playwright/command
  拼;两个都给时 -BaseUrl 优先(自定义路径/远端地址还是用 -BaseUrl)。

.PARAMETER BaseUrl
  命令地址,默认 http://localhost:10049/playwright/command(即默认端口 10049)。
  与 -Port 同时给出时以本参数为准。

.PARAMETER NoRedact
  关掉落盘前的脱敏。**默认是脱敏的**:写进 .req.json / .res.json / steps.log 之前,手机号、18 位
  身份证号或统一社会信用代码、邮箱、16~19 位长数字会被替换成 ***,与服务端 CommandTraceLog 用同一套
  规则(服务端默认也脱敏)。屏幕上打印的内容**始终是原文**,方便你当场看值;只有落盘的那份被掩。
  需要「日志里也要原文」时加这个开关(例如排查「这个值到底传没传对」)。

.PARAMETER RedactPattern
  追加的自定义脱敏正则(可给多个),在内置规则之后生效。例:公司名、商标名。

.PARAMETER TimeoutSec
  HTTP 超时(秒),默认 300。超时或响应不是合法 JSON 时,会打印一行带 URL 与耗时的错误并以 1 退出。

.EXAMPLE
  pwsh scripts/trace/browse.ps1 -PayloadFile tmp\step1.json

.EXAMPLE
  pwsh scripts/trace/browse.ps1 -PayloadJson '{"id":1001,"method":"get_url"}' -Compact

.EXAMPLE
  pwsh scripts/trace/browse.ps1 -PayloadFile tmp\step1.json -RedactPattern '某某科技有限公司','某某课堂'

.EXAMPLE
  # 服务起在 10050 上:只给端口就行,不用再手写整条 BaseUrl
  pwsh scripts/trace/browse.ps1 -PayloadFile tmp\payloads\list-unsubmitted.json -Session verify-browse -Port 10050

.EXAMPLE
  # 只要批次里第 0 条命令的业务结果,直接给下游用
  pwsh scripts/trace/browse.ps1 -PayloadFile tmp\payloads\list-unsubmitted.json -Session verify-browse -Port 10050 -Json -Index 0

.EXAMPLE
  # 不重跑,复查上一次到底回了什么
  pwsh scripts/trace/browse.ps1 -Last -Session verify-browse -Json

.EXAMPLE
  # 一条命令判断服务起没起来(ok/失败 + 响应体)
  pwsh scripts/trace/browse.ps1 -Health -Port 10049
#>
[CmdletBinding(DefaultParameterSetName = 'File')]
param(
  [Parameter(ParameterSetName = 'File', Mandatory = $true)]
  [string]$PayloadFile,

  # 参数集名字从 Json 改成 Inline:下面新增的 -Json 开关是另一回事,名字分开免得看混
  [Parameter(ParameterSetName = 'Inline', Mandatory = $true)]
  [string]$PayloadJson,

  # 只探活,不发命令
  [Parameter(ParameterSetName = 'Health', Mandatory = $true)]
  [switch]$Health,

  # 复看:不重发,重新打印该会话最新一份响应
  [Parameter(ParameterSetName = 'Last', Mandatory = $true)]
  [switch]$Last,

  [string]$Session,

  [switch]$NewSession,

  [switch]$Compact,

  [switch]$Json,

  # -1 = 没给 -Index,整批/整条输出
  [int]$Index = -1,

  [switch]$NoRedact,

  [string[]]$RedactPattern,

  [int]$TimeoutSec = 300,

  [int]$Port = 10049,

  [string]$BaseUrl
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$agentRoot = Join-Path $repoRoot 'logs\agent'
$currentFile = Join-Path $agentRoot '.current'

# 地址:两者都给时 -BaseUrl 优先;只给 -Port 就按端口拼;都不给时 -Port 的默认值 10049 与原来的默认地址一致
if (-not $BaseUrl) {
  $BaseUrl = "http://localhost:$Port/playwright/command"
}

# 落盘脱敏:与服务端 CommandTraceLog.BUILT_IN_PATTERNS 保持同一套规则,两边日志的口径才一致
# 边界写成「前后不能还是数字/字母」而不是 \b:实测 1[3-9]\d{9} 会把 13 位的毫秒时间戳
# (2026 年的 1790…,开头正好是 17)当成手机号,把 recordedSince 掩成 ***87,反而看不懂。
$script:redactMask = '***'
$script:redactHits = 0
$builtInPatterns = @(
  '(?<!\d)1[3-9]\d{9}(?!\d)',
  '(?<!\d)[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[0-9Xx](?![0-9A-Za-z])',
  '(?<![0-9A-Za-z])[0-9A-HJ-NPQRTUWXY]{18}(?![0-9A-Za-z])',
  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',
  '(?<!\d)\d{16,19}(?!\d)'
)

<#
  把要落盘的文本里的个人信息替换成掩码。
  只作用于**写文件**的内容:屏幕上打印的仍是原文,免得排查时反而看不到值。
#>
function Protect-Text {
  param([string]$Text)
  if ($NoRedact -or [string]::IsNullOrEmpty($Text)) { return $Text }
  $patterns = @($builtInPatterns)
  if ($RedactPattern) { $patterns += $RedactPattern }
  $result = $Text
  foreach ($pattern in $patterns) {
    if ([string]::IsNullOrWhiteSpace($pattern)) { continue }
    try {
      $hits = [regex]::Matches($result, $pattern).Count
      if ($hits -gt 0) {
        $script:redactHits += $hits
        $result = [regex]::Replace($result, $pattern, $script:redactMask)
      }
    }
    catch {
      # 单条规则写坏不该让整条日志丢掉
    }
  }
  return $result
}

# 摘要行里要露一眼的字段
$highlightKeys = @('url', 'title', 'seq', 'screenshot', 'state_file', 'changed', 'changeStatus', 'status',
  'errorCode', 'engine', 'count', 'succeeded', 'failed', 'pageIndex', 'requestId', 'path')

<#
  从对象里挑几个关键字段拼成一行用的紧凑串。
#>
function Get-Highlight {
  param($Obj, [string[]]$Keys)
  $picked = [ordered]@{}
  foreach ($k in $Keys) {
    $v = $Obj.$k
    if ($null -ne $v -and "$v" -ne '') {
      $s = "$v"
      if ($s.Length -gt 300) { $s = $s.Substring(0, 300) + '…' }
      $picked[$k] = $s
    }
  }
  return $picked
}

<#
  摘要行:时间/序号/任务/方法/成败/耗时/关键字段。本次调用与 -Last 复看共用这一份格式,
  免得两边的输出长得不一样。
#>
function Format-SummaryLine {
  param($ResObj, [string]$Stamp, [string]$TaskId, [string]$Method, [string]$Time, [string]$ElapsedText)
  $line = "$Time #$Stamp id=$TaskId $Method "
  if ($null -ne $ResObj) {
    $okText = if ($ResObj.ok) { 'OK' } else { 'FAIL' }
    $line += "$okText $ElapsedText"
    if ($ResObj.msg) { $line += " msg=$($ResObj.msg -replace '\s+', ' ')" }
    if ($null -ne $ResObj.data) {
      $hl = Get-Highlight -Obj $ResObj.data -Keys $highlightKeys
      foreach ($k in $hl.Keys) { $line += " $k=$($hl[$k])" }
      if ($ResObj.data.PSObject.Properties.Name -contains 'results') {
        foreach ($step in $ResObj.data.results) {
          $mark = if ($step.ok) { 'ok' } else { 'FAIL' }
          $line += " | $($step.index):$($step.command)=$mark"
          if ($step.msg) { $line += "($($step.msg -replace '\s+', ' '))" }
        }
      }
    }
  }
  else {
    $line += "响应不是合法 JSON $ElapsedText"
  }
  return $line
}

<#
  取「业务结果」:有 data.result 就取 result,没有就退到 data,两者都没有就把节点原样给出。
  批次里每条命令也走这个规则,-Json 与 -Index 的取值口径才一致。
#>
function Get-ResultNode {
  param($Node)
  if ($null -eq $Node) { return $null }
  $names = @($Node.PSObject.Properties.Name)
  if ($names -contains 'data') {
    $data = $Node.data
    if ($null -eq $data) { return $null }
    if (@($data.PSObject.Properties.Name) -contains 'result') { return $data.result }
    return $data
  }
  return $Node
}

<#
  算出「要打印什么」:整批(results 数组)/ 单条 / -Index 指定的那一条。
  Valid=$false 表示 -Index 越界,由调用方报错并退出 1。
  用 ArrayList 装批次,单个元素也不会被 PowerShell 拆包(拆了就序列化不出数组)。
#>
function Select-Output {
  param($ResObj)
  $batch = $null
  if ($null -ne $ResObj -and $null -ne $ResObj.data -and
      (@($ResObj.data.PSObject.Properties.Name) -contains 'results')) {
    $batch = New-Object System.Collections.ArrayList
    foreach ($step in @($ResObj.data.results)) { [void]$batch.Add((Get-ResultNode -Node $step)) }
  }
  $count = 1
  if ($null -ne $batch) { $count = $batch.Count }
  $valid = $Index -lt $count
  $picked = $null
  if ($valid -and $Index -ge 0) {
    if ($null -ne $batch) { $picked = $batch[$Index] } else { $picked = Get-ResultNode -Node $ResObj }
  }
  $value = $null
  if ($Index -ge 0) { $value = $picked }
  elseif ($null -ne $batch) { $value = $batch }
  else { $value = Get-ResultNode -Node $ResObj }
  return [pscustomobject]@{ Batch = $batch; Picked = $picked; Value = $value; Count = $count; Valid = $valid }
}

<#
  健康检查地址 = 把命令地址里的 /playwright/command 换成 /playwright/health。
  认不出来就在主机根下拼 /playwright/health,不至于因为自定义路径直接报错。
#>
function Get-HealthUrl {
  param([string]$Url)
  if ($Url -match '^(?<root>.*)/playwright/command/?$') { return $Matches['root'] + '/playwright/health' }
  if ($Url -match '^(?<root>.*)/command/?$') { return $Matches['root'] + '/playwright/health' }
  return $Url.TrimEnd('/') + '/playwright/health'
}

function Resolve-SessionDir {
  param([string]$Name, [switch]$Force)
  if (-not $Name) {
    if (-not $Force -and (Test-Path $currentFile)) {
      $Name = (Get-Content $currentFile -Raw).Trim()
    }
    if (-not $Name) {
      $Name = Get-Date -Format 'yyyyMMdd-HHmmss'
    }
  }
  $dir = Join-Path $agentRoot $Name
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  # 一律写无 BOM 的 UTF-8,免得下游工具把 BOM 当成内容的一部分
  [System.IO.File]::WriteAllText($currentFile, $Name, [System.Text.UTF8Encoding]::new($false))
  return $dir
}

<#
  只算会话目录路径:不建目录、不写 .current。给 -Last 复看用,免得顺手改了「当前会话」指针。
#>
function Get-SessionDirPath {
  param([string]$Name)
  if (-not $Name -and (Test-Path $currentFile)) {
    $Name = (Get-Content $currentFile -Raw).Trim()
  }
  if (-not $Name) { return $null }
  return (Join-Path $agentRoot $Name)
}

<#
  从文件名里取序号;-Last 按序号取最新,不看 LastWriteTime(复制/同步过的目录时间戳不可靠)。
#>
function Get-ResSeq {
  param([string]$Name)
  if ($Name -match '^(\d+)\.res\.json$') { return [int]$Matches[1] }
  return -1
}

<#
  一行错误:超时/连不上/响应不是 JSON 时统一这么报,带 URL 与耗时,便于一眼定位。
  不抛异常,免得 PowerShell 打一堆堆栈出来。
#>
function Write-Fail {
  param([string]$Message)
  Write-Output ('ERROR ' + (($Message -replace '\s+', ' ').Trim()))
}

<#
  打一份响应:-Json 只吐结果 JSON(可配 -Index 取某一条),否则沿用原来的「标题行 + 摘要行 + 完整响应」。
  -Index 不配 -Json 时打印「摘要行 + 这一条的结果」,因为 -Index 的用意就是只要那一条。
#>
function Write-Response {
  param([string]$Text, $Sel, [string]$Line, [string]$Title)
  if ($Json) {
    Write-Output (ConvertTo-Json -InputObject $Sel.Value -Depth 100)
    return
  }
  if ($Compact -and $Index -lt 0) {
    Write-Output $Line
    return
  }
  Write-Output $Title
  Write-Output $Line
  Write-Output ''
  if ($Index -ge 0) {
    Write-Output (ConvertTo-Json -InputObject $Sel.Picked -Depth 100)
  }
  else {
    Write-Output $Text
  }
}

# ---------------- 探活:不发命令、不落盘 ----------------
if ($Health) {
  $healthUrl = Get-HealthUrl -Url $BaseUrl
  $healthStarted = Get-Date
  $healthBody = $null
  $healthError = $null
  try {
    $healthResp = Invoke-WebRequest -Uri $healthUrl -Method Get -UseBasicParsing -TimeoutSec $TimeoutSec
    $healthBody = $healthResp.Content
  }
  catch {
    $healthError = $_.Exception.Message
  }
  $healthMs = [int]((Get-Date) - $healthStarted).TotalMilliseconds
  if ($null -eq $healthBody) {
    Write-Fail "健康检查失败 url=$healthUrl elapsed=${healthMs}ms error=$healthError"
    exit 1
  }
  $healthObj = $null
  try { $healthObj = $healthBody | ConvertFrom-Json } catch { }
  $healthOk = $true
  if ($null -ne $healthObj -and $healthObj.PSObject.Properties.Name -contains 'ok') {
    $healthOk = [bool]$healthObj.ok
  }
  if ($Json) {
    Write-Output $healthBody
  }
  elseif ($healthOk) {
    Write-Output "ok url=$healthUrl elapsed=${healthMs}ms"
    Write-Output $healthBody
  }
  else {
    Write-Fail "健康检查不 ok url=$healthUrl elapsed=${healthMs}ms body=$(($healthBody -replace '\s+', ' ').Trim())"
  }
  if ($healthOk) { exit 0 }
  exit 1
}

# ---------------- 复看:只读最新一份 NNN.res.json ----------------
if ($Last) {
  $lastDir = Get-SessionDirPath -Name $Session
  if (-not $lastDir -or -not (Test-Path $lastDir)) {
    Write-Fail "会话目录不存在:$lastDir"
    exit 1
  }
  $lastFile = Get-ChildItem -Path $lastDir -Filter '*.res.json' -ErrorAction SilentlyContinue |
    Sort-Object -Property @{ Expression = { Get-ResSeq -Name $_.Name } }, Name -Descending |
    Select-Object -First 1
  if ($null -eq $lastFile) {
    Write-Fail "会话目录里没有 NNN.res.json:$lastDir"
    exit 1
  }
  $lastStamp = (Get-ResSeq -Name $lastFile.Name).ToString('000')
  $lastText = [System.IO.File]::ReadAllText($lastFile.FullName, [System.Text.UTF8Encoding]::new($false))
  $lastObj = $null
  try { $lastObj = $lastText | ConvertFrom-Json } catch { }
  if ($null -eq $lastObj) {
    Write-Fail "保存的响应不是合法 JSON:$($lastFile.FullName)"
    exit 1
  }
  # 序号旁边的 id/method 从对应的 .req.json 里取,摘要行才和当初那次长得一样
  $lastMethod = '?'
  $lastTaskId = '?'
  $lastReq = Join-Path $lastDir "$lastStamp.req.json"
  if (Test-Path $lastReq) {
    try {
      $lastReqObj = (Get-Content $lastReq -Raw -Encoding utf8) | ConvertFrom-Json
      if ($lastReqObj.method) { $lastMethod = $lastReqObj.method }
      if ($null -ne $lastReqObj.id) { $lastTaskId = [string]$lastReqObj.id }
    }
    catch { }
  }
  $lastLine = Format-SummaryLine -ResObj $lastObj -Stamp $lastStamp -TaskId $lastTaskId -Method $lastMethod `
    -Time $lastFile.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss.fff') -ElapsedText '?ms'
  $lastSel = Select-Output -ResObj $lastObj
  if (-not $lastSel.Valid) {
    Write-Fail "-Index $Index 越界:#$lastStamp 只回了 $($lastSel.Count) 条结果"
    exit 1
  }
  $title = "---- #$lastStamp $lastMethod (会话 $(Split-Path -Leaf $lastDir),复看 $(Split-Path -Leaf $lastFile.FullName)) ----"
  if ($Index -ge 0) {
    $title = "---- #$lastStamp $lastMethod idx=$Index (会话 $(Split-Path -Leaf $lastDir),复看 $(Split-Path -Leaf $lastFile.FullName)) ----"
  }
  Write-Response -Text $lastText -Sel $lastSel -Line $lastLine -Title $title
  exit 0
}

# ---------------- 正常发命令 ----------------
if ($PSCmdlet.ParameterSetName -eq 'File') {
  if (-not (Test-Path $PayloadFile)) { throw "请求体文件不存在:$PayloadFile" }
  $payload = Get-Content $PayloadFile -Raw -Encoding utf8
}
else {
  $payload = $PayloadJson
}

$sessionDir = Resolve-SessionDir -Name $Session -Force:$NewSession

# 序号 = 目录里已有的响应文件数 + 1
$seq = @(Get-ChildItem -Path $sessionDir -Filter '*.res.json' -ErrorAction SilentlyContinue).Count + 1
$stamp = $seq.ToString('000')

$reqPath = Join-Path $sessionDir "$stamp.req.json"
$resPath = Join-Path $sessionDir "$stamp.res.json"
$stepsLog = Join-Path $sessionDir 'steps.log'

# 请求先落盘:即使服务没起来/请求发不出去,也能看出「我发了什么」。落盘前脱敏
[System.IO.File]::WriteAllText($reqPath, (Protect-Text $payload), [System.Text.UTF8Encoding]::new($false))

$method = '?'
$taskId = '?'
try {
  $parsed = $payload | ConvertFrom-Json
  if ($parsed.method) { $method = $parsed.method }
  if ($null -ne $parsed.id) { $taskId = [string]$parsed.id }
}
catch { }

$started = Get-Date
$responseText = $null
$failure = $null
try {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
  $resp = Invoke-WebRequest -Uri $BaseUrl -Method Post -Body $bytes `
    -ContentType 'application/json; charset=utf-8' -UseBasicParsing -TimeoutSec $TimeoutSec
  $responseText = $resp.Content
}
catch {
  $failure = $_.Exception.Message
}

$elapsedMs = [int]((Get-Date) - $started).TotalMilliseconds
$time = $started.ToString('yyyy-MM-dd HH:mm:ss.fff')

# 注意:解析出来的响应放在 $resObj 里,不能叫 $json —— PowerShell 变量不分大小写,会和 -Json 开关撞车
$resObj = $null
$sendFailed = $false
if ($null -ne $responseText) {
  [System.IO.File]::WriteAllText($resPath, (Protect-Text $responseText), [System.Text.UTF8Encoding]::new($false))
  try { $resObj = $responseText | ConvertFrom-Json } catch { }
  $line = Format-SummaryLine -ResObj $resObj -Stamp $stamp -TaskId $taskId -Method $method -Time $time -ElapsedText "${elapsedMs}ms"
}
else {
  # 没拿到响应:把失败原因写进 res 文件,免得只剩一个空序号
  $sendFailed = $true
  $line = "$time #$stamp id=$taskId $method SEND-FAILED ${elapsedMs}ms error=$failure"
  [System.IO.File]::WriteAllText($resPath, "{`"sendFailed`":true,`"error`":$(ConvertTo-Json $failure)}",
    [System.Text.UTF8Encoding]::new($false))
}

# 落盘的 steps.log 同样脱敏(URL 里也可能带手机号/令牌);屏幕上那行保持原文
if ($script:redactHits -gt 0) {
  $line += " redacted=$($script:redactHits)"
}
[System.IO.File]::AppendAllText($stepsLog, (Protect-Text $line) + [Environment]::NewLine,
  [System.Text.UTF8Encoding]::new($false))

$title = "---- #$stamp $method (会话 $(Split-Path -Leaf $sessionDir)) ----"
if ($Index -ge 0) { $title = "---- #$stamp $method idx=$Index (会话 $(Split-Path -Leaf $sessionDir)) ----" }

$exitCode = 0
if ($sendFailed) {
  # 超时/连不上:一行错误(带 URL 与耗时),不吐堆栈
  Write-Fail "请求发送失败 url=$BaseUrl elapsed=${elapsedMs}ms $method #$stamp error=$failure"
  $exitCode = 1
}
elseif ($null -eq $resObj) {
  # 响应不是合法 JSON:一行错误(带 URL 与耗时),非 -Json 时把原文也打出来便于看个究竟
  Write-Fail "响应不是合法 JSON url=$BaseUrl elapsed=${elapsedMs}ms $method #$stamp"
  if (-not $Json -and -not $Compact) {
    Write-Output $title
    Write-Output $line
    Write-Output ''
    Write-Output $responseText
  }
  $exitCode = 1
}
else {
  $sel = Select-Output -ResObj $resObj
  if (-not $sel.Valid) {
    Write-Fail "-Index $Index 越界:#$stamp $method 只回了 $($sel.Count) 条结果"
    $exitCode = 1
  }
  else {
    Write-Response -Text $responseText -Sel $sel -Line $line -Title $title
    if (-not $Json -and $script:redactHits -gt 0 -and -not $NoRedact) {
      Write-Output "# 落盘日志已脱敏 $($script:redactHits) 处(手机号/证件号/邮箱/长数字);要看原文加 -NoRedact"
    }
  }
}

exit $exitCode
```

:::

下一步：[统一命令协议](./04.md)。
