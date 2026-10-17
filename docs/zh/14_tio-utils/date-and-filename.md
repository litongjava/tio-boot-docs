# 日期转换与文件名解析

## DateParseUtils

`parseIso8601Date` 按 ISO 偏移日期时间解析为 `java.util.Date`，支持 `Z`、正负偏移以及可选的小数秒。解析会保留实际时间点，小数秒转换到 Date 的毫秒精度。无效日历日期、尾随内容或 `null` 输入返回 `null`。

```java
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.time.OffsetDateTime;
import nexus.io.tio.utils.date.DateParseUtils;

public class DateExamples {
  public Date instant() {
    return DateParseUtils.parseIso8601Date("2026-10-04T08:30:00+08:00");
    // 实际时间点为 2026-10-04T00:30:00Z。
  }

  public List<OffsetDateTime> withOffsets() {
    return DateParseUtils.convertToIso8601Date(Arrays.<Object>asList(
        "2026-10-04T08:30:00+08:00", "2026-10-03T19:00:00-05:30"));
    // 每项保留原始偏移，两个值指向同一时间点。
  }
}
```

`convertToIso8601Date(List<Object>)` 要求列表元素为带偏移的 ISO 日期时间字符串。输入不符合格式时抛出解析异常，不把错误元素静默替换为有效日期。

历史单字符串重载 `convertToIso8601Date(String)` 接收 `yyyy-MM-dd HH:mm:ss`；`convertToIso8601FromDefault` 的字符串和列表重载同样使用这一格式，并为结果设置 UTC。它们严格验证日历日期，例如非闰年的 2 月 29 日会被拒绝。

秒和毫秒时间戳转换方法仍使用系统默认时区展示结果，时间点本身由时间戳确定。带偏移字符串与没有时区的本地时间字符串应按各自方法约定传入。

## FilenameUtils

文件名工具按字符串解析路径，同时识别 `/` 和 `\`，以两者中最后出现的分隔符作为文件名起点。结果不依赖运行系统，不访问文件系统，也不会解析 `..`、检查路径是否存在或进行路径安全校验。

```java
import nexus.io.tio.utils.hutool.FilenameUtils;

public class FilenameExamples {
  public String suffix() {
    return FilenameUtils.getSuffix("folder.v1/readme");
    // 空字符串：目录名中的点不是文件扩展名。
  }

  public String name() {
    return FilenameUtils.getFilename("root/parent\\child\\photo.PNG");
    // photo.PNG
  }
}
```

| 方法 | 结果 |
| --- | --- |
| getFilename | 最后一个路径分隔符之后的完整文件名 |
| getBaseName | 文件名去掉最后一个扩展名 |
| getSuffix | 文件名中最后一个点之后的内容，保留原大小写 |
| getSubPath | 最后一个路径分隔符之前的字符串 |
| getParentFolderName | 文件的直接父目录名称 |
| isImageFile | 按已有图片扩展名集合判断，忽略大小写；null 返回 false |

没有扩展名、以点结尾或空输入时，`getSuffix` 返回空串；多重扩展名只取最后一段。保留既有点文件约定：`.env` 的 suffix 是 `env`，baseName 是空串。图片判断不受系统语言区域影响。


## DateUtil 日期转换

`DateUtil` 提供常用日期格式识别及 Date、SQL Date、Timestamp、Time 的转换入口。解析前统一去除首尾空白，并按实际日历校验输入，便于表单和字符串转换共用一致的日期规则。

支持的常用格式包括：

- 日期：`yyyy-MM-dd`、`yyyyMMdd`。
- 时间：`HH:mm:ss`、`HHmmss`。
- 日期时间：`yyyy-MM-dd HH:mm`、`yyyy-MM-dd HH:mm:ss`、`yyyyMMddHHmmss`。
- 毫秒日期时间：`yyyy-MM-dd HH:mm:ss.SSS`、`yyyyMMddHHmmssSSS`。

```java
import java.util.Date;
import nexus.io.tio.utils.hutool.DateUtil;

public class LocalDateConversionExample {
  public Date date() {
    return DateUtil.parseToDate(" 2024-02-29 ");
  }

  public java.sql.Timestamp timestamp() {
    return DateUtil.parseToTimestamp("2024-02-29 12:34:56.123");
  }
}
```

这些不带时区的日期按 JVM 默认时区解析。输入为 null、空白、无效日历日期或带有未解析的尾随内容时返回 null。SQL 类型入口保留解析结果的毫秒时间值；需要明确携带偏移量时，可以使用本页前面的 `DateParseUtils` 接口。

## HTTP 日期输出

`DateUtil.httpDate` 使用 GMT 和英文日期名称输出 HTTP 日期，日期中的日固定为两位。其结果独立于服务器默认时区，适用于不同部署地区的统一响应头格式。框架的 `HttpDateTimer` 使用此工具生成日期字符串。

```java
import nexus.io.tio.utils.hutool.DateUtil;

public class HttpDateExample {
  public String epoch() {
    return DateUtil.httpDate(0L);
  }
}
```

示例返回 `Thu, 01 Jan 1970 00:00:00 GMT`。无参数入口输出当前时间，Date 与毫秒时间戳重载用于输出指定时间点。


## 目录复制

`FileUtil.copyDirectory` 支持递归复制目录，并通过 overwrite 选择完整替换目标或保留已有文件。复制前检查源和目标的位置关系，两者需要位于互不包含的目录树中；相同目录、父子目录关系会以 IOException 拒绝，检查发生在目标修改之前。

```java
import java.io.IOException;
import java.nio.file.Path;
import nexus.io.tio.utils.hutool.FileUtil;

public class DirectoryCopyExample {
  public void copy(Path source, Path target) throws IOException {
    FileUtil.copyDirectory(source, target, false);
  }
}
```

- overwrite 为 false：创建缺少的目录和文件，保留目标已有的同名文件。
- overwrite 为 true：先清除目标目录，再复制源目录，适合需要目标完整对应源内容的场景。
- 目标目录尚不存在时，检查其已有父路径，再按需创建后续目录。
- 路径关系检查解析符号链接；覆盖符号链接形式的目标条目时，替换链接本身，保留独立的链接目标目录。

复制和清理采用文件树遍历管理资源，IO 异常通过方法声明传递给调用方。复制不是事务操作，中途失败可能留下部分结果；调用期间应保持目录及链接关系稳定。


## 清空与删除目录

`FileUtil.clean(directory)` 清空普通目录的内容并保留目录本身；`FileUtil.del(file)` 删除文件或整棵目录树。遍历默认不跟随符号链接，目录中的链接作为独立条目删除，链接指向的数据保留。

直接向 clean 传入目录符号链接时，方法保持链接及其目标不变；del 可以删除链接本身，包括目标已经不存在的悬空链接。普通目录清理按文件树顺序执行，IO 异常传递给调用方，便于统一处理。

```java
import java.io.File;
import nexus.io.tio.utils.hutool.FileUtil;

public class DirectoryCleanupExample {
  public boolean clearOwnedDirectory(File directory) throws Exception {
    return FileUtil.clean(directory);
  }
}
```

应仅对业务明确拥有的目录执行清理，并在操作期间保持目录和链接关系稳定。清理不是事务操作，失败前已删除的条目不会自动恢复。


## 文件列表遍历

`FileUtil.loopFiles` 遍历目录树中的普通文件，支持按文件过滤。遍历不跟随符号链接，传入链接本身时返回空列表，适合限定在当前目录树内收集文件。过滤器作用于文件，不影响对子目录的遍历；结果顺序由文件系统决定。

```java
import java.io.File;
import java.util.List;
import nexus.io.tio.utils.hutool.FileUtil;

public class DirectoryListExample {
  public List<File> textFiles(File directory) {
    return FileUtil.loopFiles(directory, file -> file.getName().endsWith(".txt"));
  }
}
```

null 或不存在的路径返回空列表；普通文件按过滤结果返回单元素或空列表。无法访问目录等 IO 错误通过 `RuntimeException` 传递，原因异常保留原始 `IOException`，便于调用方区分没有匹配文件和遍历未完成。
