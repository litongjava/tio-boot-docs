# 字符串查找与随机整数

## 统一的字符串查找接口

`StrUtil` 支持在 String、StringBuilder 等 CharSequence 对象中查找字符和子串，提供正向、反向及忽略大小写的重载，便于复用相同的搜索逻辑。

```java
import nexus.io.tio.utils.hutool.StrUtil;

public class SearchExample {
  public int firstMatch() {
    return StrUtil.indexOfIgnoreCase("Hello World", "WORLD");
  }

  public int lastMatch() {
    return StrUtil.lastIndexOfIgnoreCase(new StringBuilder("Abc"), "ABC");
  }
}
```

示例结果分别为 6 和 0。查找包含索引 0；未匹配以及输入为 null 时返回 -1。

- 正向子串查找：负起点按 0 处理；空搜索串的位置最大为原字符串长度。
- 反向子串查找：起点是允许匹配的最大起始索引，负起点返回 -1，过大起点按可搜索范围处理。
- 字符范围查找：范围为 `[start, end)`，负 start 按 0 处理；负 end 或超过字符串长度的 end 按字符串末尾处理。start 超过末尾时返回 -1。

这些规则便于在不同 CharSequence 实现间保持一致的边界行为。

## 闭区间随机整数

`RandomUtils.nextInt(min, max)` 在包含两个端点的闭区间内生成整数，支持整个 int 范围。使用线程本地随机源，适合并发业务中的抽样和随机分配。

```java
import nexus.io.tio.utils.hutool.RandomUtils;

public class RandomRangeExample {
  public int roll() {
    return RandomUtils.nextInt(1, 6);
  }

  public int anyInteger() {
    return RandomUtils.nextInt(Integer.MIN_VALUE, Integer.MAX_VALUE);
  }
}
```

两端相同时直接得到该值；min 大于 max 时抛出 `IllegalArgumentException`。该工具面向普通业务随机数，密码、令牌等用途应使用密码学安全随机源。


## 字节数据转换为文本

`StrUtil.utf8Str` 使用 UTF-8 将 byte[]、Byte[] 或 ByteBuffer 转为字符串；`StrUtil.str(value, charset)` 可指定字符集。统一入口便于在网络数据、文件内容和业务对象之间复用转换逻辑。

```java
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import nexus.io.tio.utils.hutool.StrUtil;

public class ByteTextExample {
  public String fromBytes(byte[] data) {
    return StrUtil.utf8Str(data);
  }

  public String fromBuffer(ByteBuffer data) {
    return StrUtil.str(data, StandardCharsets.UTF_8);
  }
}
```

ByteBuffer 只解码 position 到 limit 之间的可读字节，支持堆缓冲区、直接缓冲区、切片和只读视图。转换后原缓冲区的 position、limit、mark 保持不变，方便后续继续处理原始数据。

空字节数组或没有剩余字节的缓冲区得到空字符串，null 对象得到 null。Byte[] 的元素需要是非 null 的字节值。不完整或不符合指定字符集的字节序列采用该字符集的替换字符。普通字符串保持原值，其他数组使用数组的文本表示。


## 正则分组模板与文本删除

`ReUtil.replaceAll` 支持使用 `$0` 引用完整匹配、使用 `$1`、`$2`、`$10` 等引用编号分组，适合按模板整理文本。编号按完整数字识别，模板按出现顺序展开；捕获内容作为普通文本写入，便于保留其中的美元符号和反斜杠。

```java
import java.util.regex.Pattern;
import nexus.io.tio.utils.hutool.ReUtil;

public class RegexTextExample {
  public String reorder() {
    return ReUtil.replaceAll("item:42", "([a-z]+):([0-9]+)", "$2/$1");
  }

  public String removeWhitespace(String input) {
    return ReUtil.delAll(Pattern.compile("\\s+"), input);
  }
}
```

`reorder()` 返回 `42/item`。可选分组未参与匹配时，对应占位符展开为空字符串。模板中引用的分组必须存在；除数字分组引用外，模板字符按字面写入。此模板接口没有采用 Java Matcher 的全部替换语法，例如命名分组模板和反斜杠转义语法。

`delFirst` 删除第一个匹配，`delAll` 删除所有匹配；普通文本与纯空白文本都按传入模式处理。内容或 Pattern 为 null 时返回原内容。模板替换在没有匹配时保留原文本，空内容保持为空，null 内容保持为 null。


## 数值转换与字段命名

`StrUtil.convert(Number.class, value)` 按 JVM 默认数字格式区域设置解析完整输入，可用于需要区域化数字格式的场景。解析后必须完整消费输入，未解析的尾随内容通过 ParseException 反馈。空白或 null 输入保留为 null；转换 Number[] 时按相同规则逐项处理。

```java
import nexus.io.tio.utils.hutool.StrUtil;

public class NumericTextExample {
  public Number parse(String value) throws Exception {
    return (Number) StrUtil.convert(Number.class, value);
  }

  public Integer integer(String value) throws Exception {
    return (Integer) StrUtil.convert(Integer.class, value);
  }
}
```

例如在美式数字格式下，`1,234.5` 表示 1234.5，在德式数字格式下则使用 `1.234,5`。需要固定整数格式时，可以选择 Integer 或 Long 等明确类型。Number 入口保留 NumberFormat 的分组与区域规则，完整消费检查不等于严格校验千位分组位置。

`StrUtil.toCamelCase` 可将下划线字段名转换为驼峰形式。无下划线时，第二个参数决定是否统一小写，单字符字段同样遵循这一规则。

```java
import nexus.io.tio.utils.hutool.StrUtil;

public class FieldNameExample {
  public String fromColumn() {
    return StrUtil.toCamelCase("USER_ID", false);
  }

  public String lowercaseSingleLetter() {
    return StrUtil.toCamelCase("A", true);
  }
}
```

示例分别返回 userId 和 a。对于已经是驼峰形式的 userId，传入 false 保留原值，传入 true 得到 userid。


## 按长度截取文本

`StrUtil.subWithLength(input, start, length)` 使用不会发生 int 加法回绕的终点计算，并沿用 sub 的负索引与边界归一化约定。超大正起点返回空串；从有效位置截取超过剩余长度时返回剩余内容。

`StrUtil.subPreGbk(text, length, suffix)` 按 GBK 字节边界截取。若边界落在双字节字符内部，会保留该完整字符，再追加 suffix；因此保留内容可以比指定字节位置多一个字节。未发生截取时返回原文且不追加后缀，非空输入的负长度会抛出 IllegalArgumentException。

```java
import nexus.io.tio.utils.hutool.StrUtil;

public class TextSliceExample {
  public String remainder() {
    return StrUtil.subWithLength("abcdef", 1, Integer.MAX_VALUE);
  }

  public String preview() {
    return StrUtil.subPreGbk("丂中X", 3, "...");
  }
}
```

示例分别返回 bcdef 和 丂中...。GBK 截取适用于以 GBK 表示的文本，不能表示的字符遵循 Java 字符集编码的替换规则。
