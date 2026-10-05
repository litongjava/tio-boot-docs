# Gzip 与字节缓冲区

## 完整字节数组的压缩与解压

`ZipUtil.gzip` 将字节数组压缩为 Gzip 数据；`ZipUtil.unGzip` 接收完整压缩数据并返回解压后的字节数组，也支持按顺序连接的多个 Gzip 成员。

```java
import java.nio.charset.StandardCharsets;
import nexus.io.tio.utils.hutool.ZipUtil;

public class GzipExample {
  public String roundTrip(String value) {
    byte[] compressed = ZipUtil.gzip(value.getBytes(StandardCharsets.UTF_8));
    byte[] restored = ZipUtil.unGzip(compressed);
    return new String(restored, StandardCharsets.UTF_8);
  }
}
```

空的原始数据可以正常压缩、解压；零字节的压缩输入则不是有效 Gzip 数据。对于截断的首部、压缩正文或尾部，以及校验和不正确的成员，解压会抛出 `RuntimeException`，其原因异常为 `IOException`。调用方应提交收集完整的数据，并按自身业务限制输入和解压后数据大小；该接口把结果保存在内存中，没有内置解压输出上限。

该便捷方法使用标准 Gzip 输入流处理完整数据，不需要调用方轮询返回值。

## Gzip 流式读取

`TioGZIPInputStream` 用于读取单个 Gzip 成员，遵循标准阻塞输入流语义：非零长度读取返回数据或结束标记，读取过程按需等待底层输入，不使用 `available()` 判断数据是否完整。调用方不需要轮询返回值 0；网络输入应由底层流配置读取超时。需要解压多个连接成员时，可使用 `ZipUtil.unGzip` 或 JDK 的 `GZIPInputStream`。

构造时保留延迟解析能力，首次非零长度读取才消费首部。零长度读取返回 0 且不消费输入，目标数组和范围在读取前校验。支持额外字段、文件名、注释和首部 CRC，并在读到末尾时校验正文 CRC 与解压长度；截断数据通过 `EOFException` 报告，格式或校验不匹配通过 `ZipException` 报告。完整校验需要持续读取到 -1，提前关闭不等同于完成校验。

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import nexus.io.tio.utils.stream.TioGZIPInputStream;

public class GzipStreamExample {
  public byte[] decode(byte[] compressed) throws IOException {
    try (TioGZIPInputStream input = new TioGZIPInputStream(new ByteArrayInputStream(compressed))) {
      ByteArrayOutputStream output = new ByteArrayOutputStream();
      byte[] buffer = new byte[1024];
      int count;
      while ((count = input.read(buffer)) != -1) {
        output.write(buffer, 0, count);
      }
      return output.toByteArray();
    }
  }
}
```

关闭包装流会释放解压资源并关闭底层流。`TioInflaterInputStream` 同样遵循阻塞读取语义，适合与标准输入流消费代码配合使用。

## 字节缓冲区切片

`FastByteBuffer.toArray(start, length)` 按已写入的数据长度校验范围，支持跨内部缓冲块复制，并返回独立数组。切片范围以有效数据为准，统一的范围校验便于调用方处理参数。可以在逻辑末尾读取长度为零的切片。

```java
import nexus.io.tio.utils.hutool.FastByteBuffer;

public class BufferSliceExample {
  public byte[] slice() {
    FastByteBuffer buffer = new FastByteBuffer(2);
    buffer.append(new byte[] {10, 20});
    buffer.append(new byte[] {30, 40});
    return buffer.toArray(1, 2);
  }
}
```

示例返回 `{20, 30}`。读取 `toArray(4, 0)` 返回空数组；读取 `toArray(4, 1)` 抛出 `IndexOutOfBoundsException`。

## 输出空缓冲区

`FastByteArrayOutputStream.writeTo` 可以对新建或 `reset()` 后的空缓冲区调用，此时不写出任何字节。重新写入数据后，再次调用会输出当前数据。该方法不会关闭目标输出流。

```java
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import nexus.io.tio.utils.hutool.FastByteArrayOutputStream;

public class BufferWriteExample {
  public byte[] write() throws IOException {
    FastByteArrayOutputStream source = new FastByteArrayOutputStream();
    ByteArrayOutputStream target = new ByteArrayOutputStream();
    source.writeTo(target);
    source.write(42);
    source.writeTo(target);
    return target.toByteArray();
  }
}
```


## 缓冲区追加与复用

`FastByteBuffer.append` 支持追加单个字节、字节数组片段以及另一个缓冲区。追加其他缓冲区时保留源数据，按原顺序连接到目标末尾；追加自身时，使用调用前的内容副本，将原数据完整重复一次。

```java
import nexus.io.tio.utils.hutool.FastByteBuffer;

public class BufferAppendExample {
  public byte[] duplicate() {
    FastByteBuffer buffer = new FastByteBuffer(2);
    buffer.append(new byte[] {1, 2});
    buffer.append(new byte[] {3, 4});
    buffer.append(buffer);
    return buffer.toArray();
  }
}
```

示例返回 `{1, 2, 3, 4, 1, 2, 3, 4}`。数组片段的 offset 和 length 在写入前统一校验，非法范围抛出 `IndexOutOfBoundsException` 并保持缓冲区原有状态。

`reset()` 清空逻辑数据，同时解除对已使用数据块的引用，使这些数据块在没有其他引用时可以由垃圾回收器回收。缓冲区对象可以继续使用，后续追加按需分配数据块。`FastByteArrayOutputStream.reset()` 同样采用这一复用方式，适合连续处理多批数据。
