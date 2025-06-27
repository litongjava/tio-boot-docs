# SQL 模板 (`SqlTemplates`)
[[toc]]
## 1. 简介

`SqlTemplates` 是一个强大且灵活的SQL管理工具，旨在将SQL语句从Java代码中分离出来，实现更清晰的代码结构和更便捷的SQL维护。它通过解析特定格式的 `.sql` 文件，将SQL语句加载到内存中，并允许通过唯一的ID进行调用。

该工具支持两种灵活的加载模式：

*   **主文件模式**：通过一个入口文件（如 `main.sql`）统一管理所有SQL文件的导入。
*   **自动扫描模式**：自动扫描指定目录下的所有 `.sql` 文件，实现零配置加载。

`SqlTemplates` 能够无缝地从文件系统或JAR包中加载资源，使其在开发和生产环境中都能稳定工作。

## 2. 核心特性

*   **SQL与代码分离**：将SQL集中存放在 `.sql` 文件中，保持Java代码的整洁。
*   **模块化管理**：支持通过 `--@` 指令将大型SQL按模块拆分到不同文件中。
*   **SQL片段复用**：新增支持 `--#include` 指令，允许在一个SQL块中嵌入另一个SQL块，实现SQL逻辑的高度复用（如公共的查询字段、JOIN子句或WHERE条件）。
*   **唯一ID调用**：通过 `--#` 为每个SQL片段定义一个唯一的ID，方便在代码中引用。
*   **智能加载机制**：
    *   优先加载指定的入口文件（默认为 `sql-templates/main.sql`）。
    *   若入口文件不存在，则自动扫描并加载 `sql-templates/` 目录下的所有 `.sql` 文件。
*   **环境兼容性**：无论是在IDE中开发，还是将应用打包成JAR文件，都能正确加载SQL资源。

## 3. 使用方法

### 3.1. 组织 SQL 文件

推荐将所有SQL文件存放在 `src/main/resources/sql-templates/` 目录下。

#### 方式一：使用主文件 (`main.sql`) 进行管理（推荐用于大型项目）

这种方式结构清晰，便于追踪SQL文件的依赖关系。

1.  **创建主 SQL 模板文件**
    路径: `src/main/resources/sql-templates/main.sql`

    ```sql
    -- 导入用户相关的SQL
    --@ user.sql
    
    -- 导入订单相关的SQL
    --@ order.sql
    ```

2.  **创建模块化的 SQL 文件**
    路径: `src/main/resources/sql-templates/user.sql`

    ```sql
    --# user.baseColumns
    -- 定义用户表的基础查询字段，用于复用
    id, username, email, status, create_time
    
    --# user.findById
    -- 根据ID查询用户，复用了基础字段
    SELECT
      --#include(user.baseColumns)
    FROM mw_user WHERE id = ? AND deleted = 0;
    
    --# user.findByUsername
    -- 根据用户名查询用户，同样复用了基础字段
    SELECT
      --#include(user.baseColumns)
    FROM mw_user WHERE username = ? AND deleted = 0;
    ```

    路径: `src/main/resources/sql-templates/order.sql`
    ```sql
    --# order.findActiveOrdersByUser
    -- 查询用户的有效订单
    SELECT * FROM mw_order WHERE user_id = ? AND status = 'active';
    ```

#### 方式二：自动扫描模式（推荐用于中小型项目或快速开发）

如果您不想维护一个 `main.sql` 文件，只需将所有 `.sql` 文件直接放入 `sql-templates` 目录即可。

1.  **直接创建 SQL 文件**
    路径: `src/main/resources/sql-templates/user.sql`
    ```sql
    --# user.findById
    SELECT id, username, email FROM mw_user WHERE id = ? AND deleted = 0;
    ```
    路径: `src/main/resources/sql-templates/product.sql`
    ```sql
    --# product.findAll
    SELECT * FROM mw_product WHERE is_available = true;
    ```

`SqlTemplates` 在启动时若未找到 `main.sql`，会自动加载这两个文件。

### 3.2. SQL 语法说明

*   `--# <namespace>.<sqlId>`
    *   **定义**：用于定义一个SQL查询块的开始，并为其分配一个全局唯一的ID。
    *   **格式**：推荐使用 `命名空间.具体操作` 的方式，如 `user.findById`，以避免ID冲突。
    *   **注意**：`--#` 与ID之间必须有至少一个空格。

*   `--@ <filePath>`
    *   **定义**：用于导入另一个SQL文件。此指令仅在**主文件模式**下生效。
    *   **路径**：`filePath` 是相对于当前文件的相对路径。
    *   **注意**：`--@` 与文件名之间必须有至少一个空格。

*   `--#include(<sqlId>)`
    *   **定义**：用于在一个SQL块的内部，嵌入另一个已定义的SQL块。这对于复用公共的列名、JOIN子句、WHERE条件或完整的子查询非常有用。
    *   **用法**：在需要插入代码的地方，直接写入此指令。`SqlTemplates` 在 `get()` 时会自动将其替换为对应ID的SQL内容。
    *   **注意**：工具会自动检测并防止循环引用（例如，A include B，B include A）。

### 3.3. 在 Java 代码中使用

#### 步骤 1: 加载 SQL 模板

通常，您可以在应用启动时加载所有SQL模板。`SqlTemplates` 会自动处理加载逻辑。

```java
import com.litongjava.template.SqlTemplates;

// 在应用启动类或静态初始化块中
public class Application {
    public static void main(String[] args) {
        // 无需任何参数，SqlTemplates 会自动执行默认加载策略
        // 1. 查找并加载 sql-templates/main.sql
        // 2. 如果找不到，则扫描并加载 sql-templates/ 目录下的所有 .sql 文件
        SqlTemplates.load(); 
        
        // ... 启动您的应用
    }
}
```
**注意**：`SqlTemplates` 内部有防重复加载机制，多次调用 `load()` 是安全的。

#### 步骤 2: 获取并执行 SQL

在您的Service或DAO层，通过ID获取SQL语句，并配合数据库工具类（如 `litongjava-db` 的 `Db` 类）执行。

```java
import com.litongjava.db.activerecord.Db;
import com.litongjava.db.activerecord.Row;
import com.litongjava.template.SqlTemplates;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserService {

    public Row findUserById(long userId) {
        // 1. 通过ID获取SQL语句。
        // SqlTemplates.get() 会自动解析内部的 --#include 指令。
        String sql = SqlTemplates.get("user.findById");
        
        log.info("Executing SQL for user.findById with userId: {}", userId);
        
        // 2. 配合数据库工具类执行查询
        Row user = Db.findFirst(sql, userId);
        
        if (user != null) {
            log.info("User found: {}", user.getStr("username"));
        } else {
            log.warn("User with ID {} not found.", userId);
        }
        
        return user;
    }
}
```
当调用 `SqlTemplates.get("user.findById")` 时，返回的 `sql` 字符串将是：
```sql
SELECT
  id, username, email, status, create_time
FROM mw_user WHERE id = ? AND deleted = 0;
```
`--#include(user.baseColumns)` 已经被智能地替换掉了。

### 3.4. 显式加载

如果您需要加载非默认路径下的SQL文件，可以使用带参数的 `load()` 方法。

```java
// 加载位于 "config/custom-sql/main.sql" 的主文件
SqlTemplates.load("config/custom-sql/main.sql");
```

## 4. 最佳实践

*   **统一命名规范**：为SQL ID建立清晰的命名规范（如 `模块名.实体名.操作名`），便于团队协作和维护。
*   **利用模块化**：对于复杂的业务，积极使用 `--@` 指令将SQL拆分到不同的文件中，保持每个文件的专注和简洁。
*   **高度复用SQL片段**：善用 `--#include` 来定义和复用公共的SQL逻辑，如列清单、复杂的JOIN或WHERE子句，减少重复代码，提高可维护性。
*   **应用启动时加载**：在应用启动时执行一次 `SqlTemplates.load()`，将所有SQL预加载到内存中，以获得最佳性能。
*   **避免在循环中 `get()`**：如果在一个循环中需要多次使用同一个SQL，请在循环外调用一次 `SqlTemplates.get()`，将SQL字符串存储在一个局部变量中。

通过遵循这些指南，`SqlTemplates` 将成为您项目中一个强大而可靠的SQL管理助手。