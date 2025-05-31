# Oracle 支持

Oracle 数据库具有一定的特殊性，JFinal 针对这些特殊性进行了一些额外的支持以方便广大的 Oracle 使用者。以下是一个完整的 Oracle 配置示例：

```
public class DemoConfig extends JFinalConfig {
  public void configPlugin(Plugins me) {
    DruidPlugin dp = new DruidPlugin(……);
    me.add(dp);
    //配置Oracle驱动，使用 DruidPlugin 时可以省略下面这行配置
    dp.setDriverClass("oracle.jdbc.driver.OracleDriver");

    ActiveRecordPlugin arp = new ActiveRecordPlugin(dp);
    me.add(arp);
    // 配置Oracle方言
    arp.setDialect(new OracleDialect());
    // 配置属性名(字段名)大小写不敏感容器工厂
    arp.setContainerFactory(new CaseInsensitiveContainerFactory());
    arp.addMapping("user", "user_id", User.class);
  }
}
```

由于 Oracle 数据库会自动将属性名(字段名)转换成大写，所以需要手动指定主键名为大写，如：arp.addMaping(“user”, “ID”, User.class)。如果想让 ActiveRecord 对属性名（字段名）的大小写不敏感可以通过设置 CaseInsensitiveContainerFactory 来达到，有了这个设置，则 arp.addMaping(“user”, “ID”, User.class)不再需要了。

另外，Oracle 并未直接支持自增主键，JFinal 为此提供了便捷的解决方案。要让 Oracle 支持自动主键主要分为两步：一是创建序列，二是在 model 中使用这个序列，具体办法如下：
1：通过如下办法创建序列，本例中序列名为：MY_SEQ

```
CREATE SEQUENCE MY_SEQ
 INCREMENT BY 1
 MINVALUE 1
 MAXVALUE 9999999999999999
 START WITH 1
 CACHE 20;
```

2：在 YourModel.set(…)中使用上面创建的序列

```
// 创建User并使用序列
User user = new User().set("id", "MY_SEQ.nextval").set("age", 18);
user.save();
// 获取id值
Integer id = user.get("id");
```

序列的使用很简单，只需要 yourModel.set(主键名, 序列名 + “.nextval”)就可以了。特别注意这里的 “.nextval” 后缀一定要是小写，OracleDialect 对该值的大小写敏感。

注意：Oracle 下分页排序 Sql 语句必须满足 2 个条件：

Sql 语句中必须有排序条件；

排序条件如果没有唯一性，那么必须在后边跟上一个唯一性的条件，比如主键

相关博文：http://database.51cto.com/art/201010/231533.htm

相关反馈：http://www.jfinal.com/feedback/64#replyContent
