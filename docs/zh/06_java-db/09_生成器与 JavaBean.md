# 生成器与 JavaBean

### 1、生成器的使用

ActiveRecord 模块的 com.jfinal.plugin.activerecord.generator 包下，提供了一个 Generator 工具类，可自动生成 Model、BaseModel、MappingKit、DataDictionary 四类文件。

生成后的 Model 将与 java bean 合体，立即拥有了 getter、setter 方法，使之遵守传统的 java bean 规范，立即拥有了传统 JavaBean 所有的优势，开发过程中不再需要记忆字段名。

使用生成器通常只需配置 Generator 的四个参数即可，以下是具体使用示例：

```
// model 所使用的包名 (MappingKit 默认使用的包名)
String modelPackageName = "com.xxx.common.model";

// base model 所使用的包名
String baseModelPackageName = modelPackageName + ".base";

// base model 文件保存路径
// 注意从 jfinal 4.9.12 版开始，PathKit.getWebRootPath() 在此的用法要改成 System.getProperty("user.dir")
String baseModelOutputDir = System.getProperty("user.dir") + "/src/main/java/" + baseModelPackageName.replace('.', '/');

// model 文件保存路径 (MappingKit 与 DataDictionary 文件默认保存路径)
String modelOutputDir = baseModelOutputDir + "/..";

System.out.println("输出路径："+ baseModelOutputDir);

// 创建生成器
Generator gen = new Generator(getDataSource(), baseModelPackageName, baseModelOutputDir, modelPackageName, modelOutputDir);

// 设置数据库方言
gen.setDialect(new MysqlDialect());

// 在 getter、setter 方法上生成字段备注内容
gen.setGenerateRemarks(true);

// 开始生成代码
gen.generate();
```

baseModelPackageName、baseModelOutputDir、modelPackageName、modelOutputDir，四个参数分别表示 base model 的包名，baseModel 的输出路径，model 的包名，model 的输出路径。

由于后三个参数可以根据第一个参数来生成，所以通常只需要配置 modelPackageName 这一个参数即可。

可在官网下载 jfinal-demo 项目，其中的生成器可直接用于项目：http://www.jfinal.com

生成器的各部分组件都可以扩展，例如，MetaBuilder 可以指定 table 的过滤规则：https://jfinal.com/feedback/7290

此外，生成器 Generator 提供了很多 setter 配置方法，可以很方便控制生成的结果，如下配置可以指定生成器依赖的模板文件：

```
// 指定 base model 文件生成的模板文件
generator.setBaseModelTemplate(...);

// 指定 model model 文件生成的模板文件
generator.setModelTemplate(...);

// 指定 MappingKit 文件生成的模板文件
generator.setMappingKitTemplate(...)
```

以上代码可以用于指定生成器所依赖的模板文件，将模板文件放入 src/main/resources 目录下面可以被生成器获取到。定制模板文件一般需要在原有模板文件的基础之上做修改，原有模板文件在 jfinal 源码中有提供：https://gitee.com/jfinal/jfinal/tree/master/src/main/java/com/jfinal/plugin/activerecord/generator

后缀为 ".jf" 即为生成器所需的模板文件，里面所使用的语法为 enjoy 模板引擎语法。

### 2、相关生成文件

BaseModel 是用于被最终的 Model 继承的基类，所有的 getter、setter 方法都将生成在此文件内，这样就保障了最终 Model 的清爽与干净，BaseModel 不需要人工维护，在数据库有任何变化时重新生成一次即可。

MappingKit 用于生成 table 到 Model 的映射关系，并且会生成主键/复合主键的配置，也即无需在 configPlugin(Plugins me) 方法中书写任何样板式的映射代码。

DataDictionary 是指生成的数据字典，会生成数据表所有字段的名称、类型、长度、备注、是否主键等信息。

### 3､ table 过滤、排除

Generator 内部工作流程由 MetaBuilder、ModelGenerator、BaseModelGenerator、MappingKitGenerator、DataDictionaryGenerator 组件组合而成，而这些组件都可以通过继承扩展，或者独立配置，然后再组装到 Generator 中，从而实现个性化的定制功能

jfinal 5.0.0 版本新增了 Generator.addBlacklist(blacklist) 以及 addWhitelist(whitelist) 两个方法，可以将需要生成的 table 添加到白名单或者黑名单，用法如下：

```
// 添加多个表名到黑名单
generator.addBlacklist("login_log", "role_permission", "user_role");

// 添加多个表名白名单
generator.addWhitelist(...);
```

以下内容是 jfinal 5.0.0 版本之前的过滤、排除方式，不再建议使用：

下面代码通过配置 MetaBuilder 实现 table 过滤功能，过滤掉的 table 将不会生成相应的类与映射文件：

```
MetaBuilder metaBuilder = new MetaBuilder(dataSource)
   // 使用 filter 方法定制过滤逻辑，返回 true 表示过滤掉当前 table
   .filter(tableName -> {
      return tableName.startsWith("sys_");
   });

Generator gen = new Generator(dataSource, baseModelPackageName, baseModelOutputDir);
gen.setMetaBuilder(metaBuilder);
gen.generate();
```

以上代码通过创建 MetaBuilder 对象，并单独对它进行 filter 配置，然后再通过 generator.setMetaBuilder(...) 将其注入到生成器之中，从而实现了 talbe 的定制化过滤。

注意：jfinal 4.9.05 版本之后，filter(...) 方法将更名为 skip(...);

除此之外，还可以通过继承 MetaBuilder、ModelGenerator、BaseModelGenerator 等等组件，然后再将其注入到生成器之中，实现更多的个性化功能。

### 4、使用生成器的主要优势

- 充分利用海量的针对于 Bean 设计的第三方工具，例如 jackson、freemarker

- 快速响应数据库表变动，极速重构，提升开发效率，提升代码质量

- 拥有 IDE 代码提示不用记忆数据表字段名，消除记忆负担，避免手写字段名出现手误

- BaseModel 设计令 Model 中依然保持清爽，在表结构变化时极速重构关联代码

- 自动化 table 至 Model 映射

- 自动化主键、复合主键名称识别与映射

- MappingKit 承载映射代码，JFinalConfig 保持干净清爽

- 有利于分布式场景和无数据源时使用 Model

- 新设计避免了以往自动扫描映射设计的若干缺点：引入新概念(如注解)增加学习成本、性能低、jar 包扫描可靠性与安全性低

### 5、Model 与 Bean 合体后注意事项

- 合体后 JSP 模板输出 Bean 中的数据将依赖其 getter 方法，输出的变量名即为 getter 方法去掉 ”get” 前缀字符后剩下的字符首字母变小写，如果希望 JSP 仍然使用之前的输出方式，可以在系统启动时调用一下 ModelRecordElResolver. setResolveBeanAsModel(true);

- Controller 之中的 getModel() 需要表单域名称对应于数据表字段名，而 getBean() 则依赖于 setter 方法，表单域名对应于 setter 方法去掉 ”set” 前缀字符后剩下的字符串字母变小写。

- 许多类似于 jackson、fastjson 的第三方工具依赖于 Bean 的 getter 方法进行操作，所以只有合体后才可以使用 jackson、fastjson

- JFinalJson 将 Model 转换为 json 数据时，json 的 keyName 是原始的数据表字段名，而 jackson、fastjson 这类依赖于 getter 方法转化成的 json 的 keyName 是数据表字段名转换而成的驼峰命名

- 建议 mysql 数据表的字段名直接使用驼峰命名，这样可以令 json 的 keyName 完全一致，也可以使 JSP 在页面中取值时使用完全一致的属性名。注意：mysql 数据表的名称仍然使用下划线命名方式并使用小写字母，方便在 linux 与 windows 系统之间移植。

- 总之，合体后的 Bean 在使用时要清楚使用的是其 BaseModel 中的 getter、setter 方法还是其 Model 中的 get(String attrName) 方法

### 6、常见问题解决

Sql Server 数据库在使用生成器之时，会获取到系统自带的表，需要对这些表进行过滤，具体办法参考：http://www.jfinal.com/share/211
