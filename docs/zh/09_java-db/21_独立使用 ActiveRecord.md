# 独立使用 ActiveRecord

ActiveRecordPlugin 可以独立于 java web 环境运行在任何普通的 java 程序中，使用方式极度简单，相对于 web 项目只需要手动调用一下其 start() 方法即可立即使用。以下是代码示例：

```
public class ActiveRecordTest {
  public static void main(String[] args) {
    DruidPlugin dp = new DruidPlugin("localhost", "userName", "password");
    ActiveRecordPlugin arp = new ActiveRecordPlugin(dp);
    arp.addMapping("blog", Blog.class);

    // 与 jfinal web 环境唯一的不同是要手动调用一次相关插件的start()方法
    dp.start();
    arp.start();

    // 通过上面简单的几行代码，即可立即开始使用
    new Blog().set("title", "title").set("content", "cxt text").save();
    Blog.dao.findById(123);
  }
}
```

注意：ActiveRecordPlugin 所依赖的其它插件也必须手动调用一下 start()方法，如上例中的 dp.start()。
jfinal 的 activerecord 模块已被独立发布到了 maven 库，如果只想使用 jfinal activerecord 模块而不想引入整个 jfinal 的可以使用下面的坐标：

```
<dependency>
    <groupId>com.jfinal</groupId>
    <artifactId>activerecord</artifactId>
    <version>5.1.2</version>
</dependency>
```

独立使用该模块的用法与在 jfinal 中使用时完全一样

特别注意：activerecord 模块中包含了 enjoy template 模块，如果要使用 enjoy 模板引擎，直接使用就好，无需引入 enjoy template 模块的 maven 依赖，否则会造成冲突。
如果是与 spring boot 整合使用，可以参考这篇文章：https://blog.csdn.net/suxiaoqiuking/article/details/78999857
