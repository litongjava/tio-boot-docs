# 生成器与 Model

本文档介绍了如何使用 ActiveRecord 模块下的 `Generator` 工具类，自动生成 JavaBean 相关的 `Model`、`BaseModel`、`MappingKit`、`DataDictionary` 四类文件。通过生成器，可以快速创建符合 JavaBean 规范的模型类，提升开发效率和代码质量。

## 1. 生成器使用

### 1.1 基本使用

`ActiveRecord` 模块的 `com.litongjava.db.activerecord.generator` 包下提供了 `Generator` 工具类，能够自动生成 `Model`、`BaseModel`、`MappingKit`、`DataDictionary` 四类文件。生成后的 `Model` 类将与 Java Bean 结合，立即拥有 getter 和 setter 方法，遵循传统的 Java Bean 规范，开发过程中无需手动记忆字段名。

使用生成器通常只需配置四个参数：`baseModelPackageName`、`baseModelOutputDir`、`modelPackageName`、`modelOutputDir`。以下是具体的使用示例：

```java
// 模型所使用的包名 (MappingKit 默认使用的包名)
String modelPackageName = "com.xxx.common.model";

// BaseModel 所使用的包名
String baseModelPackageName = modelPackageName + ".base";

// BaseModel 文件保存路径
// 注意：从 JFinal 4.9.12 版本开始，PathKit.getWebRootPath() 的用法需改为 System.getProperty("user.dir")
String baseModelOutputDir = System.getProperty("user.dir") + "/src/main/java/" + baseModelPackageName.replace('.', '/');

// Model 文件保存路径 (MappingKit 与 DataDictionary 文件默认保存路径)
String modelOutputDir = baseModelOutputDir + "/..";

System.out.println("输出路径：" + baseModelOutputDir);

// 创建生成器
Generator gen = new Generator(getDataSource(), baseModelPackageName, baseModelOutputDir, modelPackageName, modelOutputDir);

// 设置数据库方言
gen.setDialect(new MysqlDialect());

// 在 getter、setter 方法上生成字段备注内容
gen.setGenerateRemarks(true);

// 开始生成代码
gen.generate();
```

四个参数的含义分别为：

- `baseModelPackageName`：BaseModel 的包名
- `baseModelOutputDir`：BaseModel 的输出路径
- `modelPackageName`：Model 的包名
- `modelOutputDir`：Model 的输出路径

由于后三个参数可以根据第一个参数生成，通常只需配置 `modelPackageName` 即可。

### 1.2 生成的相关文件

生成器会自动生成以下四类文件：

- **BaseModel**：供最终的 `Model` 继承的基类，所有的 getter 和 setter 方法都生成在此文件内，保持最终 `Model` 的简洁。BaseModel 无需手动维护，数据库变化时只需重新生成即可。
- **Model**：具体的模型类，继承自 `BaseModel`，包含业务逻辑。
- **MappingKit**：用于生成数据库表与 `Model` 之间的映射关系，包括主键和复合主键的配置，无需在 `configPlugin(Plugins me)` 方法中编写映射代码。
- **DataDictionary**：生成的数据字典，包含数据表所有字段的名称、类型、长度、备注、是否主键等信息。

### 1.3 表的过滤与排除

`Generator` 内部由 `MetaBuilder`、`ModelGenerator`、`BaseModelGenerator`、`MappingKitGenerator`、`DataDictionaryGenerator` 等组件组成。这些组件可以通过继承或独立配置后组装到 `Generator` 中，实现个性化定制。

从 JFinal 5.0.0 版本开始，`Generator` 提供了 `addBlacklist` 和 `addWhitelist` 方法，用于将需要生成的表添加到白名单或黑名单。例如：

```java
// 添加多个表名到黑名单
generator.addBlacklist("login_log", "role_permission", "user_role");

// 添加多个表名到白名单
generator.addWhitelist("user", "order", "product");
```

在旧版本中，可以通过配置 `MetaBuilder` 的 `filter` 方法实现表的过滤：

```java
MetaBuilder metaBuilder = new MetaBuilder(dataSource)
   // 使用 filter 方法定制过滤逻辑，返回 true 表示过滤掉当前表
   .filter(tableName -> {
      return tableName.startsWith("sys_");
   });

Generator gen = new Generator(dataSource, baseModelPackageName, baseModelOutputDir);
gen.setMetaBuilder(metaBuilder);
gen.generate();
```

**注意**：自 JFinal 4.9.05 版本起，`filter(...)` 方法更名为 `skip(...)`。

此外，还可以通过继承 `MetaBuilder`、`ModelGenerator`、`BaseModelGenerator` 等组件，进一步实现个性化功能。

### 1.4 使用生成器的主要优势

- **利用第三方工具**：充分利用针对 Bean 设计的第三方工具，如 Jackson、FreeMarker 等。
- **快速响应数据库变动**：数据库表结构变化时，快速重构代码，提升开发效率和代码质量。
- **IDE 代码提示**：生成的代码拥有完整的 getter 和 setter 方法，IDE 能提供智能提示，避免手动记忆字段名和手动输入错误。
- **保持 Model 清爽**：通过 `BaseModel` 设计，保持最终 `Model` 类的简洁，数据库表结构变化时仅需重生成 `BaseModel` 即可。
- **自动化映射**：自动化完成表与 Model 的映射，包括主键和复合主键的识别与映射。
- **干净的 JFinalConfig**：`MappingKit` 承载映射代码，保持 `JFinalConfig` 的干净简洁。
- **适用于分布式场景**：有利于分布式环境下的开发，以及在无数据源时使用 `Model`。
- **性能与安全性提升**：新的映射设计避免了自动扫描映射的性能问题和安全隐患，避免引入额外的学习成本（如注解）。

### 1.5 Model 与 Bean 合体后的注意事项

在 `Model` 与 Java Bean 合体后，需要注意以下事项：

- **JSP 模板输出**：JSP 模板输出 Bean 中的数据依赖其 getter 方法。输出的变量名为 getter 方法去掉 "get" 前缀后，首字母小写。如果希望 JSP 继续使用原有的输出方式，可以在系统启动时调用 `ModelRecordElResolver.setResolveBeanAsModel(true)`。

- **Controller 中的使用**：

  - `getModel()` 方法依赖于表单域名称对应于数据库字段名。
  - `getBean()` 方法依赖于 setter 方法，表单域名对应于 setter 方法去掉 "set" 前缀后，首字母小写。

- **第三方工具兼容性**：许多如 Jackson、FastJSON 等第三方工具依赖于 Bean 的 getter 方法进行操作，只有合体后才能正常使用。

- **JSON 序列化**：

  - `JFinalJson` 将 `Model` 转换为 JSON 时，JSON 的 key 名为原始的数据表字段名。
  - Jackson、FastJSON 等依赖 getter 方法，生成的 JSON key 名为字段名转换后的驼峰命名。

- **命名建议**：

  - 建议 MySQL 数据表的字段名直接使用驼峰命名，这样生成的 JSON key 名与 JSP 中使用的属性名一致。
  - 数据表名称仍建议使用下划线命名方式并使用小写字母，便于在 Linux 与 Windows 系统之间移植。

- **方法调用明确**：合体后的 Bean 使用时，要明确使用的是 `BaseModel` 中的 getter、setter 方法，还是 `Model` 中的 `get(String attrName)` 方法。

### 1.6 常见问题解决

**问题**：在使用 SQL Server 数据库时，生成器会获取到系统自带的表，需对这些表进行过滤。

**解决方案**：参考 [JFinal 官方文档](http://www.jfinal.com/share/211)，通过配置生成器的过滤规则，将系统表加入黑名单或白名单。

## 2. 生成器使用示例

以下是一个完整的生成器使用示例，包括依赖配置、生成器配置与运行、生成的代码示例以及映射配置和测试代码。

### 2.1 添加依赖

在 `pom.xml` 中添加以下依赖：

```xml
<dependency>
  <groupId>com.litongjava</groupId>
  <artifactId>java-db</artifactId>
  <version>${java-db.version}</version>
</dependency>
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>5.1.26</version>
</dependency>
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid</artifactId>
  <version>0.2.9</version>
</dependency>
```

### 2.2 生成器配置与运行

创建一个 Java 类 `JavaDbGenerator`，配置并运行生成器：

```java
import javax.sql.DataSource;

import com.litongjava.db.activerecord.dialect.MysqlDialect;
import com.litongjava.db.activerecord.generator.Generator;
import com.litongjava.db.druid.DruidPlugin;
import com.litongjava.tio.utils.environment.EnvUtils;

public class JavaDbGenerator {
  public static String modelPackageName = "com.litongjava.common.model";

  public static void main(String[] args) {
    EnvUtils.load();
    DataSource dataSource = getDataSource();

    // BaseModel 的包名
    String baseModelPackageName = modelPackageName + ".base";
    // BaseModel 的输出路径
    String baseModelOutputDir = getBaseModelOutputDir(baseModelPackageName);

    // Model 的输出路径 (MappingKit 与 DataDictionary 默认保存路径)
    String modelOutputDir = baseModelOutputDir + "/..";

    // 创建生成器
    Generator generator = new Generator(dataSource, baseModelPackageName, baseModelOutputDir, modelPackageName, modelOutputDir);

    // 配置生成器
    generator.setGenerateRemarks(true); // 生成字段备注
    generator.setDialect(new MysqlDialect()); // 设置数据库方言
    generator.setGenerateChainSetter(true); // 生成链式 setter 方法
    // generator.addExcludedTable("t_db_connect_info"); // 添加不需要生成的表名
    generator.setGenerateDaoInModel(true); // 在 Model 中生成 dao 对象
    generator.setGenerateDataDictionary(false); // 不生成数据字典
    generator.setRemovedTableNamePrefixes("t_"); // 移除表名前缀，如 "t_"，生成的 Model 名为 "User" 而非 "TUser"

    // 开始生成
    generator.generate();
  }

  public static String getBaseModelOutputDir(String modelPackageName) {
    String replace = modelPackageName.replace('.', '/');
    return "src/main/java/" + replace;
  }

  public static DruidPlugin createDruidPlugin() {
    String url = EnvUtils.get("jdbc.url").trim();
    String user = EnvUtils.get("jdbc.user").trim();
    String pswd = EnvUtils.get("jdbc.pswd").trim();
    return new DruidPlugin(url, user, pswd);
  }

  public static DataSource getDataSource() {
    DruidPlugin druidPlugin = createDruidPlugin();
    druidPlugin.start();
    return druidPlugin.getDataSource();
  }
}
```

### 2.3 生成的代码示例

**生成的 `Model` 类示例**：

```java
package com.litongjava.common.model;

import com.litongjava.common.model.base.BaseTioBootAdminSystemConstantsConfig;

/**
 * Generated by java-db.
 */
public class TioBootAdminSystemConstantsConfig extends BaseTioBootAdminSystemConstantsConfig<TioBootAdminSystemConstantsConfig> {
  private static final long serialVersionUID = 1L;

  public static final TioBootAdminSystemConstantsConfig dao = new TioBootAdminSystemConstantsConfig().dao();
}
```

**生成的 `BaseModel` 类示例**：

```java
package com.litongjava.common.model.base;

import com.litongjava.db.activerecord.Model;
import com.litongjava.model.db.IBean;

/**
 * Generated by java-db, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseTioBootAdminSystemConstantsConfig<M extends BaseTioBootAdminSystemConstantsConfig<M>> extends Model<M> implements IBean {

  public M setId(java.lang.Long id) {
    set("id", id);
    return (M)this;
  }

  public java.lang.Long getId() {
    return getLong("id");
  }

  public M setKeyName(java.lang.String keyName) {
    set("key_name", keyName);
    return (M)this;
  }

  public java.lang.String getKeyName() {
    return getStr("key_name");
  }

  public M setKeyValue(java.lang.String keyValue) {
    set("key_value", keyValue);
    return (M)this;
  }

  public java.lang.String getKeyValue() {
    return getStr("key_value");
  }

  public M setRemark(java.lang.String remark) {
    set("remark", remark);
    return (M)this;
  }

  public java.lang.String getRemark() {
    return getStr("remark");
  }

  public M setCreator(java.lang.String creator) {
    set("creator", creator);
    return (M)this;
  }

  public java.lang.String getCreator() {
    return getStr("creator");
  }

  public M setCreateTime(java.util.Date createTime) {
    set("create_time", createTime);
    return (M)this;
  }

  public java.util.Date getCreateTime() {
    return getDate("create_time");
  }

  public M setUpdater(java.lang.String updater) {
    set("updater", updater);
    return (M)this;
  }

  public java.lang.String getUpdater() {
    return getStr("updater");
  }

  public M setUpdateTime(java.util.Date updateTime) {
    set("update_time", updateTime);
    return (M)this;
  }

  public java.util.Date getUpdateTime() {
    return getDate("update_time");
  }

  public M setDeleted(java.lang.Integer deleted) {
    set("deleted", deleted);
    return (M)this;
  }

  public java.lang.Integer getDeleted() {
    return getInt("deleted");
  }

  public M setTenantId(java.lang.Long tenantId) {
    set("tenant_id", tenantId);
    return (M)this;
  }

  public java.lang.Long getTenantId() {
    return getLong("tenant_id");
  }
}
```

```java
package com.enoleap.maliang.app.db.model;

import com.enoleap.maliang.app.db.model.base.BaseTioBootAdminSystemConstantsConfig;

/**
 * Generated by java-db.
 */
public class TioBootAdminSystemConstantsConfig extends BaseTioBootAdminSystemConstantsConfig<TioBootAdminSystemConstantsConfig> {
  private static final long serialVersionUID = 1L;
	public static final TioBootAdminSystemConstantsConfig dao = new TioBootAdminSystemConstantsConfig().dao();
	/**
	 *
	 */
  public static final String tableName = "tio_boot_admin_system_constants_config";
  public static final String primaryKey = "id";
  // private java.lang.Long id
  // private java.lang.String keyName
  // private java.lang.String keyValue
  // private java.lang.String remark
  // private java.lang.String creator
  // private java.util.Date createTime
  // private java.lang.String updater
  // private java.util.Date updateTime
  // private java.lang.Integer deleted
  // private java.lang.Long tenantId
}
```

### 2.4 添加 MappingKit 映射

在项目中添加 `_MappingKit.mapping(mysqlArp);` 以完成表与模型的映射。以下是配置示例：

```java
import com.jfinal.template.Engine;
import com.jfinal.template.source.ClassPathSourceFactory;
import com.litongjava.annotation.AConfiguration;
import com.litongjava.annotation.Initialization;
import com.litongjava.common.model._MappingKit;
import com.litongjava.db.activerecord.ActiveRecordPlugin;
import com.litongjava.db.activerecord.OrderedFieldContainerFactory;
import com.litongjava.tio.boot.server.TioBootServer;
import com.litongjava.tio.boot.utils.TioRequestParamUtils;
import com.litongjava.tio.utils.environment.EnvUtils;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import lombok.extern.slf4j.Slf4j;

@AConfiguration
@Slf4j
public class EnoteMysqlDbConfig {

  /*
   * 配置 ActiveRecordPlugin
   */
  @Initialization
  public void config() {
    String jdbcUrl = EnvUtils.get("jdbc.url");
    log.info("jdbcUrl:{}", jdbcUrl);
    String jdbcUser = EnvUtils.get("jdbc.user");
    String jdbcPswd = EnvUtils.get("jdbc.pswd");
    int maximumPoolSize = EnvUtils.getInt("jdbc.MaximumPoolSize", 2);

    HikariConfig config = new HikariConfig();
    // 设置基本参数
    config.setJdbcUrl(jdbcUrl);
    config.setUsername(jdbcUser);
    config.setPassword(jdbcPswd);
    config.setMaximumPoolSize(maximumPoolSize);
    config.setConnectionTimeout(30000);

    HikariDataSource hikariDataSource = new HikariDataSource(config);
    HookCan.me().addDestroyMethod(hikariDataSource::close);

    ActiveRecordPlugin mysqlArp = new ActiveRecordPlugin(hikariDataSource);
    mysqlArp.setContainerFactory(new OrderedFieldContainerFactory());

    Engine engine = mysqlArp.getEngine();
    engine.setSourceFactory(new ClassPathSourceFactory());
    engine.setCompressorOn(' ');
    engine.setCompressorOn('\n');

    if (EnvUtils.isDev()) {
      mysqlArp.setDevMode(true);
      engine.setDevMode(true);
      mysqlArp.setShowSql(true);
    }

    mysqlArp.addSqlTemplate("/sql/all_sqls.sql");
    _MappingKit.mapping(mysqlArp);
    mysqlArp.start();
    HookCan.me().addDestroyMethod(mysqlArp::stop);
    // 添加自定义类型
    TioRequestParamUtils.types.add("bigint");
  }
}
```

### 2.5 测试生成的 Model

编写测试类，验证生成的 `Model` 是否能正常操作数据库：

```java
package com.litongjava.common.model;

import java.util.List;

import org.junit.Test;

import com.enoleap.maliang.app.config.EnoteMysqlDbConfig;
import com.enoleap.maliang.app.db.model.TioBootAdminSystemConstantsConfig;
import com.litongjava.tio.boot.tesing.TioBootTest;
import com.litongjava.tio.utils.json.JsonUtils;
import com.litongjava.tio.utils.snowflake.SnowflakeIdUtils;

public class TioBootAdminSystemConstantsConfigTest {

  @Test
  public void test() {
    TioBootTest.runWith(EnoteMysqlDbConfig.class);
    //save
    new TioBootAdminSystemConstantsConfig().setId(SnowflakeIdUtils.id()).setKeyName("key_001").setKeyValue("key_002").save();

    //find
    List<TioBootAdminSystemConstantsConfig> all = TioBootAdminSystemConstantsConfig.dao.findAll();

    System.out.println(JsonUtils.toJson(all));

    //delete
    boolean deleted = TioBootAdminSystemConstantsConfig.dao.deleteById(437975050078142464L);
    System.out.println(deleted);
  }
}

```

**运行日志示例**：

```
2024-10-20 21:44:05.394 [main] INFO  c.l.t.u.e.EnvUtils.load:171 - app.env:dev
2024-10-20 21:44:05.467 [main] INFO  c.e.m.a.c.EnoteMysqlDbConfig.config:29 - jdbcUrl:jdbc:mysql://192.168.3.9/enote?useSSL=false&characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=UTC
2024-10-20 21:44:05.475 [main] INFO  c.z.h.HikariDataSource.<init>:80 - HikariPool-1 - Starting...
2024-10-20 21:44:05.721 [main] INFO  c.z.h.HikariDataSource.<init>:82 - HikariPool-1 - Start completed.
Sql: select * from `tio_boot_admin_system_constants_config`
[{}{}]
true
```

## 3. 附录

### 3.1 自定义模板文件

`Generator` 提供了多种 `setter` 方法，可以方便地控制生成结果。例如，可以指定生成器依赖的模板文件：

```java
// 指定 BaseModel 文件生成的模板文件
generator.setBaseModelTemplate("templates/baseModel.jf");

// 指定 Model 文件生成的模板文件
generator.setModelTemplate("templates/model.jf");

// 指定 MappingKit 文件生成的模板文件
generator.setMappingKitTemplate("templates/mappingKit.jf");
```

将模板文件放入 `src/main/resources` 目录下，生成器即可获取。定制模板文件通常需要在原有模板基础上修改，原模板文件位于 JFinal 源码中：[JFinal GitHub 仓库](https://gitee.com/jfinal/jfinal/tree/master/src/main/java/com/jfinal/plugin/activerecord/generator)

模板文件后缀为 `.jf`，采用 `enjoy` 模板引擎语法。

## 4. 结论

使用 `Generator` 工具类能够显著提升 Java 项目中模型类的开发效率和代码质量。通过自动生成符合 JavaBean 规范的 `Model` 和相关文件，开发者可以专注于业务逻辑的实现，减少重复性劳动，并确保代码的一致性和可维护性。
