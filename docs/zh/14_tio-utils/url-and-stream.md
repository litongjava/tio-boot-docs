# URL 与流复制工具

## URL 编解码

`UrlUtils.encode` 对一个组件按 UTF-8 进行百分号编码；`decode` 解码百分号字节序列，保留原本未转义的中文、补充字符和 `+`。这里的 `+` 是字面加号，不表示表单编码中的空格。

```java
import nexus.io.tio.utils.url.UrlUtils;

public class UrlExamples {
  public String decodePath() {
    return UrlUtils.decode("文档%2F😀+空%20格");
    // 文档/😀+空 格
  }

  public String downloadUrl() {
    return UrlUtils.encodeUrl("https://example.com/a%2Fb/中文.pdf?q=%2F");
    // https://example.com/a%2Fb/%E4%B8%AD%E6%96%87.pdf?q=%2F
  }
}
```

`encodeUrl` 保留现有合法转义和路径分隔符。例如 `%2F` 保持为 `%2F`，不会变成新的 `/` 路径层级；重复调用不会再次编码已有转义。查询串和片段保留输入形式，应由调用方预先完成对应组件的编码。无层级结构的 URI 保留其结构，并转换为 ASCII 表示。

不完整或包含非十六进制字符的转义，例如 `%`、`%GG`、`%+1`，会抛出 `IllegalArgumentException`。传入 `null` 时返回 `null`。

## 流复制

`IoUtils.copy` 与 `copyLarge` 将输入流复制到输出流，不负责关闭调用方提供的流。指定缓冲区时必须提供非空数组；指定大小时必须大于零，否则立即抛出 `IllegalArgumentException`。

```java
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import nexus.io.tio.utils.IoUtils;

public class StreamCopyExample {
  public long copyFile(Path source, Path destination) throws IOException {
    try (InputStream input = Files.newInputStream(source);
        OutputStream output = Files.newOutputStream(destination)) {
      return IoUtils.copy(input, output, 8192);
    }
  }
}
```

带缓冲区大小的 `copy` 和 `copyLarge` 返回 `long` 字节数。双参数 `copy` 返回 `int`，超过 `Integer.MAX_VALUE` 时返回 `-1`；大文件需要准确计数时使用返回 `long` 的方法。
