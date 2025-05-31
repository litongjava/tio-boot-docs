# Enjoy SQL 模板

JFinal 利用自带的 Enjoy Template Engine 极为简洁的实现了 Sql 模板管理功能。一如既往的极简设计，仅有 #sql、#para、#namespace 三个指令，学习成本依然低到极致。

重要：除了以上三个 sql 管理专用指令以外，jfinal 模板引擎的所有指令和功能也可以用在 sql 管理，jfinal 模板引擎用法见第 6 章：http://www.jfinal.com/doc/6-1

## 1、基本配置

在 ActiveRecordPlugin 中使用 sql 管理功能示例代码如下：

```
ActiveRecordPlugin arp = new ActiveRecordPlugin(druidPlugin);
arp.addSqlTemplate("all.sql");
_MappingKit.mapping(arp);
me.add(arp);
```

如上例所示，ar.addSqlTemplate("all.sql") 将从 class path 或者 jar 包中读取 "all.sql" 文件。

可以通过多次调用 addSqlTemplate 来添加任意多个外部 sql 文件，并且对于不同的 ActiveRecordPlugin 对象都是彼此独立配置的，有利于多数据源下对 sql 进行模块化管理。

可以将 sql 文件放在 maven 项目下的 src/main/resources 之下，编译器会自动将其编译至 class path 之下，进而可以被读取到，打包进入 jar 包中以后也可以被读到。

如果希望在开发阶段可以对修改的 sql 文件实现热加载，可以配置 arp.setDevMode(true)，如果不配置则默认使用 configConstant 中的 me.setDevMode(…) 配置。

特别注意：sql 管理模块使用的 Engine 对象并非在 configEngine(Engine me)配置，因此在对其配置 shared method、directive 等扩展时需要使用 activeRecordPlugin.getEngine() 先得到 Engine 对象，然后对该 Engine 对象进行配置。

## 2、#sql 指令

#sql 指令用于定义 sql 模板，如下是代码示例：

```
#sql("findGirl")
  select * from girl where age > ? and age < ? and weight < 50
#end
```

上例通过 #sql 指令在模板文件中定义了 sqlkey 为 "findGirl" 的 sql 模板，在 java 代码中的获取方式如下：

```
String sql = Db.getSql("findGirl");
Db.find(sql, 16, 23);
```

上例中第一行代码通过 Db.getSql() 方法获取到定义好的 sql 语句，第二行代码直接将 sql 用于数据库查询。

此外，还可以通过 Model.getSql(key) 方法来获取 sql 语句，功能与 Db.getSql(key) 完全一样。

## 3、#para 指令

### 3.1 使用 int 常量 #para(int)

#para 指令用于生成 sql 模板中的问号占位符以及问号占位符所对应的参数值，两者分别保存在 SqlPara 对象的 sql 和 paraList 属性之中。

#para 指令支持两种用法，一种是传入 int 型常量参数 的用法，如下示例展示的是 int 型常量参数的用法：

```
#sql("findGirl")
  select * from girl where age > #para(0) and weight < #para(1)
#end
上例代码中两个 #para 指令，传入了两个 int 型常量参数，所对应的 java 后端代码必须调用 getSqlPara(String key, Object… paras)，如下是代码示例：

// Db.template 用法（jfinal 4.0 新增）
Db.template("findGirl", 18, 50).find();

// Model.template 用法完全一样，以下假定 girl 为 Model
girl.template("findGirl", 18, 50).find();

// getSqlPara 用法
SqlPara sqlPara = Db.getSqlPara("findGirl", 18, 50);
Db.find(sqlPara);
```

以上第一行代码中的 18 与 50 这两个参数，分别被前面 #sql 指令中定义的 #para(0) 与 #para(1) 所使用。

Db.template(String key, Object... paras) 与 Db.getSqlPara(String key, Object... paras) 方法的第二个参数 Object... paras，在传入实际参数时，下标值从 0 开始算起与 #para(int) 指令中使用的 int 型常量一一对应。

jfinal 4.0 新增的 template(...) 用法与 getSqlPara(...) 所接受的参数完全一样，所以两者在本质上完全一样。

新增的 template(...) 方法仅仅是为了减少代码量，提升开发体验，在功能上与 getSqlPara 完全一样，对于已经熟悉 getSqlPara 用法的同学不会增加学习成本。

### 3.2 使用非 int 常量 #para(expr)

#para 指令的另一种用法是传入除了 int 型常量以外的任意表达式参数 (注意：两种用法处在同一个 #sql 模板之中时只能选择其中一种)，如下是代码示例：

```
#sql("findGirl")
  select * from girl where age > #para(age) and weight < #para(weight)
#end
```

与上例模板文件配套的 java 代码如下所示：

```
// 构造参数
Kv cond = Kv.of("age", 18).set("weight", 50);

// 使用 Db 的 template 方法
Db.template("findGirl", cond).find();

// 使用 Model 的 template 方法，以下假定 girl 为 Model
girl.template("findGirl", cond).find();
```

上例代码获取到的 SqlPara 对象 sqlPara 中封装的 sql 为：select \* from girl where age > ? and weight < ?，封装的与 sql 问号占位符次序一致的参数列表值为：[18, 50]。

### 3.3 #para(int) 与 #para(expressioin) 比较

指令参数：#para(int) 参数必须传入 int 型常量，#para(expression) 参数是除了 int 型常量以外的任意表达式

java 参数：template 的第二个参数，对应 #para(int) 时必须是 Object... paras，对应 #para(expression) 时必须是 Map。

```
#para(int) 用法示例：

// #para(int) 用法
#sql("findGirl")
   select * from girl where age > #para(0) and weight < #para(1)
#end

// 对应于 #para(int) 指令，第二个参数必须是 Object... paras
Db.template("findGirl", 18, 50).find();

// Model.template 使用方法完全一样
girl.template("findGirl", 18, 50).find();
```

#para(expression) 用法示例：

```
// #para(expression) 用法
#sql("findGirl")
   select * from girl where age > #para(age) and weight < #para(weight)
#end

// 构造 Nap 参数，下面的 Kv 是 Map 的子类
Kv cond = Kv.of("age", 18,).set("weight", 50);

// 对应于 #para(expression) 指令，第二个参数必须是 Map 或者其子类
Db.template("findGirl", cond).find()

// Model.template 使用方法完全一样
girl.template("findGirl", cond).find()
```

简单一句话：#para(int) 用下标获取参数值，#para(expr) 用名称获取参数值，所对应的 getSqlPara(...)、template(...) 方法参数自然就是 Object... 与 Map。

以上两个示例，获取到的 SqlPara 对象中的值完全一样。其中的 sql 值都为：select \* from girl where age > ? and weight < ?，其中的参数列表值也都为 [18、50]。

重要： #para 指令所到之处永远是生成一个问号占位符，并不是参数的值，参数值被生成在了 SqlPara 对象的 paraList 属性之中，通过 sqlPara.getPara()可获取。如果想生成参数值用一下模板输出指令即可：#(value)

极其重要的通用技巧：如果某些数据库操作 API 不支持 SqlPara 参数，而只支持 String sql 和 Object… paras 这两个参数，可以这样来用：method(sqlPara.getSql(), sqlPara.getPara())。这样就可以让所有这类 API 都能用上 Sql 管理功能。

加餐：有些同学希望在 sql 文件中获取 template(String, Object... paras)、getSqlPara(String, Object… paras) 方法传入的 paras 参数，可以通过表达式 _PARA_ARRAY_[index] 来获取到下标为 index 的参数值。

由于经常有人问到 mysql 数据库 sql 语句的 like 子句用法，补充如下示例：

```
#sql("search")
  ### #para 指令用法
  select * from article where title like concat('%', #para(0), '%')

  ### java 代码用法，大家可以自行扩展一个 #like 指令，在添加 value 的时候自动添加 % 前缀与后缀
  ### Db.find("select * from article where title like ?", "%" + value + "%")
#end
```

以上示例的 like 用法完全是 JDBC 决定的，JFinal 仅仅是生成了如下 sql 而已：

select \* from article where title like concat('%', ?, '%')，也就是仅仅将 #para(0) 替换生成为一个问号占位 ”?” 而已。

如果你使用是其它数据库（不支持 concat 函敉），like 的用法如下：

```
#sql("search")
  select * from article where title like #para(0)
#end
```

注意，在传入参数的时候要将参数添加上百分号字符 '%'

```
String title = "要搜索的关键词";
// 注意添加百分号字符
title = "%" + title + "%";
dao.template("search", title).find();
```

以上用法 mysql 也同样支持，唯一的缺点就是要对搜索入参追加百分号字符。当然，如果其它数据库也有像 concat 类似的函数应该也可以像 mysql 那样去用，多多尝试。

### 3.4 #para 指令支持 like 与 in 子句（5.0.0 版新增功能）

```
### 一般用法，第二个参数传入 "like"、"in" 参数即可
```

select _ from t title like #para(title, "like")
select _ from t title id in #para(idList, "in")

```
### like 类型第一个参数支持 int 类型
select * from t title like #para(0, "like")

### like 支持左侧与右侧百分号用法
select * from t title like #para(title, "%like")
select * from t title like #para(title, "like%")

### 警告：对于 in 子句，如果 #para 第一个参数是 int 型，并且 java 代码针对 Object... 参数传入的是数组
select * from t id in #para(0, "in")
### 那么 java 代码中要将 Object... 处的参数强制转成 Object，否则参数传递不正确（建议这种情况传入List参数）
Integer[] idArray = {1, 2, 3};
Db.template("findByIdArray", (Object)idArray).find();
```

### 4、#namespace 指令

#namespace 指令为 sql 语句指定命名空间，不同的命名空间可以让#sql 指令使用相同的 key 值去定义 sql，有利于模块化管理，如下所示：

```
#namespace("japan")
  #sql("findGirl")
    select * from girl where age > #para(0) and age < #para(1) and weight < 50
  #end
#end
```

上面代码指定了 namespace 为”japan”，在使用的时候，只需要在 key 前面添加 namesapce 值前缀 + 句点符 + key 即可：

```
Db.template("japan.findGirl", 17, 21).find();
```

## 5、template() 与 getSqlPara()

为了进一步减少代码量，提升开发体验，jfinal 4.0 新增了 template 方法，该方法在本质上与 getSqlPara 用法完全一样，所以传递的参数完全一样，都是：String sqlKey、Object... paras 或者 String sqlKey、Map paras。

在 template 方法可以使用链式调用直接去查询，而 getSqlPara 则是先得到 sql + para ，然后再将其传递给查询方法进行查询。

## 6、templateByString()

如果希望将 sql 模板放在 String 变量之中而不是放在外部的文件之中，可以使用 templateByString 方法，例如：

```
// 将 sql 模板存放在 String 变量中，注意：此时不再需要 #sql、#namespace 指令
String sqlTemplate = "select * from girl where age > #para(0) and weight < #para(1)"

// templateByString 将从 String 变量中加载模板
Db.templateByString(sqlTemplate, 18, 50).find();

// Model 也支持 templateByString 方法
girl.templateByString(sqlTemplate, 18, 50).find();
```

templateByString 与 template 的用法基本一样，区别在于前者从 String 变量中获取模板并且不支持 #namespace、#sql 指令，后者从外部文件中获取模板。

## 7、分页用法

Sql 管理实现分页功能，在使用 #sql 定义 sql 时，与普通查询完全一样，不需要使用额外的指令，以下是代码示例：

```
// Db.template 用法
Db.template("findGirl", 18, 50).paginate(1, 10);

// Model.template 用法，以下假定 girl 为 Model
girl.template("findGirl", 18, 50).paginate(1, 10);

// getSqlPara 用法
SqlPara sqlPara = Db.getSqlPara("findGirl", 18, 50);
Db.paginate(1, 10, sqlPara);
```

template 与 getSqlPara 用法参数完全一样，都是 "findGirl"、18、50 这三个，前者更省代码。

## 8、高级用法

除了#sql、#para、#namespace 之外，还可以使用 JFinal Template Engine 中所有存在的指令，生成复杂条件的 sql 语句，以下是相对灵活的示例：

```
#sql("find")
  select * from girl
  #for(x : cond)
    #(for.first ? "where": "and") #(x.key) #para(x.value)
  #end
#end
```

以上代码#for 指令对 Map 类型的 cond 参数进行迭代，动态生成自由的查询条件。上图中的三元表达式表示在第一次迭代时生成 where，后续则生成 and 。#(x.key) 输出参数 key 值，#para(x.value) 输出一个问号占位符，以及将参数 value 值输出到 SqlPara.paraList 中去。

以上 sql 模板所对应的 java 代码如下：

```
Kv cond = Kv.of("age > ", 16).set("sex = ", "female");
Db.template("find", Kv.of("cond", cond)).find();
```

以上第一行代码是 JFinal 独创的参数带有比较运算符的用法，可以同时生成 sql 查询条件名称、条件运算符号、参数列表，一石三鸟。甚至可以将此法用于 and or not 再搭配一个 LinkedHashMap 生成更加灵活的逻辑组合条件 sql。

更加好玩的用法，可以用 jfinal 模板引擎的 #define 指令将常用的 sql 定义成通用的模板函数，以便消除重复性 sql 代码。总之，利用 #sql、#para、#namespace 这三个指令再结合模板引擎已有指令自由组合，可非常简洁地实现极为强大的 sql 管理功能。

注意：以上例子中的 Kv 是 JFinal 提供的用户体验更好的 Map 实现，使用任意的 Map 实现都可以，不限定为 Kv。

## 9、多数源支持

多数源下，Model.getSql(...) 与 Model.getSqlPara(...) 会自动从该 Model 所对应的 ActiveRecordPlugin 配置的 sql 模板中去取 sql。

Db.getSql(...) 与 Db.getSqlPara(...) 会从主数据源对应的 ActiveRecordPlugin 配置的 sql 模板中去取 sql。如果要使用别的数据源的 sql，使用一下 Db.use(...) 即可：

```
// template 用法
Db.use(otherDataSource).template(sqlKey, para).find();

// getSqlPara 用法
SqlPara sqlPara = Db.use(otherDataSource).getSqlPara(sqlKey, para);
Db.use(otherDataSource).find(sqlPara);
```

在多数据源下， template 用法显然比 getSqlPara 方法更省代码，在可以满足需求的前提下尽可能使用 template 方法。

## 10、对 sql 内容进行压缩

jfinal 4.9 对 Engine 添加了空白压缩功能，该功能也可以用于 sql 模板：

```
ActiveRecordPlugin arp = new ActiveRecordPlugin(...);
Engine engine = arp.getEngine();

engine.setCompressorOn(' ');
```

以上第三行代码配置开启了空白压缩功能，除了配置空格为压缩分隔字符以外，还可以配置换行字符 '\n' 为压缩分隔字符：

```
engine.setCompressorOn('\n');
```
