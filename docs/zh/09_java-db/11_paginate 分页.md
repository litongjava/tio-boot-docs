# paginate 分页

### 1、常用 paginate

Model 与 Db 中提供了最常用的分页 API：paginate(int pageNumber, int pageSize, String select, String sqlExceptSelect, Object... paras)

其中的参数含义分别为：当前页的页号、每页数据条数、sql 语句的 select 部分、sql 语句除了 select 以外的部分、查询参数。绝大多数情况下使用这个 API 即可。以下是使用示例：

```
dao.paginate(1, 10, "select *", "from girl where age > ? and weight < ?", 18, 50);
```

### 2、sql 最外层带 group by 的 paginate

API 原型：paginate(int pageNumber, int pageSize, boolean isGroupBySql, String select, String sqlExceptSelect, Object... paras)，相对于第一种仅仅多了一个 boolean isGroupBySql 参数，以下是代码示例：

```
dao.paginate(1, 10, true, "select *", "from girl where age > ? group by age", 18);
```

以上代码中 sql 的最外层有一个 group by age，所以第三个参数 isGroupBySql 要传入 true 值。

如果是嵌套型 sql，但是 group by 不在最外层，那么第三个参数必须为 false，例如：select \* from (select x from t group by y) as temp。

再次强调：isGroupBy 参数只有在最外层 sql 具有 group by 子句时才能为 true 值，嵌套 sql 中仅仅内层具有 group by 子句时仍然要使用 false。

### 3、paginateByFullSql

API 原型：paginateByFullSql(int pageNumber, int pageSize, String totalRowSql, String findSql, Object... paras)。
相对于其它 paginate API，将查询总行数与查询数据的两条 sql 独立出来，这样处理主要是应对具有复杂 order by 语句或者 select 中带有 distinct 的情况，只有在使用第一种 paginate 出现异常时才需要使用该 API，以下是代码示例：

```
String from = "from girl where age > ?";
String totalRowSql = "select count(*) " + from;
String findSql = "select * " + from + " order by age";
dao.paginateByFullSql(1, 10, totalRowSql, findSql, 18);
```

上例代码中的 order by 子句并不复杂，所以仍然可以使用第一种 API 搞定。

重点：paginateByFullSql 最关键的地方是 totalRowSql、findSql 这两条 sql 要能够共用最后一个参数 Object... paras，相当于 dao.find(totalRowSql, paras) 与 dao.find(findSql, paras) 都要能正确执行，否则断然不能使用 paginateByFullSql。
当 paginate、paginateByFullSql 仍然无法满足业务需求时，可以通过使用 Model.find、Db.query 系列方法组合出自己想要的分页方法。jfinal 只为最常见场景提供支持。

### 4、使用 SqlPara 参数的 paginate

API 原型： paginate(int pageNumber, int pageSize, SqlPara sqlPara)，用于配合 sql 管理功能使用，将在 sql 管理功能那章做介绍。

### 5、常见问题解决

首先必须要介绍一下 paginate 底层的基本实现原理，才能有效呈现和解决问题，假定有如下分页代码：

```
paginate(1, 5, "select *", "from article where id > ? order by id", 10);
```

底层首先会利用上面第三个与第四个 String 参数生成如下 sql 去获取分页所需要的满足查询条件的所有记录数，也叫 totalRow：

```
"select count(*)" + "from article where id > 10"
```

注意看上面的 sql，第一部分的 "select count(\*)" 是固定写死的，第二部分是根据用户的第四个参数，去除 order by id 而得到的。

去除 order by 子句这部分，一是因为很多数据库根本不支持 select count(_) 型 sql 带有 order by 子句，必须要去掉否则出错。二是因为 select count(_) 查询在有没有 order by 子句时结果是完全一样的，所以去除后有助于提升性能。

第一类错误： 如果用户分页的第二个参数不是 "select \*" ，而是里面带有一个或多个问号占位符，这种情况下最后面的 para 部分不仅仅只有上例中的 10 这一个参数

以下是这种问题的一个例子：

```
paginate(1, 5, "select (... where x = ?)", "from article where id=?", 8, 10)
```

注意看上面的例子中有两个问号占位符，对应的参数值是 8 和 10。但是生成的用于计算 totalRow 的代码如下：

```
queryLong("select count(*) from article where id=?", 8, 10);
```

因此，多出来一个参数 8 是多余的，从而造成异常。出现这种情况只需要在外层再套一个 sql 就可解决：

```
paginate(1, 5, "select *", "from (" + 原sql在此 + ") as t", 8, 10);
```

也就是将原来的 sql 外层再套一个 select _ from (...) as t ，让第三个参数中没有问号占位符而是一个 "select _" 。这样处理就避免掉了第一个问号占位符被生成 totalRow 的 sql 吃掉了。
第二类错误： 如果 order by 子句使用了子查询，或者使用了函数调用，例如：

```
paginate(1, 5, "select *", "from ... order by concat(...)");
```

如上所示，order by 子句使用了 concat 函数，由于 jfinal 是使用了一个简单的正则来移除 order by 子句的，但是无法完全移除带有函数的 order by 子句，也就是移除不干净，结果就是 sql 是错误的。

jfinal 也曾使用复杂的正则来将 order by 子句移除干净，但性能低得无法忍受，最后只能取舍使用简单正则。 由于 order by 子句可以是极为复杂的嵌套 sql ，所以要移除干净的代价就是性能的急剧下降，jfinal 也是不得以这样设计。

所以，解决第二类常见错误就是使用 paginateByFullSql 方法，这个方法让你的计算 totalRow 的 sql 与查询数据的 sql 完全手写，jfinal 也就不再需要处理 select 部分与移除 order by 这部分，全交由用户自己手写。

综上，只要了解了 paginate 在底层的工作机制，解决问题就很容易了。最终可以通过 paginateByFullSql 来稍多写点代码来解决。
