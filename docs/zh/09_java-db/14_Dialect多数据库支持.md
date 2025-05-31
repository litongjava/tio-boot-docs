# Dialect 多数据库支持

目前 ActiveRecordPlugin 提供了 MysqlDialect、OracleDialect、PostgresqlDialect、SqlServerDialect、Sqlite3Dialect、AnsiSqlDialect 实现类。MysqlDialect 与 OracleDialect 分别实现对 Mysql 与 Oracle 的支持，AnsiSqlDialect 实现对遵守 ANSI SQL 数据库的支持。以下是数据库 Dialect 的配置代码：

```
public class DemoConfig extends JFinalConfig {
  public void configPlugin(Plugins me) {
    ActiveRecordPlugin arp = new ActiveRecordPlugin(…);
    me.add(arp);
    // 配置Postgresql方言
    arp.setDialect(new PostgresqlDialect());
  }
}
```
