# 整合 Enjoy 模板最佳实践

## 简介

在 Java 应用程序中整合 **Enjoy 模板引擎**，特别是在处理数据库操作和 SQL 文件管理方面，可以显著提高开发效率并增强代码的可维护性。本指南将详细介绍如何配置数据库连接、添加和管理 SQL 文件，以及通过模板引擎执行查询测试。

### 整合优势

- **统一管理 SQL 文件**：使用 Enjoy 模板引擎，您可以将 SQL 文件集中存放在项目的资源目录中，通过模板引擎动态加载。这样不仅便于统一管理 SQL 语句，还方便维护和更新。
- **提高开发效率**：利用模板引擎支持的动态 SQL 功能，可以根据不同条件拼接不同的 SQL 片段，减少重复代码，提高开发效率。
- **提升应用性能**：Enjoy 模板引擎在编译模板后会缓存结果，对于重复执行的 SQL 查询，可以直接使用缓存结果，减少解析时间，提升应用性能。

## 整合指南

### 一、添加依赖

在您的项目的 `pom.xml` 文件中添加以下依赖：

```xml
<dependencies>
    <!-- Java-DB 依赖 -->
    <dependency>
        <groupId>com.litongjava</groupId>
        <artifactId>java-db</artifactId>
        <version>${java.db.version}</version>
    </dependency>

    <!-- PostgreSQL 驱动 -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.2.24</version>
    </dependency>

    <!-- HikariCP 数据库连接池 -->
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
        <version>4.0.3</version>
    </dependency>

    <!-- Enjoy 模板引擎 -->
    <dependency>
        <groupId>com.jfinal</groupId>
        <artifactId>enjoy</artifactId>
        <version>5.1.3</version>
    </dependency>
</dependencies>
```

**说明**：

- **`java-db`**：数据库操作的基础框架。
- **`postgresql`**：PostgreSQL 数据库驱动。
- **`HikariCP`**：高性能的数据库连接池。
- **`enjoy`**：JFinal 框架的模板引擎，用于处理模板化的 SQL。

---

### 二、配置数据库连接

创建一个数据库配置类，用于初始化数据库连接和 `ActiveRecordPlugin`。以下是示例代码：

```java
package com.litongjava.ai.db.assistant.config;

import javax.sql.DataSource;

import com.jfinal.template.Engine;
import com.jfinal.template.source.ClassPathSourceFactory;
import com.litongjava.annotation.AConfiguration;
import com.litongjava.annotation.AInitialization;
import com.litongjava.db.activerecord.ActiveRecordPlugin;
import com.litongjava.db.activerecord.OrderedFieldContainerFactory;
import com.litongjava.db.activerecord.dialect.PostgreSqlDialect;
import com.litongjava.db.hikaricp.DsContainer;
import com.litongjava.tio.boot.server.TioBootServer;
import com.litongjava.tio.utils.environment.EnvUtils;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@AConfiguration
public class DbConfig {

    public DataSource dataSource() {
        // 从环境变量或配置文件中获取数据库连接信息
        String jdbcUrl = EnvUtils.get("jdbc.url");
        String jdbcUser = EnvUtils.get("jdbc.user");
        String jdbcPswd = EnvUtils.get("jdbc.pswd");
        int maximumPoolSize = EnvUtils.getInt("jdbc.MaximumPoolSize", 2);

        // 配置 HikariCP 连接池
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(jdbcUser);
        config.setPassword(jdbcPswd);
        config.setMaximumPoolSize(maximumPoolSize);

        HikariDataSource hikariDataSource = new HikariDataSource(config);

        // 设置数据源
        DsContainer.setDataSource(hikariDataSource);

        // 在应用关闭时销毁连接池
        HookCan.me().addDestroyMethod(hikariDataSource::close);

        return hikariDataSource;
    }

    /**
     * 配置 ActiveRecordPlugin
     */
    @Initialization
    public void activeRecordPlugin() throws Exception {
        // 获取数据源
        DataSource dataSource = dataSource();

        // 创建 ActiveRecordPlugin 实例
        ActiveRecordPlugin arp = new ActiveRecordPlugin(dataSource);
        arp.setContainerFactory(new OrderedFieldContainerFactory());

        // 设置开发模式
        if (EnvUtils.isDev()) {
            arp.setDevMode(true);
        }

        // 设置数据库方言
        arp.setDialect(new PostgreSqlDialect());

        // 配置模板引擎
        Engine engine = arp.getEngine();
        // 在开发模式下，修改 SQL 文件无需重启应用
        engine.setDevMode(EnvUtils.isDev());
        // 设置 SQL 文件路径
        engine.setSourceFactory(new ClassPathSourceFactory());
        // 压缩模板中的空格和换行，提升性能
        engine.setCompressorOn(' ');
        engine.setCompressorOn('\n');
        // 添加 SQL 模板文件
        arp.addSqlTemplate("/enjoy-sql/all.sql");

        // 启动 ActiveRecordPlugin
        arp.start();

        // 在应用关闭时停止 ActiveRecordPlugin
        HookCan.me().addDestroyMethod(arp::stop);
    }
}
```

**说明**：

- **`EnvUtils`**：用于获取环境变量或配置文件中的参数。
- **`HikariCP`**：配置数据库连接池，提升数据库连接的性能。
- **`ActiveRecordPlugin`**：JFinal 提供的 ORM 插件，用于数据库操作。
- **`Engine`**：模板引擎，用于解析 SQL 模板。
- **`ClassPathSourceFactory`**：设置模板引擎的 SQL 文件来源于 classpath。

---

### 三、添加 SQL 文件

#### 1. 创建 `all.sql` 文件

在资源目录 `src/main/resources/enjoy-sql/` 下创建 `all.sql` 文件，用于包含其他 SQL 文件。

`all.sql` 内容示例：

```sql
#include("user.sql")
```

**说明**：`#include` 指令用于包含其他 SQL 文件，实现 SQL 的模块化管理。

#### 2. 创建 `user.sql` 文件

在同一目录下创建 `user.sql` 文件，定义具体的 SQL 语句。

`user.sql` 内容示例：

```sql
#namespace("user")
    #sql("adminUser")
        SELECT * FROM tio_boot_admin_system_users WHERE ID = 1 AND deleted = 0
    #end
    #sql("getUserById")
        SELECT * FROM tio_boot_admin_system_users WHERE ID = ? AND deleted = 0
    #end
#end
```

**说明**：

- **`#namespace`**：定义一个命名空间，方便在代码中引用。
- **`#sql("...")`**：定义一个 SQL 片段，名称为括号内的字符串。
- **`?`**：占位符，用于在执行 SQL 时传入参数。

---

### 四、查询测试

为验证整合是否成功，我们可以编写测试用例进行查询测试。以下是测试类的示例代码：

```java
package com.litongjava.ai.db.assistant.config;

import org.junit.BeforeClass;
import org.junit.Test;

import com.litongjava.db.SqlPara;
import com.litongjava.db.activerecord.Db;
import com.litongjava.db.activerecord.DbTemplate;
import com.litongjava.db.activerecord.Row;
import com.litongjava.tio.boot.testing.TioBootTest;

public class UserServiceTest {

    @BeforeClass
    public static void beforeClass() {
        // 初始化测试环境
        TioBootTest.before(DbConfig.class);
    }

    @Test
    public void testAdminUser() {
        // 获取模板
        DbTemplate template = Db.template("user.adminUser");
        // 执行查询
        Row first = template.findFirst();
        // 输出结果
        System.out.println(first);
    }

    @Test
    public void testGetUserById() {
        // 获取模板
        DbTemplate template = Db.template("user.getUserById");
        // 获取 SQL 参数对象
        SqlPara sqlPara = template.getSqlPara();
        // 添加参数
        sqlPara.addPara(1);
        // 执行查询
        Row first = Db.findFirst(sqlPara);
        // 输出结果
        System.out.println(first);
    }
}
```

**说明**：

- **`Db.template("user.adminUser")`**：根据命名空间和 SQL 名称获取对应的 SQL 模板。
- **`SqlPara`**：包含 SQL 语句和参数的对象。
- **`findFirst()`**：执行查询并返回第一条记录。

---

#### 输出示例

运行测试用例后，控制台输出示例：

```log
2024-03-28 23:33:45.549 [main] INFO  c.z.h.HikariDataSource.<init>:80 - HikariPool-1 - Starting...
2024-03-28 23:33:45.646 [main] INFO  c.z.h.HikariDataSource.<init>:82 - HikariPool-1 - Start completed.
{id:1, username:admin, password:..., tenant_id:1}
{id:1, username:admin, password:..., tenant_id:1}
```

**说明**：成功查询到数据，表示整合成功。

---

## 总结

通过以上步骤，您已经成功地将 **Enjoy 模板引擎** 整合到您的 Java 项目中。这样，您可以利用模板引擎的强大功能，实现对 SQL 的统一管理和动态拼接，提高开发效率，并提升应用性能。

### 建议

- **灵活运用模板特性**：在实际项目中，根据需求使用模板引擎的条件判断、循环等高级特性，进一步增强 SQL 的灵活性。
- **定期优化 SQL**：定期整理和优化 SQL 文件，保持代码整洁，提高查询性能。
- **安全性考虑**：注意模板引擎的安全性，确保输入参数经过验证，防范 SQL 注入等安全问题。
- **性能优化**：
  - **开发模式**：在开发阶段，建议开启 `setDevMode(true)`，以便动态加载和修改模板文件。但在生产环境中，若性能要求极高，可以根据实际需求关闭此选项。
  - **极速模式**：启用 `setFastMode(true)` 可以提升模板渲染性能，但请根据项目需求评估其影响。

通过以上配置和示例，您可以充分利用 **Enjoy 模板引擎** 的强大功能，简化数据库操作和 SQL 文件管理过程，提升开发效率和系统性能。

---

希望本指南能帮助您顺利整合 **Enjoy 模板引擎**，提升项目的开发效率和性能。如果您有任何问题或建议，欢迎在评论区交流。
