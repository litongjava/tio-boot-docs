# Model

### 1、基本用法

Model 是 ActiveRecord 中最重要的组件之一，它充当 MVC 模式中的 Model 部分。以下是 Model 定义示例代码：

```
public class User extends Model<User> {
    public static final User dao = new User().dao();
}
```

以上代码中的 User 通过继承 Model，便立即拥有的众多方便的操作数据库的方法。在 User 中声明的 dao 静态对象是为了方便查询操作而定义的，该对象并不是必须的。基于 ActiveRecord 的 Model 无需定义属性，无需定义 getter、setter 方法，无需 XML 配置，无需 Annotation 配置，极大降低了代码量。

以下为 Model 的一些常见用法：

```java
// 创建name属性为James,age属性为25的User对象并添加到数据库
new User().set("name", "James").set("age", 25).save();

// 删除id值为25的User
User.dao.deleteById(25);

// 查询id值为25的User将其name属性改为James并更新到数据库
User.dao.findById(25).set("name", "James").update();

// 查询id值为25的user, 且仅仅取name与age两个字段的值
User user = User.dao.findByIdLoadColumns(25, "name, age");

// 获取user的name属性
String userName = user.getStr("name");

// 获取user的age属性
Integer userAge = user.getInt("age");

// 查询所有年龄大于18岁的user
List<User> users = User.dao.find("select * from user where age>18");

// 分页查询年龄大于18的user,当前页号为1,每页10个user
Page<User> userPage = User.dao.paginate(1, 10, "select *", "from user where age > ?", 18);
```

以上用法将 dao 对象声明在了 model 中仅为方便展示，在实际应用中应该将 dao 对象放在 Service 中，并且让其成为 private，这样可以保障 sql 以及数据库操作被限定在 service 层中。可以通过下载官网首页的 jfinal_demo_for_maven 来参考 dao 在 Service 层中的用法。

特别注意：User 中定义的 public static final User dao 对象是全局共享的，只能用于数据库查询，不能用于数据承载对象。数据承载需要使用 new User().set(…)来实现。

### 2、常见错误

有不少用户经常在使用 model.find(....) 这类方法时碰到 NullPointerException 异常，通常是由于该 model 没有使用 ActionRecordPlugin.addMapping(....) 进行过映射。 建议通过生成器自动化生成映射，无需手工添加这类代码，生成器在本站首页下载 jfinal demo，里面有提供。
