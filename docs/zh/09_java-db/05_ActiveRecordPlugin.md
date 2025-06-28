# ActiveRecord

## 概述

ActiveRecord 是 JFinal-Plugins 最核心的组成部分之一，通过 ActiveRecord 来操作数据库，将极大地减少代码量，极大地提升开发效率。

ActiveRecord 模式的核心是：一个 Model 对象唯一对应数据库表中的一条记录，而对应关系依靠的是数据库表的主键值。

因此，ActiveRecord 模式要求数据库表必须要有主键。当数据库表没有主键时，只能使用 Db + Row 模式来操作数据库。
添加了 sql 管理模块，比 mybatis 使用 XML 管理 sql 的方案要爽得多.

# ActiveRecordPlugin

ActiveRecordPlugin 用与连接数据数据

以下是 Plugin 配置示例代码：

```java
public class ActiveRecordPluginConfig{
  public void configPlugin() {
    DruidPlugin dp = new DruidPlugin("jdbc:mysql://localhost/db_name", "userName", "password");
    ActiveRecordPlugin arp = new ActiveRecordPlugin(dp);
    me.add(arp);
    arp.addMapping("user", User.class);
    arp.addMapping("article", "article_id", Article.class);

    dp.start();
    arp.start();
  }
}
```

以上代码配置了两个插件：DruidPlugin 与 ActiveRecordPlugin，前者是 druid 数据源插件，后者是 ActiveRecrod 支持插件。ActiveReceord 中定义了 addMapping(String tableName, Class<? extends Model> modelClass>)方法，该方法建立了数据库表名到 Model 的映射关系。

另外，以上代码中 arp.addMapping("user", User.class)，表的主键名为默认为 "id"，如果主键名称为 "user_id" 则需要手动指定，如：arp.addMapping("user", "user_id", User.class)。

重要：以上的 arp.addMapping(...) 映射配置，可以让 ActiveRecord 生成器自动化完成，不再需要手动添加这类配置，具体用法见文档：
