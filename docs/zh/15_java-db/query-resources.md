# 查询资源自动管理

## 结果集、语句和连接

`DbPro.queryListBytes`、SQL 查询形式的 `find`、按 Row 条件查询的 `find` 和 `findByField` 在每次调用中管理自己创建的 JDBC 语句与结果集。返回的是已经读取完成的数据，调用方不需要关闭返回的列表。

```java
import java.util.List;
import nexus.io.db.activerecord.Db;
import nexus.io.db.activerecord.DbPro;

public class BinaryQueryExample {
  public List<byte[]> payloads(long ownerId) {
    DbPro db = Db.use();
    return db.queryListBytes("select payload from files where owner_id = ?", ownerId);
  }
}
```

`queryListBytes` 面向单列二进制结果，每行通过 JDBC `getBytes` 读取，SQL NULL 保留为 `null`。多列结果应选择适合其结构的查询方法。

查询入口统一管理参数绑定、执行和结果读取阶段的资源，按 ResultSet、PreparedStatement 的顺序完成清理。业务代码可以专注于查询与数据处理，资源清理覆盖正常返回和异常退出。

接收 `Config`、`Connection` 的底层重载不会关闭调用方传入的连接。常用的不带连接参数的入口由配置管理连接归还；事务中的查询保留线程绑定连接，交给外层事务完成提交、回滚和释放。

## 保留异常原因

SQL 操作失败时通过 `ActiveRecordException` 保留原因。若读取本身失败，同时关闭结果集或语句也失败，读取异常仍是主要原因，关闭异常作为其 suppressed exceptions 保存，便于同时定位查询和清理过程。

```java
import nexus.io.db.activerecord.ActiveRecordException;

public class QueryFailureExample {
  public Throwable[] cleanupFailures(ActiveRecordException exception) {
    Throwable cause = exception.getCause();
    if (cause == null) {
      return exception.getSuppressed();
    }
    return cause.getSuppressed();
  }
}
```

