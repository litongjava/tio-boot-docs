# Row 展示转换与表格导出

## 转换为 Kv

`RowUtils.toKv` 创建新的 Kv，并将顶层 Long 和 BigInteger 转为字符串，方便展示较大的整数。传入 true 时，将字段名从下划线形式转换为驼峰形式。原始 Row 中的值和类型保持不变。

```java
import com.jfinal.kit.Kv;
import nexus.io.db.activerecord.Row;
import nexus.io.kit.RowUtils;

public class RowViewExample {
  public Kv view(Row row) {
    return RowUtils.toKv(row, true);
  }
}
```

例如 `user_id` 为 Long 时，结果的 `userId` 是字符串，而原 Row 的 `user_id` 仍为 Long。修改结果 Kv 的顶层字段不会改写原 Row；这不是深拷贝，未转换的嵌套对象仍可能共享引用。

## 表格列顺序

`RowUtils.getListData(records, size)` 使用第一条 Row 的列名作为整张表的字段顺序，并按名称读取后续各行。`HtmlTableUtils.to` 和 `MarkdownTableUtils.to` 使用相同的规则。

- 后续 Row 的内部字段排列顺序不影响表头与值的对应关系。
- 后续行缺少的列使用 null 占位，表格输出显示为 NULL。
- 后续行独有的额外列不加入第一行确定的表结构。
- Map 和 List 值序列化为 JSON 文本；PGobject 使用其已有文本值，不再额外增加一层 JSON 引号。

```java
import java.util.List;
import nexus.io.db.activerecord.Row;
import nexus.io.db.utils.HtmlTableUtils;
import nexus.io.db.utils.MarkdownTableUtils;

public class TableViewExample {
  public String html(List<Row> rows) {
    return HtmlTableUtils.to(rows);
  }

  public String markdown(List<Row> rows) {
    return MarkdownTableUtils.to(rows);
  }
}
```

空记录列表的两个表格入口保留返回 null 的行为。调用 `getListData` 时，size 应位于 0 到记录数之间。导出期间应避免并发修改记录集合及字段。
