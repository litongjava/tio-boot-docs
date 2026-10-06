# JSON 泛型转换与输出配置

## 明确 Map 的键和值类型

`parseToMap(json, keyType, valueType)` 和 `parseToListMap(json, keyType, valueType)` 使用传入的类型信息构造结果。FastJson2、Jackson 以及对应静态工具类遵循相同的类型约定；选择这些解析后端的 `JsonUtils` 调用也按此约定处理。

```java
import java.util.List;
import java.util.Map;
import nexus.io.tio.utils.json.FastJson2Utils;

public class TypedJsonExample {
  public Map<Integer, Setting> settings(String json) {
    return FastJson2Utils.parseToMap(json, Integer.class, Setting.class);
  }

  public List<Map<Integer, Setting>> batches(String json) {
    return FastJson2Utils.parseToListMap(json, Integer.class, Setting.class);
  }

  public static class Setting {
    private String name;

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }
  }
}
```

例如 `{"7":{"name":"demo"}}` 转换后，键为 Integer `7`，值为 Setting 实体，可以直接调用实体方法。字段结构确定时，应传入对应的实体类型。

## 区分 null 与空列表

对列表 Map 的转换：

| JSON 输入 | 结果 |
| --- | --- |
| null | Java null |
| [] | 空列表 |
| [null, {}] | 两个元素，分别为 null 和空 Map |

这里的输入 `null` 指 JSON 文本中的 null。Java 的 null 字符串参数如何处理仍由具体后端约定，不应混为一谈。列表中的 null 不会被丢弃，元素顺序保持不变。

## JacksonUtils 的 null 输出策略

`JacksonUtils.setGenerateNullValue(false)` 省略 null 字段，设置为 true 后恢复输出；字符串和 UTF-8 字节输出使用同一策略。每次序列化使用独立配置副本，共享 Mapper 的配置保持稳定，便于统一管理解析和输出策略。

该开关是全局配置，应在初始化阶段确定。需要同时使用不同策略时，使用独立的 `Jackson` 实例：

```java
import nexus.io.tio.utils.json.Jackson;

public class JsonOutputExample {
  private final Jackson includeNulls = new Jackson(true);
  private final Jackson omitNulls = new Jackson(false);

  public String complete(Object value) {
    return includeNulls.toJson(value);
  }

  public String compact(Object value) {
    return omitNulls.toJson(value);
  }
}
```

解析与序列化配置分别管理，省略 null 的输出策略不会删除输入 JSON 中的 null 值。


## Java record 的结构化输出

使用 Java record 表达固定请求、响应或审批快照，可以让字段集合与构造参数保持一致。TioJson 按声明的组件名称输出 JSON 对象，嵌套 record、集合及空 record 均可使用；名为 `getName`、`isReady` 的组件保持原名。空值输出沿用统一配置，长整数可使用字符串输出，便于前端保存雪花 ID 的完整精度。

```java
import java.util.List;
import nexus.io.tio.utils.json.TioJson;
import nexus.io.tio.utils.snowflake.SnowflakeIdUtils;

public class ApprovalSnapshotExample {
  public record Item(String id, String name, String note) { }
  public record Snapshot(List<Item> items, boolean confirmed) { }

  public String snapshot() {
    Item item = new Item(Long.toString(SnowflakeIdUtils.id()), "组织申请", null);
    TioJson json = new TioJson();
    json.setSkipNullValueField(true);
    return json.toJson(new Snapshot(List.of(item), true));
  }
}
```

上述代码运行于支持 record 的 Java 环境。序列化实现通过反射识别组件，保留基础库的旧 Java 编译兼容性。反序列化可使用已配置解析实现的 `JsonUtils.parse(json, Snapshot.class)`；完整性校验和当前业务授权仍应在服务层执行。

持久审批载荷应保存为 JSON 对象并在执行前重新校验权限。原操作摘要属于持久业务协议：调整序列化方式时，应保留旧摘要的精确匹配能力，避免同一原请求被误判为新意图；不要根据新的字段集合重新构造旧审批内容。
