[[toc]]

# tio-boot-开发指南

## 1.tio-boot 简介

tio-boot 是一款基于 Java AIO 高性能 Web 框架,可以 tio-boot 可以简单的让单台服务器承担上万并发

- 1.基于 Java AIO 和 t-io 进行开发
- 2.引入了 spring-boot 中的配置类思想,支持 spring-boot 的常用注解,但是没有使用 spring 的 ioc 和 aop
- 3.引入了 jfinal 的 aop,enjoy 模版引擎和 active-record 连接数据库
- 4.支持常见的 web 组件,如拦截器和 websocket

tio 测试数据

- t-io 实测性能一：1.9G 内存稳定支持 30 万 TCP 长连接：https://www.tiocloud.com/61
- t-io 实测性能二：用 t-io 跑出每秒 1051 万条聊天消息：https://www.tiocloud.com/41
- t-io 实测性能三：netty 和 t-io 对比测试结果：https://www.tiocloud.com/154

## 2.快速入门

### 2.1.web hello

#### 2.1.1.新建工程

name:tio-boot-web-hello
开源地址  
https://github.com/litongjava/java-ee-tio-boot-study/tree/main/tio-boot-latest-study/tio-boot-web-hello

#### 2.1.2.添加依赖

如果使用 Java 8 开发请使用

```
    <dependency>
      <groupId>com.litongjava</groupId>
      <artifactId>tio-boot</artifactId>
      <version>1.1.6</version>
    </dependency>
```

#### 2.1.3.完整依赖

```
<properties>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <java.version>1.8</java.version>
  <maven.compiler.source>${java.version}</maven.compiler.source>
  <maven.compiler.target>${java.version}</maven.compiler.target>
  <graalvm.version>23.1.1</graalvm.version>
  <tio.boot.version>1.1.6</tio.boot.version>
  <lombok-version>1.18.30</lombok-version>
  <hotswap-classloader.version>1.1.9</hotswap-classloader.version>
  <final.name>web-hello</final.name>
  <main.class>com.litongjava.tio.web.hello.HelloApp</main.class>
</properties>
<dependencies>
  <dependency>
    <groupId>com.litongjava</groupId>
    <artifactId>tio-boot</artifactId>
    <version>${tio.boot.version}</version>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>${lombok-version}</version>
    <optional>true</optional>
    <scope>provided</scope>
  </dependency>
  <dependency>
    <groupId>com.litongjava</groupId>
    <artifactId>hotswap-classloader</artifactId>
    <version>${hotswap-classloader.version}</version>
  </dependency>
</dependencies>
<profiles>
  <!-- 开发环境 -->
  <profile>
    <id>development</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <dependencies>
      <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
      </dependency>
    </dependencies>
  </profile>

  <!-- 生产环境 -->
  <profile>
    <id>production</id>
    <dependencies>
      <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
      </dependency>
    </dependencies>
    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.2.0</version>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-assembly-plugin</artifactId>
          <version>3.1.1</version>
          <configuration>
            <archive>
              <manifest>
                <mainClass>${main.class}</mainClass>
              </manifest>
            </archive>
            <descriptorRefs>
              <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
            <appendAssemblyId>false</appendAssemblyId>
          </configuration>
          <executions>
            <execution>
              <id>make-assembly</id>
              <phase>package</phase>
              <goals>
                <goal>single</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
      </plugins>
    </build>
  </profile>
  <profile>
    <id>native</id>
    <dependencies>
      <!-- GraalVM 环境使用 jdk log -->
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-jdk14</artifactId>
        <version>1.7.31</version>
      </dependency>
      <!-- GraalVM -->
      <dependency>
        <groupId>org.graalvm.sdk</groupId>
        <artifactId>graal-sdk</artifactId>
        <version>${graalvm.version}</version>
        <scope>provided</scope>
      </dependency>
    </dependencies>
    <build>
      <finalName>${final.name}</finalName>
      <plugins>
        <plugin>
          <groupId>org.graalvm.nativeimage</groupId>
          <artifactId>native-image-maven-plugin</artifactId>
          <version>21.2.0</version>
          <executions>
            <execution>
              <goals>
                <goal>native-image</goal>
              </goals>
              <phase>package</phase>
            </execution>
          </executions>
          <configuration>
            <skip>false</skip>
            <imageName>${project.build.finalName}</imageName>
            <mainClass>${main.class}</mainClass>
            <buildArgs>
              -H:+RemoveSaturatedTypeFlows
              --allow-incomplete-classpath
            </buildArgs>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </profile>
</profiles>
```

#### 2.1.4.依赖解释

`<properties>` 部分

- `project.build.sourceEncoding`: 设置项目的源代码编码为 UTF-8。
- `java.version`: 定义 Java 版本为 1.8。
- `maven.compiler.source` 和 `maven.compiler.target`: 指定 Maven 编译器使用的 Java 版本。
- `graalvm.version`: 设置 GraalVM 版本为 23.1.1。
- `tio.boot.version`: 定义 TIO Boot 版本为 1.1.3。
- `lombok-version`: 指定 Lombok 库的版本为 1.18.30。
- `final.name`: 指定构建的最终文件名为 `web-hello`。
- `main.class`: 定义项目的主类为 `com.litongjava.tio.web.hello.App`。

`<dependencies>` 部分
列出了项目所需的依赖库：

- `tio-boot`: TIO Boot 库，用于 TIO 框架的启动和配置。
- `lombok`: 一个 Java 库，用于自动处理一些常见的任务，如 getter/setter 的生成。
- `hotswap-classloader`: 一个类加载器，支持热交换功能，用于动态替换类定义。

`<profiles>` 部分
定义了不同环境下的特定配置：

1. 开发环境 (development): 当 Maven 构建在开发环境下时，会添加 `logback-classic` 依赖，用于日志管理。
2. 生产环境 (production): 在生产环境中，同样使用 `logback-classic`，并配置了 `maven-jar-plugin` 和 `maven-assembly-plugin` 用于打包。
3. GraalVM 环境 (native): 用于 GraalVM 的特定配置，包括 `slf4j-jdk14` 和 `graal-sdk` 依赖，以及 `native-image-maven-plugin` 插件，用于生成 GraalVM 的本地映像。

#### 2.1.5.配置文件(可选)

src\main\resources\app.properties

```
#http 配置
http.port = 80
http.page = classpath:/pages

http.404 = /404
http.500 = /500
# 页面文件缓存时间，开发时设置成0，生产环境可以设置成1小时(3600)，10分钟(600)等，单位：秒
http.maxLiveTimeOfStaticRes=0
```

如果要使用配置文件,需要在启动类中使用工具类 P 指定配置文件,否则不会生效

```
// 初始化服务器并启动服务器
P.use("app.properties");
```

#### 2.1.6.启动类

```
package com.litongjava.tio.web.hello;

import com.litongjava.hotswap.wrapper.tio.boot.TioApplicationWrapper;
import com.litongjava.jfinal.aop.annotation.ComponentScan;
import com.litongjava.tio.boot.TioApplication;

@ComponentScan
public class HelloApp {
  public static void main(String[] args) {
    long start = System.currentTimeMillis();
    TioApplicationWrapper.run(HelloApp.class, args);
    long end = System.currentTimeMillis();
    System.out.println((end - start) + "ms");
  }
}
```

@ComponentScan 注解用来进行组件扫描

#### 2.1.7.controller

```
import org.tio.http.common.HttpRequest;
import org.tio.http.common.HttpResponse;
import org.tio.http.server.annotation.RequestPath;
import org.tio.http.server.util.Resps;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestPath(value = "/")
public class IndexController {
  @RequestPath
  public HttpResponse respText(HttpRequest request) throws Exception {
    log.info("txt");
    HttpResponse ret = Resps.txt(request, "hello");
    return ret;
  }
}
```

@RequestPath 注解用于指定请求路径,当在启动类上添加@ComponentScan 注解后,启动的注解处理器会@RequestPath 注解将 Controller 添加到 bean 容器中并设置路由

#### 2.1.8.启动测试

访问 http://localhost/测试理解

### 2.2.整合日志

添加 logback

```
<dependency>
  <groupId>ch.qos.logback</groupId>
  <artifactId>logback-classic</artifactId>
  <version>1.2.3</version>
</dependency>
```

默认集成了 logback 日志,只需要添加 logback 配置文件即可
logback.xml

```
<?xml version="1.0" encoding="UTF-8" ?>
<configuration debug="false" xmlns="http://ch.qos.logback/xml/ns/logback" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://ch.qos.logback/xml/ns/logback https://raw.githubusercontent.com/enricopulatzo/logback-XSD/master/src/main/xsd/logback.xsd
http://ch.qos.logback/xml/ns/logback ">
  <!--定义日志文件的存储地址 勿在 LogBack 的配置中使用相对路径 -->
  <property name="LOG_HOME" value="logs" />
  <!--格式化输出：%d表示日期,%-6level：日志级别从左显示6个字符宽度,%m：日志消息，%n是换行符 -->
  <property name="CONSOLE_LOG_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-6level%logger{1}.%M:%L - %m%n" />

  <!-- 控制台输出 -->
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
      <pattern>${CONSOLE_LOG_PATTERN}</pattern>
    </encoder>
  </appender>

  <!-- 按照每天生成日志文件 -->
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
      <pattern>${CONSOLE_LOG_PATTERN}</pattern>
    </encoder>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <!--日志文件输出的文件名 -->
      <fileNamePattern>${LOG_HOME}/project-name-%d{yyyy-MM-dd}.log</fileNamePattern>
      <!--日志文件保留天数 -->
      <maxHistory>180</maxHistory>
    </rollingPolicy>
    <!--日志文件最大的大小 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
  </appender>

  <!--专为 spring 定制 -->
  <logger name="org.springframework" level="info" />
  <!-- show parameters for hibernate sql 专为 Hibernate 定制 -->
  <logger name="org.hibernate.type.descriptor.sql.BasicBinder" level="TRACE" />
  <logger name="org.hibernate.type.descriptor.sql.BasicExtractor" level="DEBUG" />
  <logger name="org.hibernate.SQL" level="DEBUG" />
  <logger name="org.hibernate.engine.QueryParameters" level="DEBUG" />
  <logger name="org.hibernate.engine.query.HQLQueryPlan" level="DEBUG" />

  <!--myibatis log configure -->
  <logger name="com.apache.ibatis" level="TRACE" />
  <logger name="java.sql.Connection" level="DEBUG" />
  <logger name="java.sql.Statement" level="DEBUG" />
  <logger name="java.sql.PreparedStatement" level="DEBUG" />

  <!-- 日志输出级别 和输出源 -->
  <root level="info">
    <appender-ref ref="STDOUT" />
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

### 2.3.整合热加载

添加依赖

```
<dependency>
  <groupId>com.litongjava</groupId>
  <artifactId>hotswap-classloader</artifactId>
  <version>${hotswap-classloader.version}</version>
</dependency>
```

添加依赖后使用 TioApplicationWrapper 启动服务即可

```
package com.litongjava.aio.server.tio;

import org.tio.utils.jfinal.P;

import com.litongjava.hotswap.wrapper.tio.boot.TioApplicationWrapper;

public class AiServerTio {

  public static void main(String[] args) throws Exception {
    long start = System.currentTimeMillis();
    TioApplicationWrapper.run(AiServerTio.class, args);
    long end = System.currentTimeMillis();
    System.out.println("started:" + (end - start) + "(ms)");
  }
}
```

使用 TioApplicationWrapper 启动应用,在启动类的 Program arguments 添加启动参数--mode=dev,或者在配置文件中添加才能启用热加载功能

```
mode=dev
```

热加载的使用请参考文档
https://github.com/litongjava/hotswap-classloader

### 2.4.使用 profile 分离环境

添加 profiles 配置如下

```
<profiles>
  <!-- 开发环境 -->
  <profile>
    <id>development</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <dependencies>
      <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
      </dependency>
    </dependencies>
  </profile>

  <!-- 生产环境 -->
  <profile>
    <id>production</id>
    <dependencies>
      <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
      </dependency>
    </dependencies>
    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.2.0</version>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-assembly-plugin</artifactId>
          <version>3.1.1</version>
          <configuration>
            <archive>
              <manifest>
                <mainClass>${main.class}</mainClass>
              </manifest>
            </archive>
            <descriptorRefs>
              <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
            <appendAssemblyId>false</appendAssemblyId>
          </configuration>
          <executions>
            <execution>
              <id>make-assembly</id>
              <phase>package</phase>
              <goals>
                <goal>single</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
      </plugins>
    </build>
  </profile>
  <profile>
    <id>native</id>
    <dependencies>
      <!-- GraalVM 环境使用 jdk log -->
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-jdk14</artifactId>
        <version>1.7.31</version>
      </dependency>
      <!-- GraalVM -->
      <dependency>
        <groupId>org.graalvm.sdk</groupId>
        <artifactId>graal-sdk</artifactId>
        <version>${graalvm.version}</version>
        <scope>provided</scope>
      </dependency>
    </dependencies>
    <build>
      <finalName>${final.name}</finalName>
      <plugins>
        <plugin>
          <groupId>org.graalvm.nativeimage</groupId>
          <artifactId>native-image-maven-plugin</artifactId>
          <version>21.2.0</version>
          <executions>
            <execution>
              <goals>
                <goal>native-image</goal>
              </goals>
              <phase>package</phase>
            </execution>
          </executions>
          <configuration>
            <skip>false</skip>
            <imageName>${project.build.finalName}</imageName>
            <mainClass>${main.class}</mainClass>
            <buildArgs>
              -H:+RemoveSaturatedTypeFlows
              --allow-incomplete-classpath
            </buildArgs>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </profile>
</profiles>
```

为开发环境构建：

```
mvn clean package -DskipTests -Pdevelopment
```

为生产环境构建：

```
mvn clean package -DskipTests -Pproduction
```

为生产环境构建二进制包：

```
mvn clean package -DskipTests -Pnative
```

## 3.部署

### 3.1.打包成 fastjar 文件

打包

```
set JAVA_HOME=D:\\java\\jdk1.8.0_121
mvn clean package -DskipTests -Pproduction
```

windows 启动

```
java -jar target\tio-boot-web-hello-0.0.1-SNAPSHOT.jar
```

linux 启动

```
java -jar tio-boot-web-hello-0.0.1-SNAPSHOT.jar --mode=prod
```

测试请求

```
curl http://localhost/
```

打包后文件 tio-boot-web-hello-0.0.1-SNAPSHOT.jar 只有 8.28M,启动时间只用了不到 1s,windows 占用的内存 70M

### 3.2.打包为二进制文件文件

本实验使用的操作系统是 linux

#### 3.2.1.安装 graalvm 和 Maven

安装 GraalVM

1. 下载并解压 GraalVM:

```shell
wget https://download.oracle.com/graalvm/21/latest/graalvm-jdk-21_linux-x64_bin.tar.gz
mkdir -p ~/program/
tar -xf graalvm-jdk-21_linux-x64_bin.tar.gz -C ~/program/
```

2. 配置环境变量:

```shell
export JAVA_HOME=~/program/graalvm-jdk-21.0.1+12.1
export GRAALVM_HOME=~/program/graalvm-jdk-21.0.1+12.1
export PATH=$JAVA_HOME/bin:$PATH
```

安装 Maven

1. 下载并解压 Maven:

```shell
wget https://dlcdn.apache.org/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.zip
unzip apache-maven-3.8.8-bin.zip -d ~/program/
```

2. 配置环境变量:

```shell
export MVN_HOME=~/program/apache-maven-3.8.8/
export PATH=$MVN_HOME/bin:$PATH
```

#### 3.2.2.打包成二进制文件

```
mvn package -DskipTests -Pnative
```

启动

```
./target/web-hello --mode=prod
```

### 3.3.打包封装成 Docker

#### 3.3.1.Java

打包

```
mvn clean package -DskipTests -Pproduction
```

测试启动

```
docker run --name web-hello \
-dit -v $(pwd)/target:/app \
-p 8080:80 -w /app \
litongjava/jdk:8u211 \
/usr/java/jdk1.8.0_211/bin/java -jar tio-boot-web-hello-0.0.1-SNAPSHOT.jar --mode=prod
```

注意$(pwd)/target 替换为你的目录
测试
curl http://localhost:8080

封装成镜像

```

# Use litongjava/jdk:8u211 as the base image
FROM litongjava/jdk:8u211

# Set the working directory in the container
WORKDIR /app

# Copy the jar file into the container
COPY target/tio-boot-web-hello-0.0.1-SNAPSHOT.jar /app/

# Command to run the jar file
CMD ["/usr/java/jdk1.8.0_211/bin/java", "-jar", "tio-boot-web-hello-0.0.1-SNAPSHOT.jar", "--mode=prod"]
```

#### 3.3.2.binary

如果要使用二进制的方式启动,推荐使用 TioApplication 启动应用,修改启动类

```
TioApplication.run(HelloApp.class, args);
```

打包成二进制文件

```
mvn clean package -DskipTests -Pnative
```

测试失败,原因不不明

```
docker run --rm -p 8080:80 -v $(pwd)/target:/app debian /app/web-hello
```

测试失败,原因不明

```
docker run --rm -p 8080:80 -v $(pwd)/target:/app -e JAVA_HOME=/usr/java/jdk1.8.0_211 litongjava/jdk:8u211 /app/web-hello
```

## 4.tio-boot 配置

### 4.1.添加静态文件

将 app.properties 中配置 http.page

```
http.page = classpath:/pages
```

将静态文件放到 pages 目录下即可 DefaultHttpRequestHandler 的 processStatic 类会处理静态文件

## 5.tio-boo 架构

### 5.1.概述

### 5.2.请求过程

1. `TioBootServerHandler.handler`: 请求最先到达此处理器，负责协议区分,区分 Http 协议和 WbSocket 协议。
2. `HttpServerAioHandler.handler`: 负责接收数据,解析成 Http 数据和初步处理请求。
3. `DefaultHttpRequestHandler.handler`: 此处理器进一步处理 HTTP 请求,将请求分发到相应的处理方法。
4. `HandlerDispatcher.executeAction`: 该分发器负责执行 Controller 的 Action。
5. `IndexController.index`: 最终，请求到达控制器的 `index` 方法，这里是请求的具体业务逻辑处理的地方。

### 5.3.默认 bean 类

当启动一个服务后默认会将下面的类放到 bean 容器中

- com.litongjava.tio.boot.context.Enviorment
- com.litongjava.tio.boot.context.TioApplicationContext
- com.litongjava.tio.server.TioServer
- com.litongjava.tio.boot.http.handler.HttpRoutes
- com.litongjava.tio.boot.http.interceptor.ServerInteceptorConfigure
- com.litongjava.tio.boot.http.interceptor.DefaultHttpServerInterceptor

1. **`com.litongjava.tio.boot.context.Enviorment`**:

   - 这个类是一个环境配置类，用于管理和配置应用程序的运行环境。它可能包含了设置如数据库连接、服务地址等环境相关的配置。

2. **`com.litongjava.tio.boot.context.TioApplicationContext`**:

   - 这个类是一个应用程序上下文类，它负责启动程序和初始化和管理应用程序的各个组件，如服务、控制器等。

3. **`com.litongjava.tio.server.TioServer`**:

   - 这个是一个服务器类，用于启动和管理网络服务器。它包含了网络通信的相关功能，比如监听端口，处理客户端请求等。

4. **`com.litongjava.tio.boot.http.handler.HttpRoutes`**:

   - 这个类是一个 HTTP 路由处理器，用于定义和处理 HTTP 请求的路由。它可能包括了映射 URL 到特定处理函数的功能。

5. **`com.litongjava.tio.boot.http.interceptor.ServerInteceptorConfigure`**:

   - 这个类用于配置服务器拦截器的拦截器通常用于在处理请求前后执行某些操作，比如日志记录、权限检查等。

6. **`com.litongjava.tio.boot.http.interceptor.DefaultHttpServerInterceptor`**:
   - 这个类是一个默认的 HTTP 服务器拦截器实现。它可能提供了一些基本的拦截功能，比如日志记录或请求预处理。

## 6.web 开发

### 6.1 概述

web 开发常用的类有 HttpRequest,HttpResponse,Reps 等

### 6.2.JSON 数据

#### 6.2.1.实体类

```
package top.ppnt.java.ee.tio.http.server.boot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class User {
  private Integer id;
  private String loginName;
  private String nick;
  private String ip;
}
```

#### 6.2.2.接收 Json 数据

从 http 请求中获取 json 字符串
从 http 请求中获取 json 字符串,接收 JSON 数据有需要手动转为 JavaBean

```
String bodyString = request.getBodyString();
```

示例代码

```
  @RequestPath(value = "/getBodyString")
  public HttpResponse getBodyString(HttpRequest request) throws Exception {
    String bodyString = request.getBodyString();
    log.info(bodyString);
    HttpResponse ret = Resps.html(request, bodyString);
    return ret;
  }
```

请求信息

```
curl --location --request POST 'http://127.0.0.1/demo/getBodyString' \
--header 'User-Agent: apifox/1.0.0 (https://www.apifox.cn)' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--header 'Host: 127.0.0.1' \
--header 'Connection: keep-alive' \
--data-raw '{
    "ip": "49.174.104.160",
    "loginName": "引需必装起",
    "nick": "邹霞"
}'
```

自动封装为 java bean
在 Action 的方法签名上添加参数 User user

```
@RequestPath(value = "/bean")
public HttpResponse bean(User user, HttpRequest request) throws Exception {
}
```

支持 application/json

```
POST /demo/bean HTTP/1.1
Host: 127.0.0.1
User-Agent: apifox/1.0.0 (https://www.apifox.cn)
Content-Type: application/json
Accept: _/_
Host: 127.0.0.1
Connection: keep-alive

{
"ip": "69.134.20.34",
"loginName": "别同器",
"nick": "汪刚"
}
```

支持 application/x-www-form-urlencoded

```
GET /demo/bean HTTP/1.1
Host: 127.0.0.1
User-Agent: apifox/1.0.0 (https://www.apifox.cn)
Accept: _/_
Host: 127.0.0.1
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded

loginName=Ping%20E%20Lee&nick=%E6%9D%8E%E9%80%9A&ip=127.0.0..1
```

支持发送 POST 请求 multipart/form-data
示例

```
GET /demo/bean HTTP/1.1
Host: 127.0.0.1
User-Agent: apifox/1.0.0 (https://www.apifox.cn)
Accept: _/_
Host: 127.0.0.1
Connection: keep-alive
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW
----WebKitFormBoundary7MA4YWxkTrZu0gW
----WebKitFormBoundary7MA4YWxkTrZu0gW
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

支持 Get 请求
示例如下

```
GET /demo/bean?loginName=Ping%20E%20Lee&nick=%E6%9D%8E%E9%80%9A&ip=127.0.0..1 HTTP/1.1
Host: 127.0.0.1
User-Agent: apifox/1.0.0 (https://www.apifox.cn)
Accept: _/_
Host: 127.0.0.1
Connection: keep-alive
```

#### 6.2.3.返回 Json 数据

直接返回 json 数据
Action 的返回值可以直接是实体类,框架会自动进行转换

```
  @RequestPath(value = "/responseUser")
  public User responseUser(HttpRequest request) throws Exception {
    return User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
  }
```

响应

```
{
   "ip": "127.0.0.1",
   "loginName": "Ping E Lee",
   "nick": "李通"
}
```

使用 Resps.json(request, user);返回 json 数据

```
  @RequestPath(value = "/responseJson")
  public HttpResponse json(HttpRequest request) throws Exception {
    User user = User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
    HttpResponse ret = Resps.json(request, user);
    return ret;
  }
```

请求
http://127.0.0.1/demo/responseJson
响应

```
{
   "ip": "127.0.0.1",
   "loginName": "Ping E Lee",
   "nick": "李通"
}
```

使用 Resp 返回 Json 数据
核心代码

```
return Resps.json(request, Resp.ok(systemInfo));
```

```
import org.tio.http.common.HttpRequest;
import org.tio.http.common.HttpResponse;
import org.tio.http.server.annotation.RequestPath;
import org.tio.http.server.util.Resps;
import org.tio.utils.resp.Resp;


  @RequestPath("/responseJsonResp")
  public HttpResponse responseJsonResp(HttpRequest request) {
    User user = User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
    return Resps.json(request, Resp.ok(user));
  }

```

返回数据如下

```
{
    "data": "数据部分",
    "ok": true
}
```

使用 RespVo 返回 Json 数据
核心代码
return Resps.json(request, RespVo.ok(data));
示例

```
package com.litongjava.aio.server.tio.controller;

import com.litongjava.whipser.cpp.java.WhisperCppJnaLibrary;
import org.tio.http.common.HttpRequest;
import org.tio.http.common.HttpResponse;
import org.tio.http.server.annotation.RequestPath;
import org.tio.http.server.util.Resps;
import org.tio.utils.resp.RespVo;

  @RequestPath("/responseJsonResps")
  public HttpResponse responseJsonResps(HttpRequest request) {
    User user = User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
    return Resps.json(request, RespVo.ok(user));
  }
```

返回数据如下

```
{
    "data": "数据部分",
    "ok": true
}
```

### 6.3.接收文件

#### 6.3.1.接收文件

接受文件在 Controller 的方法中添加 UploadFile uploadFile 参数,在发送 http 请求时,请求的 key 是 uploadFile

```
import org.tio.utils.hutool.FileUtil;

  @RequestPath(value = "")
  public HttpResponse index(UploadFile uploadFile,HttpRequest request) throws Exception {
    if(uploadFile!=null) {
      byte[] fileData = uploadFile.getData();
      File file = new File(uploadFile.getName());
      FileUtil.writeBytes(fileData, file);
    }
    return Resps.json(request, "success");

  }
```

这段代码定义了一个处理 HTTP 请求的方法 `index`。该方法通过 `@RequestPath` 注解映射到一个空的 URL 路径（即默认路径）。它接收两个参数：一个 `UploadFile` 对象 `uploadFile` 和一个 `HttpRequest` 对象 `request`。

- 方法首先检查 `uploadFile` 是否为非空，如果非空，表示有文件上传。
- 然后，从 `uploadFile` 对象中获取文件数据（字节数组）和文件名。
- 使用 `FileUtil.writeBytes` 方法，将文件数据写入到一个新创建的 `File` 对象中，该对象使用上传文件的名称。
- 最后，该方法返回一个 JSON 格式的响应，内容为字符串 "success"。

这个方法的主要功能是处理文件上传的请求，将上传的文件保存在服务器上，并返回一个表示操作成功的响应。

#### 6.3.2.接受文件和包含上传参数

InputType 是 form 中的一个参数,可以省略
InputType 是 from 中的一个参数,可以省略

```
  @RequestPath(value = "")
  public HttpResponse index(UploadFile uploadFile, String InputType, String outputType, HttpRequest request)
      throws Exception {
    if (uploadFile != null) {
      byte[] fileData = uploadFile.getData();
      File file = new File(uploadFile.getName());
      FileUtil.writeBytes(fileData, file);
    }
    return Resps.json(request, "success");
  }
```

这段代码定义了一个处理 HTTP 请求的方法 `index`，它处理带有文件上传的请求。该方法接收四个参数：`UploadFile` 对象 `uploadFile`，两个字符串 `InputType` 和 `outputType`，以及一个 `HttpRequest` 对象 `request`。

- 如果 `uploadFile` 不为空，方法读取上传文件的数据（字节），然后创建一个新的 `File` 对象，文件名与上传的文件名相同。
- 使用 `FileUtil.writeBytes` 方法，将上传文件的数据写入到新创建的文件中。
- 最后，方法返回一个 JSON 格式的响应，内容为字符串 "success"。

#### 6.3.3.UploadFile 常用方法

类 `org.tio.http.common.UploadFile` 可能代表在 Web 应用程序上下文中的一个上传文件。下面是这些方法的简要说明：

1. `getName()`: 这个方法返回上传文件的名称。它用于识别文件，可能基于文件名扩展名确定其类型。

2. `getSize()`: 这个方法返回上传文件的大小，以字节为单位。它可以用来检查文件的大小，这对于验证目的（例如，确保文件不太大，应用程序能够处理）是必要的。

3. `getData()`: 这个方法返回文件的实际数据，以字节数组的形式。它用于处理文件的内容，如将其保存到服务器上或执行任何特定于文件的操作。

### 6.4.返回文件

```
  @RequestPath(value = "/filetest")
  public HttpResponse filetest(HttpRequest request) throws Exception {
    HttpResponse ret = Resps.file(request, new File("d:/tio.exe"));
    return ret;
  }


  @RequestPath(value = "/test.zip")
  public HttpResponse test_zip(HttpRequest request) throws Exception {
    String root = request.httpConfig.getPageRoot(request);
    HttpResponse ret = Resps.file(request, new File(root, "test/test.zip"));
    return ret;
  }
```

这两个方法都涉及处理 HTTP 请求并返回文件作为响应。

1. `filetest` 方法:

   - 通过 `@RequestPath` 注解映射到 `/filetest` URL 路径。
   - 方法使用 `Resps.file` 创建一个 `HttpResponse` 对象，该对象将发送位于 "d:/tio.exe" 的文件作为响应。

2. `test_zip` 方法:
   - 映射到 `/test.zip` URL 路径。
   - 首先，使用 `request.httpConfig.getPageRoot` 获取服务器的根目录。
   - 然后，使用 `Resps.file` 创建 `HttpResponse` 对象，返回位于根目录下 "test/test.zip" 路径的文件。

### 6.5.get 获取参数

```
@RequestPath(value = "/get")
public HttpResponse get(String before, String end, HttpRequest request) throws Exception {
  HttpResponse ret = Resps.html(request, "before:" + before + "<br>end:" + end);
  return ret;
}
```

这段代码定义了一个名为 `get` 的方法，通过 `@RequestPath` 注解映射到 URL 路径 `/get`。方法接收两个字符串参数 `before` 和 `end`，以及一个 `HttpRequest` 对象 `request`。

### 6.6.Post 获取参数

```
  @RequestPath(value = "/post")
  public HttpResponse post(String before, String end, User user, Short shortid, HttpRequest request) throws Exception {
    HttpResponse ret = Resps.html(request, "before:" + before + "<br>end:" + end + "<br>user:<pre>" + Json.toFormatedJson(user) + "</pre>");
    return ret;
  }
```

这段代码定义了一个名为 `post` 的方法，通过 `@RequestPath` 注解映射到 `/post` URL 路径。这个方法接收几个参数：两个字符串 `before` 和 `end`，一个 `User` 对象 `user`，一个 `Short` 类型的 `shortid`，以及一个 `HttpRequest` 对象 `request`。

这个方法的主要功能是接收 HTTP POST 请求，获取其中的参数和用户对象，并将这些信息以 HTML 格式的响应返回。

### 6.7.从请求地址中获取参数

示例代码

```
@RequestPath(value = "/var/{name}/{id}")
public HttpResponse var(String name, String id, HttpRequest request) throws Exception {
  HttpResponse ret = Resps.json(request, "name:" + name + "\r\n" + "id:" + id);
  return ret;
}
```

这段代码定义了一个处理 HTTP 请求的方法 `var`，该方法映射到一个 URL 路径模式 `/var/{name}/{id}`。这里的 `{name}` 和 `{id}` 是路径变量，它们在 URL 中动态替换成实际的值。方法接收两个字符串参数 `name` 和 `id`，这些参数自动从匹配的 URL 中提取。还有一个 `HttpRequest` 参数，代表接收到的 HTTP 请求。

方法的主体创建并返回一个 `HttpResponse` 对象，其中包含 `name` 和 `id` 的值。通过 `Resps.json` 方法生成响应，它将 `name` 和 `id` 的值格式化为 JSON 格式的字符串。这样，当访问对应的 URL 时，此方法将以 JSON 格式返回提取的 `name` 和 `id` 参数值。

### 6.8.接受日期类型

```
  @RequestPath(value = "/date")
  public HttpResponse date(Date[] date, java.sql.Date[] sqlDate, java.sql.Timestamp[] timestamp, HttpRequest request) throws Exception {
    HttpResponse ret = Resps.json(request, Json.toFormatedJson(date) + Json.toFormatedJson(sqlDate) + Json.toFormatedJson(timestamp));
    return ret;
  }
```

这段代码定义了一个 Web 请求处理方法 `date`，映射到 URL 路径 `/date`。它接收四个参数：一个 `Date` 类型的数组 `date`，一个 `java.sql.Date` 类型的数组 `sqlDate`，一个 `java.sql.Timestamp` 类型的数组 `timestamp`，以及一个 `HttpRequest` 对象 `request`。

方法的主体创建并返回一个 `HttpResponse` 对象。这个响应是使用 `Resps.json` 方法生成的，它将 `date`、`sqlDate` 和 `timestamp` 数组转换为格式化的 JSON 字符串，并将它们串联起来。这样，当访问对应的 URL 时，此方法将返回这些日期和时间数组的 JSON 表示形式。

### 6.9.接受数组

```

  @RequestPath(value = "/array")
  public HttpResponse array(String[] names, Integer[] ids, int[] primitiveIds, HttpRequest request) throws Exception {
    HttpResponse ret = Resps.json(request, Json.toFormatedJson(names) + Json.toFormatedJson(ids) + Json.toFormatedJson(primitiveIds));

    Object[] xx = request.getParamArray("names");
    log.info("xx:{}", Json.toFormatedJson(xx));
    return ret;
  }
```

这个方法 `array` 定义在一个 Web 应用程序中，通过 `@RequestPath` 注解映射到 URL 路径 `/array`。它接收四个参数：一个字符串数组 `names`，一个包装类 `Integer` 数组 `ids`，一个基本类型 `int` 的数组 `primitiveIds`，以及一个 `HttpRequest` 对象 `request`。

方法执行以下操作：

1. 使用 `Resps.json` 方法创建一个 `HttpResponse` 对象。这个方法将 `names`、`ids` 和 `primitiveIds` 数组转换为格式化的 JSON 字符串，并将它们串联起来作为响应内容。

2. 通过 `request.getParamArray("names")` 方法获取请求中名为 "names" 的参数数组，并将其存储在 `Object[] xx` 中。

3. 使用日志记录工具（`log.info`）记录 `xx` 数组的格式化 JSON 表示。

最终，这个方法返回包含 `names`、`ids` 和 `primitiveIds` 数组 JSON 表示的 `HttpResponse` 对象。这个方法的主要作用是处理包含多个数组参数的 HTTP 请求，并返回这些数组的 JSON 格式表示。

html 的 from 表单可以使用 input 标签使用下面的形式传参

```
string数组<br>
<input type="text" name="names" value="kobe">
<input type="text" name="names" value="tan">

<br><br>Integer数组<br>
<input type="text" name="ids" value="11">
<input type="text" name="ids" value="22">

<br><br>int数组<br>
<input type="text" name="primitiveIds" value="55">
<input type="text" name="primitiveIds" value="66">
```

### 6.10.返回文本数据

```
  @RequestPath(value = "/txt")
  public HttpResponse txt(HttpRequest request) throws Exception {
    HttpResponse ret = Resps.txt(request, txt);
    return ret;
  }
```

这段代码定义了一个名为 `txt` 的方法，通过 `@RequestPath` 注解映射到 `/txt` URL 路径。该方法接收一个 `HttpRequest` 对象 `request`。

方法执行以下操作：

- 使用 `Resps.txt` 方法创建一个 `HttpResponse` 对象。这个方法预计会将一个变量 `txt`（其定义未在代码段中显示）的内容作为文本格式的 HTTP 响应返回。

这个方法的主要功能是处理 HTTP 请求，并以纯文本格式返回 `txt` 变量中的内容。这种方式通常用于返回简单的文本数据。

### 6.11.返回网页

#### 6.11.1.无标签网页

```
  @RequestPath(value = "/plain")
  public HttpResponse plain(String before, String end, HttpRequest request) throws Exception {
    String bodyString = request.getBodyString();
    HttpResponse ret = Resps.html(request, bodyString);
    return ret;
  }
```

这段代码定义了一个名为 `plain` 的方法，通过 `@RequestPath` 注解映射到 `/plain` URL 路径。这个方法接收三个参数：两个字符串 `before` 和 `end`，以及一个 `HttpRequest` 对象 `request`。

- 方法内部首先调用 `request.getBodyString()` 方法获取 HTTP 请求的正文（body）内容，存储在 `bodyString` 变量中。
- 然后，使用 `Resps.html` 方法创建一个 `HttpResponse` 对象，将 `bodyString` 作为响应内容。

这个方法的主要作用是接收 HTTP 请求，获取请求的正文内容，并将这个内容以 HTML 响应格式返回。虽然方法名为 `plain`，实际上它以 HTML 格式返回请求的正文内容。

#### 6.11.2.有标签网页

```
  @RequestPath(value = "/html")
  public HttpResponse html(HttpRequest request) throws Exception {
    HttpResponse ret = Resps.html(request, html);
    return ret;
  }
```

这段代码定义了一个名为 `html` 的方法，它通过 `@RequestPath` 注解映射到 `/html` URL 路径。这个方法接收一个 `HttpRequest` 对象作为参数，并执行以下操作：

- 使用 `Resps.html` 方法创建一个 `HttpResponse` 对象。这个方法将生成一个包含 `html` 内容的 HTTP 响应。
- `html` 变量应该是一个包含 HTML 内容的字符串，但代码中没有显示其定义，可能是在方法外部定义的。

该方法的主要作用是当接收到特定的 HTTP 请求时，返回一个包含 HTML 内容的响应。

### 6.12.Session

```
  @RequestPath(value = "/putsession")
  public HttpResponse putsession(String value, HttpRequest request) throws Exception {
    request.getHttpSession().setAttribute("test", value, request.httpConfig);
    HttpResponse ret = Resps.json(request, "设置成功:" + value);
    return ret;
  }
```

这段代码定义了一个名为 `putsession` 的方法，通过 `@RequestPath` 注解映射到 `/putsession` URL 路径。该方法接收两个参数：一个字符串 `value` 和一个 `HttpRequest` 对象 `request`。

方法的工作原理是：

- 通过 `request.getHttpSession()` 获取当前 HTTP 会话。
- 使用 `setAttribute` 方法将 `value` 存储在会话属性中，键名为 "test"。
- 然后，使用 `Resps.json` 方法创建一个 `HttpResponse` 对象，作为响应内容返回字符串 `"设置成功:" + value`。

这个方法的主要功能是处理 HTTP 请求，将一个值保存在用户会话中，并返回一个表示设置成功的 JSON 格式响应。这种方式通常用于在会话中存储用户相关数据。

```
  @RequestPath(value = "/getsession")
  public HttpResponse getsession(HttpRequest request) throws Exception {
    String value = (String) request.getHttpSession().getAttribute("test");
    HttpResponse ret = Resps.json(request, "获取的值:" + value);
    return ret;
  }
```

这段代码定义了一个名为 `getsession` 的方法，通过 `@RequestPath` 注解映射到 `/getsession` URL 路径。该方法接收一个 `HttpRequest` 对象 `request`。

在方法中：

- 首先通过 `request.getHttpSession().getAttribute("test")` 从当前 HTTP 会话中获取键名为 "test" 的属性值。这个值被转换成一个字符串 `value`。
- 然后，使用 `Resps.json` 方法创建一个 `HttpResponse` 对象，作为响应内容返回字符串 `"获取的值:" + value`。

这个方法的主要功能是处理 HTTP 请求，从会话中获取特定的属性值，并返回这个值的 JSON 格式响应。这种方式通常用于在 Web 应用程序中从会话中检索用户数据。

### 6.13.CROS

#### 6.13.1.@EnableCORS

如果想要 Controller 支持 CROS,在类上添加@EnableCORS 即可
如果想要 Action 支持 CROS,在方法上添加@EnableCORS 即可
DefaultHttpRequestHandler.processDynamic 方法会处理@EnableCORS 注解
@EnableCORS 使用示例如下

```
package com.litongjava.tio.boot.admin.controller.api.admin.system;

import com.litongjava.tio.boot.annotation.EnableCORS;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

@RequestPath("/admin-api/system/captcha")
@EnableCORS
public class CaptchaController {

  @RequestPath("/check")
  public HttpResponse check(HttpRequest request) {
    HttpResponse response = Resps.json(request, "OK");
    return response;
  }
}
```

#### 6.13.2.HttpResponseUtils.enableCORS

如果你为了更高的性能可以不使用@EnableCORS,使用 HttpResponseUtils.enableCORS 方法
代码示例

```
HttpResponse response = Resps.json(request, "OK");
HttpResponseUtils.enableCORS(response, new HttpCors());
```

## 7.整合 jfinal-aoop

tio-boot 已经内置了 jfinal-aop 依赖
jfinal-aop 源码:https://github.com/litongjava/jfinal-aop
jfinal-aop 文档:https://litongjava.github.io/jfinal-doc/zh/4%20AOP/4.1%20%E6%A6%82%E8%BF%B0.html

### 7.1.Aop.get

```
import java.util.HashMap;
import java.util.Map;

public class IndexService {

  public Map<String, String> index() {
    Map<String, String> ret = new HashMap<>();
    ret.put("data", "Hello 4");
    return ret;
  }
}
```

```
import java.util.Map;

import com.litongjava.jfinal.aop.Aop;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.web.hello.service.IndexService;

@RequestPath("/")
public class IndexController {
  @RequestPath()
  public Map<String,String> index() {
    return Aop.get(IndexService.class).index();
  }
}

```

执行后返回的数据是

```
{"data":"Hello 4"}
```

这两个类构成了一个简单的 MVC (Model-View-Controller) 结构。

1. `IndexService` 类：

   - 这是一个服务类，包含一个 `index` 方法，用于创建并返回一个 `Map<String, String>` 类型的数据。在这个方法中，它向 `Map` 中添加了一个键值对 `"data": "Hello 4"`。

2. `IndexController` 类：
   - 这是一个控制器类，标记了 `@RequestPath("/")`，表明它处理根路径（`/`）的 HTTP 请求。
   - 其中的 `index` 方法通过 `Aop.get(IndexService.class).index()` 调用 `IndexService` 的 `index` 方法。

`Aop.get` 方法的作用是从 AOP（面向切面编程）容器中获取 `IndexService` 类的实例。这意味着 `IndexService` 类可能被作为一个单例来管理，它的实例化与生命周期可能由 AOP 框架来控制，而非手动创建。这种做法允许 `IndexService` 拥有如依赖注入、拦截器等 AOP 功能。

当 Aop.get 方法时,如果荣器中不存在对于的对象,Aop 容器会创建后在返回
当 `IndexController` 的 `index` 方法被调用时，它会返回 `IndexService.index` 方法生成的 `Map`，即 `{"data": "Hello 4"}`。

### 7.2.Aop 拦击器@Before

```
import com.litongjava.jfinal.aop.Interceptor;
import com.litongjava.jfinal.aop.Invocation;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class IndexInteceptor implements Interceptor {

  @Override
  public void intercept(Invocation inv) {
    log.info("1before");
    inv.invoke();
    log.info("after");
  }

}
```

```
import java.util.Map;

import com.litongjava.jfinal.aop.Aop;
import com.litongjava.jfinal.aop.Before;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.web.hello.service.IndexService;

@RequestPath("/")
public class IndexController {
  @RequestPath()
  @Before(IndexInteceptor.class)
  public Map<String, String> index() {
    return Aop.get(IndexService.class).index();
  }
}
```

`IndexInteceptor` 是一个拦截器类，实现了 `Interceptor` 接口。它定义了 `intercept` 方法，该方法在被拦截的方法执行前后添加了日志记录。通过调用 `inv.invoke()`，它允许继续执行链中的下一个拦截器或目标方法。

在 `IndexController` 类中，`@Before(IndexInteceptor.class)` 注解被应用于 `index` 方法。这表示当调用 `index` 方法时，`IndexInteceptor` 将被触发，执行其 `intercept` 方法。这允许在 `index` 方法执行之前和之后执行额外的逻辑，例如日志记录、验证等。

### 7.3.Aop 相关注解

1. **@ComponentScan**: 用于指定 在初始化时要扫描的包。这个注解会查找标记有 `@Component`、`@Service`、`@Repository`、`@Controller` 等注解的类，并注册为 Aop 容器中的 Bean。

2. **@Configuration**: 表示该类是一个配置类，该类可以包含有 `@Bean` 注解的方法。Spring 容器会在启动时自动调用这些方法，注册返回值为容器中的 Bean。

3. **@Bean**: 标记在方法上，表明该方法产生一个 Bean 对象，然后这个对象被 Aop 容器管理。通常在 `@Configuration` 注解的类中使用。

4. **@Component**: 基本的注解，标记一个类为组件。当使用基于注解的配置和类路径扫描时，这个注解的类会自动注册为 Spring Bean。

5. **@Controller**: 用于标记控制器组件，通常用在 MVC 模式的 Web 应用程序中。这个注解表明类的实例是一个控制器。

6. **@Service**: 用于标记服务层组件，通常用于业务逻辑层。这个注解表明类的实例是一个“服务”，它可以包含业务逻辑，调用数据访问层等。

7. **@Repository**: 用于标记数据访问组件，即 DAO（Data Access Object）组件。这个注解表明类的实例是一个“仓库”，用于封装数据库访问和异常处理。

8. **@HttpRequest**: 用于标记 Http 组件，例如用于 HttpClient 请求。

9. **@Inject**: `@Autowired` 类似，但它是来自 Java CDI（Contexts and Dependency Injection）的标准注解。用于依赖注入。

10. **@Autowired**: 用于自动注入依赖。它可以应用于字段、构造器、方法等，Spring 容器会在创建 Bean 时自动注入相应的依赖。

11. **@Clear**: 用于清除 Aop 拦截器

12. **@Before**: 这个注解与 AOP（面向切面编程）有关，用于标记一个方法在某操作之前执行。

13. **@Import**: 用于导入其他配置类。在一个配置类上使用 `@Import`，可以将其他配置类中的 Bean 导入当前的配置类中。

### 7.4.Aop 其他方法

获取 Aop 容器中的所有 bean

```
String[] beans = Aop.beans();
```

添加一个类到 Bean 容器中

```
AopManager.me().addSingletonObject(bean);
```

添加一个实现带有接口的实现类到 Bean 容器中

```
AopManager.me().addMapping(SharedPreferences.class, sharedPreferences.getClass());
AopManager.me().addSingletonObject(sharedPreferences);
```

1. **AopManager.me().addMapping(SharedPreferences.class, sharedPreferences.getClass());**

   - `AopManager.me()`：这通常获取 `AopManager` 的单例实例。`AopManager` 可能是一个管理 AOP 行为和配置的类。
   - `addMapping(SharedPreferences.class, sharedPreferences.getClass())`：这个方法调用可能是在告诉 AOP 框架，当遇到 `SharedPreferences` 类型的依赖注入请求时，应该实例化 `sharedPreferences.getClass()` 返回的类。这里 `SharedPreferences` 是一个接口或类，而 `sharedPreferences.getClass()` 是具体的实现类。

2. **AopManager.me().addSingletonObject(sharedPreferences);**
   - `addSingletonObject(sharedPreferences)`：这个方法调用可能是在告诉 AOP 框架，`sharedPreferences` 对象应该被视为单例，并且在 AOP 框架的上下文中管理。这意味着当有依赖注入请求 `SharedPreferences` 类型的实例时，框架会提供这个已经创建的 `sharedPreferences` 实例。

## 8.参数校验

为了实现高性能推荐在 Controller 中使用自定义方法进行校验,使用示例如下

```
import com.jfinal.kit.StrKit;
import com.litongjava.tio.utils.resp.RespVo;

public class LoginValidator {
  public RespVo validateLogin(String username, String password, String verificationCode) {
    RespVo retval = null;

    //验证username
    if (StrKit.isBlank(username)) {
      retval = RespVo.fail("The username or password cannot be empty");
      return retval;
    }

    //验证其他字段
    // ...
    //验证成功返回null,验证不成功返回RespVo
    return retval;
  }
}
```

```
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.utils.resp.RespVo;
import com.litongjava.tio.web.hello.validator.LoginValidator;

@RequestPath("/auth")
public class LoginController {

  public RespVo login(String username, String password, String verificationCode) {

    RespVo validateResult = Aop.get(LoginValidator.class).validateLogin(username, password, verificationCode);
    if (validateResult != null) return validateResult;

    return RespVo.ok();
  }
}
```

这段代码展示了一个登录验证流程，分为验证器类 `LoginValidator` 和控制器类 `LoginController`。

1. `LoginValidator` 类：

   - 包含一个 `validateLogin` 方法，用于验证登录参数：`username`, `password`, `verificationCode`。
   - 首先检查 `username` 是否为空，如果为空，则返回一个包含错误消息的 `RespVo` 对象。
   - 方法还可以进一步验证其他字段，如果所有验证都通过，则返回 `null`；如果任何验证不通过，则返回包含错误信息的 `RespVo`。

2. `LoginController` 类：
   - 通过 `@RequestPath("/auth")` 注解映射到 `/auth` 路径。
   - `login` 方法接收登录参数并使用 `Aop.get(LoginValidator.class).validateLogin` 调用验证器进行验证。
   - 如果验证结果非空（即有错误），方法返回这个验证结果；如果验证通过（验证结果为空），则返回 `RespVo.ok()` 表示登录成功。

## 9.Enjoy 模版引擎

### 9.1.返回模版

配置 EnjoyEngine

```
package com.litongjava.ai.chat.config;

import com.jfinal.template.Engine;
import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;

@Configuration
public class EnjoyEngineConfig {

  private final String RESOURCE_BASE_PATH = "/templates/";

  @Bean
  public Engine engine() {
    Engine engine = Engine.use();
    engine.setBaseTemplatePath(RESOURCE_BASE_PATH);
    engine.setToClassPathSourceFactory();
    // 支持模板热加载，绝大多数生产环境下也建议配置成 true，除非是极端高性能的场景
    engine.setDevMode(true);
    // 配置极速模式，性能提升 13%
    Engine.setFastMode(true);
    // jfinal 4.9.02 新增配置：支持中文表达式、中文变量名、中文方法名、中文模板函数名
    Engine.setChineseExpression(true);
    return engine;
  }

}
```

在 Controoler 使用 Engine 获取网页并返回

```
package com.litongjava.ai.chat.controller;

import com.jfinal.template.Engine;
import com.jfinal.template.Template;
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

@RequestPath()
public class TemplatesController {
  private Engine engine = Aop.get(Engine.class);

  @RequestPath("/404")
  public Template notFound(HttpRequest request) {
    String fileName = "/404.html";
    Template template = engine.getTemplate(fileName);
    return template;
  }

  @RequestPath("/chat")
  public HttpResponse chat(HttpRequest request) {
    String fileName = "/chat.html";
    return renderHtml(request, fileName);
  }
}
```

解释一下上面的代码

这段代码包含两个类，配置了 JFinal 的 Enjoy 模板引擎，并在控制器中使用了该引擎。

1. `EnjoyEngineConfig` 类：

   - 使用 `@Configuration` 注解标记，表示这是一个配置类。
   - `engine` 方法创建并配置 `Engine` 实例。设置了基础模板路径、类路径源工厂、开发模式、极速模式和支持中文表达式的选项。

2. `TemplatesController` 类：
   - 使用 `@RequestPath` 注解，无指定路径，表明它是一个处理 HTTP 请求的控制器。
   - `notFound` 方法通过 Enjoy 模板引擎处理 `/404` 请求，返回 `/404.html` 模板。
   - `chat` 方法处理 `/chat` 请求，返回 `/chat.html` 模板。

3.HandlerDispatcher.afterExecuteAction(HttpRequest, HttpResponse, Object) 方法中会 Template 类进行渲染并返回,可以在 action 使用 request.setAttribute("key", "value");设置参数到模版中

## 10.常用 web 组件

### 10.1.请求拦截器

#### 10.1.1.使用拦截器

```
package com.litongjava.tio.boot.admin.config;

import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.litongjava.tio.boot.admin.inteceptor.GlobalInteceptor;
import com.litongjava.tio.boot.admin.inteceptor.HelloInteceptor;
import com.litongjava.tio.boot.http.interceptor.ServerInteceptorConfigure;

@Configuration
public class IntecpetorConfig {

  @Bean
  public ServerInteceptorConfigure serverInteceptorRoutes() {
    ServerInteceptorConfigure config = new ServerInteceptorConfigure();
    config.add("/**", GlobalInteceptor.class);
    config.add("/hello", HelloInteceptor.class);
    return config;
  }

}
```

定义全局拦截器

```
package com.litongjava.tio.boot.admin.inteceptor;

import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.common.RequestLine;
import com.litongjava.tio.http.server.intf.HttpServerInterceptor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GlobalInteceptor implements HttpServerInterceptor {

  public HttpResponse doBeforeHandler(HttpRequest request, RequestLine requestLine, HttpResponse responseFromCache)
      throws Exception {
    log.info("request:{}", request);
    return responseFromCache;
  }

  public void doAfterHandler(HttpRequest request, RequestLine requestLine, HttpResponse response, long cost)
      throws Exception {
    log.info("request:{}", request);

  }

}
```

定义普通拦击器

```
package com.litongjava.tio.boot.admin.inteceptor;

import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.common.RequestLine;
import com.litongjava.tio.http.server.intf.HttpServerInterceptor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HelloInteceptor implements HttpServerInterceptor {

  public HttpResponse doBeforeHandler(HttpRequest request, RequestLine requestLine, HttpResponse responseFromCache)
      throws Exception {
    log.info("request", request);
    return null;
  }

  public void doAfterHandler(HttpRequest request, RequestLine requestLine, HttpResponse response, long cost)
      throws Exception {
    log.info("request", request);

  }
}
```

1. `IntecpetorConfig` 类：

   - 用 `@Configuration` 注解标记，表明它是一个配置类。
   - 定义了 `serverInteceptorRoutes` 方法，用 `@Bean` 注解标记，表明它提供一个 bean 实例。
   - 在这个方法中，创建了 `ServerInteceptorConfigure` 实例，并通过 `add` 方法添加了两个拦截器：`GlobalInteceptor` 应用于所有路径（`/**`），`HelloInteceptor` 仅应用于 `/hello` 路径。

2. `GlobalInteceptor` 和 `HelloInteceptor` 类：

   - 两个类都实现了 `HttpServerInterceptor` 接口。
   - `doBeforeHandler` 方法在处理 HTTP 请求之前执行。对于 `GlobalInteceptor`，它返回 `responseFromCache`，而 `HelloInteceptor` 返回 `null`。
   - `doAfterHandler` 方法在请求处理后执行，记录请求信息。

3. DefaultHttpServerInterceptor 会执行拦截器,拦截器的执行顺序是 config.add 添加的顺序

#### 10.1.2.拦截器讲解

定义一个拦击器需要实现 `HttpServerInterceptor` 接口，用于拦截 HTTP 请求。它主要包含两个方法：

1. `doBeforeHandler`：在处理 HTTP 请求之前被调用。这个方法记录了请求的信息，并返回原来的响应对象（`responseFromCache`），如果有的话。如果返回值为 null 则会执行后续拦击器,如果返回的值不为 null 则不会执行后续的拦击器

2. `doAfterHandler`：在处理 HTTP 请求之后被调用。这个方法再次记录了请求的信息，并可以进行额外的处理。

通过这个拦截器，可以在请求处理的前后阶段记录日志，监控请求的详细情况或执行其他自定义逻辑。这在跟踪和分析 HTTP 请求流程时非常有用。

### 10.2.WebSocket

#### 10.2.1.使用 WebSocket

配置 websocket 路由

```
package com.litongjava.tio.web.socket.hello.config;

import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.litongjava.tio.boot.websocket.handler.WebSocketRoutes;
import com.litongjava.tio.web.socket.hello.handler.HelloWebSocketHandler;

@Configuration
public class WebSocketConfig {

  @Bean
  public WebSocketRoutes webSocketRoutes() {
    WebSocketRoutes webSocketRoutes = new WebSocketRoutes();
    webSocketRoutes.add("/hello", HelloWebSocketHandler.class);
    return webSocketRoutes;
  }

}
```

实现 websocket 处理器

```
import java.util.Objects;

import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.core.Tio;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.websocket.common.WsRequest;
import com.litongjava.tio.websocket.common.WsResponse;
import com.litongjava.tio.websocket.common.WsSessionContext;
import com.litongjava.tio.websocket.server.handler.IWsMsgHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HelloWebSocketHandler implements IWsMsgHandler {

  /**
   * 用于群聊的group id
   */
  public static final String GROUP_ID = "showcase-websocket";
  public static final String CHARSET = "utf-8";

  /**
   * 握手时走这个方法，业务可以在这里获取cookie，request参数等
   */
  @Override
  public HttpResponse handshake(HttpRequest request, HttpResponse httpResponse, ChannelContext channelContext)
      throws Exception {
    String clientip = request.getClientIp();
    String myname = request.getParam("name");

    Tio.bindUser(channelContext, myname);
//    channelContext.setUserid(myname);
    log.info("收到来自{}的ws握手包\r\n{}", clientip, request.toString());
    return httpResponse;
  }

  /**
   * @param httpRequest
   * @param httpResponse
   * @param channelContext
   * @throws Exception
   * @author tanyaowu
   */
  @Override
  public void onAfterHandshaked(HttpRequest httpRequest, HttpResponse httpResponse, ChannelContext channelContext)
      throws Exception {
    // 绑定到群组，后面会有群发
    Tio.bindGroup(channelContext, GROUP_ID);
    int count = Tio.getAll(channelContext.tioConfig).getObj().size();

    String msg = "{name:'admin',message:'" + channelContext.userid + " 进来了，共【" + count + "】人在线" + "'}";
    // 用tio-websocket，服务器发送到客户端的Packet都是WsResponse
    WsResponse wsResponse = WsResponse.fromText(msg, CHARSET);
    // 群发
    Tio.sendToGroup(channelContext.tioConfig, GROUP_ID, wsResponse);
  }

  /**
   * 字节消息（binaryType = arraybuffer）过来后会走这个方法
   */
  @Override
  public Object onBytes(WsRequest wsRequest, byte[] bytes, ChannelContext channelContext) throws Exception {
    return null;
  }

  /**
   * 当客户端发close flag时，会走这个方法
   */
  @Override
  public Object onClose(WsRequest wsRequest, byte[] bytes, ChannelContext channelContext) throws Exception {
    Tio.remove(channelContext, "receive close flag");
    return null;
  }

  /*
   * 字符消息（binaryType = blob）过来后会走这个方法
   */
  @Override
  public Object onText(WsRequest wsRequest, String text, ChannelContext channelContext) throws Exception {
    WsSessionContext wsSessionContext = (WsSessionContext) channelContext.get();
    String path = wsSessionContext.getHandshakeRequest().getRequestLine().path;
    log.info("path:{}", path);

    // log.info("收到ws消息:{}", text);

    if (Objects.equals("心跳内容", text)) {
      return null;
    }
    // channelContext.getToken()
    // String msg = channelContext.getClientNode().toString() + " 说：" + text;
    String msg = "{name:'" + channelContext.userid + "',message:'" + text + "'}";
    // 用tio-websocket，服务器发送到客户端的Packet都是WsResponse
    WsResponse wsResponse = WsResponse.fromText(msg, CHARSET);
    // 群发
    Tio.sendToGroup(channelContext.tioConfig, GROUP_ID, wsResponse);

    // 返回值是要发送给客户端的内容，一般都是返回null,返回为null,handler不会发送数据
    return null;
  }
}
```

这两个类涉及 WebSocket 的配置和处理。

1. `WebSocketConfig` 类：

   - 使用 `@Configuration` 注解标记，表明它是配置类。
   - 通过 `@Bean` 注解提供了 `WebSocketRoutes` 的配置，其中定义了一个 WebSocket 路径和处理器的映射。`"/hello"` 路径映射到 `HelloWebSocketHandler` 处理器。

2. `HelloWebSocketHandler` 类：
   - 实现了 `IWsMsgHandler` 接口，用于处理 WebSocket 消息。
   - `doBeforeHandler` 方法在处理 WebSocket 消息之前调用，可以进行如日志记录等操作。
   - `onAfterHandshaked` 方法在 WebSocket 握手后调用，用于群发消息和绑定用户到群组。
   - `onText` 方法处理接收到的文本消息，群发处理后的消息。

4.DefaultWebSocketHandler 会进行 WebSocketHandler 分发

#### 10.2.2.WebSocketHandler 讲解

定义一个类实现 `IWsMsgHandler` 接口，用于处理 WebSocket 消息。IWsMsgHandler 方式如下

- `doBeforeHandler` 方法在处理 WebSocket 消息之前调用，可以进行如日志记录等操作。
- `onAfterHandshaked` 方法在 WebSocket 握手后调用，用于群发消息和绑定用户到群组。
- `onClose` 方法在 websocket 关闭是调用,用户进行资源回收
- `onBytes` 方法处理接收到的字节消息
- `onText` 方法处理接收到的文本消息。

如果要像客户端发送消息,你可以直接调用 Tio 工具类系列方法
Tio.sendToGroup(channelContext.tioConfig, GROUP_ID, wsResponse);

如果 onBytes 和 onText 和 onClose 返回值不为 null.DefaultWebSocketHandler 会获取返回值发送到客户端,推荐返回值为 null,自己在方法中发送数据到客户端

因为 Websocket 协议的特殊性,http 的拦截器不会在 websocket 之前执行,如果包含验证功能,你需要再 WebsocketHanlder 中再次进行验证

## 11.数据库

### 11.1.整合 SQLLite 数据库

#### 11.1.1.创建 sqllite 数据库

sqllite 是一个嵌入式的数据库
使用 Navicat Premium 创建 sqllite 文件

创建表,插入数据

CREATE TABLE "student" (
"id" integer NOT NULL,
"name" text NOT NULL,
"grade" textNOT NULL,
PRIMARY KEY ("id")
);

INSERT INTO "student" VALUES (1, '沈', '一年级');

#### 11.1.2.整合 sqllite

添加依赖

```
<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>4.0.3</version>
</dependency>

<!-- sqlite-jdbc -->
<dependency>
  <groupId>org.xerial</groupId>
  <artifactId>sqlite-jdbc</artifactId>
  <version>3.7.2</version>
</dependency>

<dependency>
  <groupId>com.litongjava</groupId>
  <artifactId>table-to-json</artifactId>
  <version>1.2.1</version>
</dependency>
```

添加配置文件 app.properties

```
http.port = 80
http.page = classpath:/pages

http.404 = /404
http.500 = /500
http.maxLiveTimeOfStaticRes=0

#jdbc-sqlliste
jdbc.url=jdbc:sqlite:D:/sqllite/student.db
jdbc.user=
jdbc.pswd=
jdbc.showSql=true
```

添加配置类

添加 Controller

启动测试

### 11.2.整合 Mysql 数据库

#### 11.2.1.创建表,插入数据

创建一张简单的 student 表

```
CREATE TABLE `student` (
`id` bigint(20) NOT NULL,
`name` varchar(255),
`grade` varchar(255),
PRIMARY KEY (`id`)
);

INSERT INTO student VALUES (1, '沈', '一年级');
INSERT INTO student VALUES (2, '李', '一年级');
INSERT INTO student VALUES (3,'张', '二年级');
```

#### 11.2.2.添加依赖

```
<dependency>
  <groupId>com.litongjava</groupId>
  <artifactId>table-to-json</artifactId>
  <version>1.2.1</version>
</dependency>


<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>5.1.46</version>
</dependency>

<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>4.0.3</version>
</dependency>
```

#### 11.2.3.配置文件-app.properties

```
http.port = 80
http.page = classpath:/pages

http.404 = /404
http.500 = /500

http.maxLiveTimeOfStaticRes=0

jdbc.url=jdbc:mysql://192.168.3.9/table_to_json_test?characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=UTC
jdbc.user=root
jdbc.pswd=robot_123456#
```

#### 11.2.4.编写启动类

```
import org.tio.utils.jfinal.P;

import com.litongjava.hotswap.wrapper.tio.boot.TioApplicationWrapper;
import com.litongjava.jfinal.aop.annotation.ComponentScan;

@ComponentScan
public class TioBootWebApp {

  public static void main(String[] args) throws Exception {
    long start = System.currentTimeMillis();
    P.use("app.properties");
    TioApplicationWrapper.run(TioBootWebApp.class, args);
    long end = System.currentTimeMillis();
    System.out.println("started:" + (end - start) + "(ms)");
  }
}
```

#### 11.2.5.编写配置类

TableToJsonConfig.java,
注意观察 DataSource 的 priority 是 1,priority 表示 bean 启动的优先级,值越小,启动的优先级越高

```
import javax.sql.DataSource;

import org.tio.utils.jfinal.P;

import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.OrderedFieldContainerFactory;
import com.jfinal.template.Engine;
import com.jfinal.template.source.ClassPathSourceFactory;
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class TableToJsonConfig {

  /
   * config datasource
   * @return
   */
  @Bean(priority = 1)
  public DataSource dataSource() {
    String jdbcUrl = P.get("jdbc.url");
    String jdbcUser = P.get("jdbc.user");

    String jdbcPswd = P.get("jdbc.pswd");

    HikariConfig config = new HikariConfig();
    // 设定基本参数
    config.setJdbcUrl(jdbcUrl);
    config.setUsername(jdbcUser);
    config.setPassword(jdbcPswd);
//    config.setMaximumPoolSize(2);

    return new HikariDataSource(config);
  }

  /
   * config ActiveRecordPlugin
   * @return
   * @throws Exception
   */
  @Bean(destroyMethod = "stop", initMethod = "start")
  public ActiveRecordPlugin activeRecordPlugin() throws Exception {
    DataSource dataSource = Aop.get(DataSource.class);
    String property = P.get("tio.mode");
    ActiveRecordPlugin arp = new ActiveRecordPlugin(dataSource);
    arp.setContainerFactory(new OrderedFieldContainerFactory());
    if ("dev".equals(property)) {
      arp.setDevMode(true);
    }

    Engine engine = arp.getEngine();
    engine.setSourceFactory(new ClassPathSourceFactory());
    engine.setCompressorOn(' ');
    engine.setCompressorOn('\n');
    // arp.addSqlTemplate("/sql/all_sqls.sql");
//    arp.start();
    return arp;
  }
}
```

#### 11.2.6.编写 Controller

查询 student 表中的所有数据,代码如下

```
import java.util.List;

import org.tio.http.common.HttpRequest;
import org.tio.http.server.annotation.RequestPath;

import com.jfinal.kit.Kv;
import com.litongjava.data.model.DbJsonBean;
import com.litongjava.data.services.DbJsonService;
import com.litongjava.data.utils.DbJsonBeanUtils;
import com.litongjava.jfinal.aop.Aop;

@RequestPath("/db/student")
public class DbTestController {

  DbJsonService dbJsonService = Aop.get(DbJsonService.class);

  @RequestPath("/list")
  public DbJsonBean<List<Kv>> list(HttpRequest request) {
    String tableName = "student";
    DbJsonBean<List<Kv>> jsonBean = DbJsonBeanUtils.recordsToKv(dbJsonService.listAll(tableName));
    return jsonBean;
  }
}
```

访问 http://localhost/db/student/list 输出如下

```
{"code":0,"data":[{"grade":"一年级","name":"沈","id":"1"},{"grade":"一年级","name":"李","id":"2"},{"grade":"二年级","name":"张","id":"3"}],"msg":""}
```

### 11.3.整合 PostGresql 数据库

#### 11.3.1.创建表,插入数据

创建一张简单的 student 表

```
CREATE TABLE "public"."student" (
"id" int8 NOT NULL,
"name" varchar(255),
"grade" varchar(255),
PRIMARY KEY ("id")
);

INSERT INTO student VALUES (1, '沈', '一年级');
INSERT INTO student VALUES (2, '李', '一年级');
INSERT INTO student VALUES (3,'张', '二年级');
```

#### 11.3.2.添加依赖

新建工程 tio-boot-postgresql-demo

```
<dependency>
  <groupId>com.litongjava</groupId>
  <artifactId>table-to-json</artifactId>
  <version>1.2.1</version>
</dependency>

<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.2.24</version>
</dependency>

<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>4.0.3</version>
</dependency>
```

#### 11.3.3.配置文件 app.properties

```
http.port = 80
http.page = classpath:/pages

http.404 = /404
http.500 = /500

http.maxLiveTimeOfStaticRes=0

jdbc.url=jdbc:postgresql://192.168.3.7/student
jdbc.user=postgres
jdbc.pswd=robot_1234546
```

#### 11.3.4.编写启动类

```
package com.litongjava.tio.boot.postgresql.demo;

import org.tio.utils.jfinal.P;

import com.litongjava.hotswap.wrapper.tio.boot.TioApplicationWrapper;
import com.litongjava.jfinal.aop.annotation.ComponentScan;

@ComponentScan
public class PostgresqlApp {

  public static void main(String[] args) throws Exception {
    long start = System.currentTimeMillis();
    P.use("app.properties");
    TioApplicationWrapper.run(PostgresqlApp.class, args);
    long end = System.currentTimeMillis();
    System.out.println("started:" + (end - start) + "(ms)");
  }
}
```

#### 11.3.5.编写配置类

TableToJsonConfig.java,
注意观察

- DataSource 的 priority 是 1,priority 表示 bean 启动的优先级,值越小,启动的优先级越高
- arp.setDialect(new PostgreSqlDialect()); 设置了数据库方言为 PostgreSQLDialect

```
package com.litongjava.tio.boot.postgresql.demo.config;

import javax.sql.DataSource;

import org.tio.utils.jfinal.P;

import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.OrderedFieldContainerFactory;
import com.jfinal.plugin.activerecord.dialect.PostgreSqlDialect;
import com.jfinal.template.Engine;
import com.jfinal.template.source.ClassPathSourceFactory;
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class TableToJsonConfig {

  /
   * config datasource
   * @return
   */
  @Bean(priority = 1)
  public DataSource dataSource() {
    String jdbcUrl = P.get("jdbc.url");
    String jdbcUser = P.get("jdbc.user");

    String jdbcPswd = P.get("jdbc.pswd");

    HikariConfig config = new HikariConfig();
    // 设定基本参数
    config.setJdbcUrl(jdbcUrl);
    config.setUsername(jdbcUser);
    config.setPassword(jdbcPswd);
    return new HikariDataSource(config);
  }

  /
   * config ActiveRecordPlugin
   * @return
   * @throws Exception
   */
  @Bean(destroyMethod = "stop", initMethod = "start")
  public ActiveRecordPlugin activeRecordPlugin() throws Exception {
    DataSource dataSource = Aop.get(DataSource.class);
    String property = P.get("tio.mode");
    ActiveRecordPlugin arp = new ActiveRecordPlugin(dataSource);
    arp.setContainerFactory(new OrderedFieldContainerFactory());
    arp.setDialect(new PostgreSqlDialect());
    if ("dev".equals(property)) {
      arp.setDevMode(true);
    }

    Engine engine = arp.getEngine();
    engine.setSourceFactory(new ClassPathSourceFactory());
    engine.setCompressorOn(' ');
    engine.setCompressorOn('\n');
    return arp;
  }
}
```

#### 11.3.6.编写 Controller

查询 student 表中的所有数据,代码如下

```
package com.litongjava.tio.boot.hello.controller;

import java.util.List;

import org.tio.http.common.HttpRequest;
import org.tio.http.server.annotation.RequestPath;

import com.jfinal.kit.Kv;
import com.litongjava.data.model.DbJsonBean;
import com.litongjava.data.services.DbJsonService;
import com.litongjava.data.utils.DbJsonBeanUtils;
import com.litongjava.jfinal.aop.Aop;

@RequestPath("/db/student")
public class DbTestController {

  DbJsonService dbJsonService = Aop.get(DbJsonService.class);

  @RequestPath("/list")
  public DbJsonBean<List<Kv>> list(HttpRequest request) {
    String tableName = "student";
    DbJsonBean<List<Kv>> jsonBean = DbJsonBeanUtils.recordsToKv(dbJsonService.listAll(tableName));
    return jsonBean;
  }
}
```

访问 http://localhost/db/student/list
输出如下

```
{"code":0,"data":[{"grade":"一年级","name":"沈","id":"1"},{"grade":"一年级","name":"李","id":"2"},{"grade":"二年级","name":"张","id":"3"}],"msg":""}
```

## 12.常用内置类方法说明

### 12.1.HttpRequest

#### 1. `HttpRequest(Node remote)`

- **说明**: 构造一个 HttpRequest 对象，并设置远程节点。
- **用法**:
  ```java
  Node remoteNode = new Node("127.0.0.1", 8080);
  HttpRequest httpRequest = new HttpRequest(remoteNode);
  ```

#### 2. `HttpRequest()`

- **说明**: 创建一个无参的 HttpRequest 对象。
- **用法**:
  ```java
  HttpRequest httpRequest = new HttpRequest();
  ```

#### 3. `close()`

- **说明**: 关闭此 HttpRequest 的连接。
- **用法**:
  ```java
  httpRequest.close();
  ```

#### 4. `close(String remark)`

- **说明**: 带备注的关闭此 HttpRequest 的连接。
- **用法**:
  ```java
  httpRequest.close("Connection closed due to timeout.");
  ```

#### 5. `addParam(String key, Object value)`

- **说明**: 向 HttpRequest 添加一个参数。
- **用法**:
  ```java
  httpRequest.addParam("username", "user123");
  ```

#### 6. `forward(String newPath)`

- **说明**: 将 HttpRequest 转发到新的路径。
- **用法**:
  ```java
  httpRequest.forward("/new/path");
  ```

#### 7. `getBodyFormat()`

- **说明**: 获取 HttpRequest 的请求体格式。
- **用法**:
  ```java
  RequestBodyFormat bodyFormat = httpRequest.getBodyFormat();
  ```

#### 8. `getUserAgent()`

- **说明**: 获取用户代理字符串。
- **用法**:
  ```java
  String userAgent = httpRequest.getUserAgent();
  ```

#### 9. `getHost()`

- **说明**: 获取请求头中的 host 字段值。
- **用法**:
  ```java
  String host = httpRequest.getHost();
  ```

#### 10. `getClientIp()`

- **说明**: 获取真实的客户端 IP 地址。
- **用法**:
  ```java
  String clientIp = httpRequest.getClientIp();
  ```

#### 11. `addHeader(String key, String value)`

- **说明**: 添加一个 HTTP 头字段。
- **用法**:
  ```java
  httpRequest.addHeader("Content-Type", "application/json");
  ```

#### 12. `getDomain()`

- **说明**: 获取请求域名。
- **用法**:
  ```java
  String domain = httpRequest.getDomain();
  ```

#### 13. `getBodyString()`

- **说明**: 获取请求体的字符串表示形式。
- **用法**:
  ```java
  String bodyString = httpRequest.getBodyString();
  ```

#### 14. `getChannelContext()`

- **说明**: 获取当前 HTTP 请求的通道上下文。
- **用法**:
  ```java
  ChannelContext channelContext = httpRequest.getChannelContext();
  ```

#### 15. `getContentLength()`

- **说明**: 获取请求体的长度。
- **用法**:
  ```java
  int contentLength = httpRequest.getContentLength();
  ```

#### 16. `getCookie(String cooiename)`

- **说明**: 根据名称获取一个 Cookie 对象。
- **用法**:
  ```java
  Cookie cookie = httpRequest.getCookie("session_id");
  ```

#### 17. `getCookieMap()`

- **说明**: 获取所有 Cookie 的映射。
- **用法**:
  ```java
  Map<String, Cookie> cookieMap = httpRequest.getCookieMap();
  ```

#### 18. `getCookies()`

- **说明**: 获取所有 Cookies 的列表。
- **用法**:
  ```java
  List<Cookie> cookies = httpRequest.getCookies();
  ```

#### 19. `getHttpConfig()`

- **说明**: 获取 HTTP 配置。
- **用法**:
  ```java
  HttpConfig httpConfig = httpRequest.getHttpConfig();
  ```

#### 20. `getHttpSession()`

- **说明**: 获取 HTTP 会话。
- **用法**:
  ```java
  HttpSession httpSession = httpRequest.getHttpSession();
  ```

#### 21. `getHeader(String key)`

- **说明**: 获取指定 HTTP 头的值。
- **用法**:
  ```java
  String value = httpRequest.getHeader("Accept");
  ```

#### 22. `getIsAjax()`

- **说明**: 判断请求是否是 Ajax 请求。
- **用法**:
  ```java
  Boolean isAjax = httpRequest.getIsAjax();
  ```

#### 23. `getIsSupportGzip()`

- **说明**: 判断请求是否

支持 Gzip 压缩。

- **用法**:
  ```java
  Boolean isSupportGzip = httpRequest.getIsSupportGzip();
  ```

#### 24. `getParams()`

- **说明**: 获取所有请求参数的映射。
- **用法**:
  ```java
  Map<String, Object[]> params = httpRequest.getParams();
  ```

#### 25. `getParam()`

- **说明**: 获取单个请求参数。
- **用法**:
  ```java
  Object param = httpRequest.getParam("key");
  ```

#### 26. `getString(String name)`

- **说明**: 获取指定名称的字符串参数。
- **用法**:
  ```java
  String value = httpRequest.getString("name");
  ```

#### 27. `getInt(String name)`

- **说明**: 获取指定名称的整型参数。
- **用法**:
  ```java
  Integer intValue = httpRequest.getInt("age");
  ```

#### 28. `getRemote()`

- **说明**: 获取远程节点信息。
- **用法**:
  ```java
  Node remote = httpRequest.getRemote();
  ```

#### 29. `getRequestLine()`

- **说明**: 获取请求行信息
- **用法**:
  ```java
  RequestLine requestLine = httpRequest.getRequestLine();
  ```

#### 30. `logstr()`

- **说明**: 返回 HttpRequest 的日志字符串，通常包含请求 ID、头部信息和请求体。
- **用法**:
  ```java
  String logString = httpRequest.logstr();
  ```

#### 31. `parseCookie(HttpConfig httpConfig)`

- **说明**: 解析 HttpRequest 中的 Cookie 信息。
- **用法**:
  ```java
  httpRequest.parseCookie(httpConfig);
  ```

#### 32. `setBodyFormat(RequestBodyFormat bodyFormat)`

- **说明**: 设置 HttpRequest 的请求体格式。
- **用法**:
  ```java
  httpRequest.setBodyFormat(RequestBodyFormat.JSON);
  ```

#### 33. `setBodyString(String bodyString)`

- **说明**: 设置 HttpRequest 的请求体内容。
- **用法**:
  ```java
  httpRequest.setBodyString("{\"name\":\"John\"}");
  ```

#### 34. `setChannelContext(ChannelContext channelContext)`

- **说明**: 设置 HttpRequest 的通道上下文。
- **用法**:
  ```java
  httpRequest.setChannelContext(channelContext);
  ```

#### 35. `setCharset(String charset)`

- **说明**: 设置 HttpRequest 的字符集。
- **用法**:
  ```java
  httpRequest.setCharset("UTF-8");
  ```

#### 36. `setContentLength(int contentLength)`

- **说明**: 设置 HttpRequest 的内容长度。
- **用法**:
  ```java
  httpRequest.setContentLength(1024);
  ```

#### 37. `setCookieMap(Map<String, Cookie> cookieMap)`

- **说明**: 设置 HttpRequest 的 Cookie 映射。
- **用法**:
  ```java
  httpRequest.setCookieMap(cookieMap);
  ```

#### 38. `setCookies(List<Cookie> cookies)`

- **说明**: 设置 HttpRequest 的 Cookies 列表。
- **用法**:
  ```java
  httpRequest.setCookies(cookies);
  ```

#### 39. `setHeaders(Map<String, String> headers)`

- **说明**: 设置 HttpRequest 的头部信息。
- **用法**:
  ```java
  Map<String, String> headers = new HashMap<>();
  headers.put("Content-Type", "application/json");
  httpRequest.setHeaders(headers);
  ```

#### 40. `setHttpConfig(HttpConfig httpConfig)`

- **说明**: 设置 HttpRequest 的 HTTP 配置。
- **用法**:
  ```java
  httpRequest.setHttpConfig(httpConfig);
  ```

#### 41. `setHttpSession(HttpSession httpSession)`

- **说明**: 设置 HttpRequest 的 HTTP 会话。
- **用法**:
  ```java
  httpRequest.setHttpSession(httpSession);
  ```

#### 42. `setIsAjax(Boolean isAjax)`

- **说明**: 设置 HttpRequest 是否为 Ajax 请求。
- **用法**:
  ```java
  httpRequest.setIsAjax(true);
  ```

#### 43. `setIsSupportGzip(Boolean isSupportGzip)`

- **说明**: 设置 HttpRequest 是否支持 Gzip 压缩。
- **用法**:
  ```java
  httpRequest.setIsSupportGzip(true);
  ```

#### 44. `setParams(Map<String, Object[]> params)`

- **说明**: 设置 HttpRequest 的参数映射。
- **用法**:
  ```java
  Map<String, Object[]> params = new HashMap<>();
  params.put("key", new Object[]{"value"});
  httpRequest.setParams(params);
  ```

#### 45. `setRemote(Node remote)`

- **说明**: 设置 HttpRequest 的远程节点信息。
- **用法**:
  ```java
  httpRequest.setRemote(new Node("127.0.0.1", 8080));
  ```

#### 46. `setRequestLine(RequestLine requestLine)`

- **说明**: 设置 HttpRequest 的请求行。
- **用法**:
  ```java
  RequestLine requestLine = new RequestLine("GET", "/api/data", "HTTP/1.1");
  httpRequest.setRequestLine(requestLine);
  ```

#### 47. `toString()`

- **说明**: 返回 HttpRequest 对象的字符串表示。
- **用法**:
  ```java
  String httpRequestString = httpRequest.toString();
  ```

#### 48. `isClosed()`

- **说明**: 检查 HttpRequest 是否已关闭。
- **用法**:
  ```java
  boolean isClosed = httpRequest.isClosed();
  ```

#### 49. `setClosed(boolean closed)`

- **说明**: 设置 HttpRequest 的关闭状态。
- **用法**:
  ```java
  httpRequest.setClosed(true);
  ```

#### 50. `getConnection()`

- **说明**: 获取 HttpRequest 的连接信息

。

- **用法**:
  ```java
  String connection = httpRequest.getConnection();
  ```

#### 51. `setConnection(String connection)`

- **说明**: 设置 HttpRequest 的连接信息。
- **用法**:
  ```java
  httpRequest.setConnection("keep-alive");
  ```

#### 52. `getReferer()`

- **说明**: 获取请求头中的 Referer 字段。
- **用法**:
  ```java
  String referer = httpRequest.getReferer();
  ```

#### 53. `isNeedForward()`

- **说明**: 检查 HttpRequest 是否需要转发。
- **用法**:
  ```java
  boolean needForward = httpRequest.isNeedForward();
  ```

#### 54. `setNeedForward(boolean needForward)`

- **说明**: 设置 HttpRequest 是否需要转发。
- **用法**:
  ```java
  httpRequest.setNeedForward(true);
  ```

#### 55. `isForward()`

- **说明**: 检查 HttpRequest 是否正在转发。
- **用法**:
  ```java
  boolean isForwarding = httpRequest.isForward();
  ```

#### 56. `setForward(boolean isForward)`

- **说明**: 设置 HttpRequest 的转发状态。
- **用法**:
  ```java
  httpRequest.setForward(true);
  ```

### 12.2.HttpResponse

`HttpResponse` 类扩展自 `HttpPacket`，用于表示 HTTP 响应。它包含了与 HTTP 响应相关的状态码、头部信息、Cookie 和主体内容。

#### 构造方法

1. **`HttpResponse()`**

   - 说明：默认构造函数，初始化一个空的 HTTP 响应对象。

2. **`HttpResponse(HttpRequest request)`**

   - 参数：`HttpRequest request` - 对应的 HTTP 请求。
   - 说明：根据提供的 HTTP 请求创建响应。这种方式允许响应与请求相关联，从而可以更好地处理连接和版本兼容性。

3. **`HttpResponse(Map<HeaderName, HeaderValue> responseHeaders, byte[] body)`**
   - 参数：`Map<HeaderName, HeaderValue> responseHeaders` - 响应头部。
   - 参数：`byte[] body` - 响应主体。
   - 说明：通过指定的头部信息和主体内容创建一个 HTTP 响应。

#### 公开方法

1. **`crossDomain()`**

   - 说明：设置响应头以支持跨域请求。

2. **`cloneResponse(HttpRequest request, HttpResponse response)`**

   - 参数：`HttpRequest request` - HTTP 请求。
   - 参数：`HttpResponse response` - 要克隆的响应。
   - 返回：`HttpResponse` - 响应对象

3. **`getHeaders()`**

   - 返回：`Map<HeaderName, HeaderValue>` - 响应头部。
   - 说明：返回 HTTP 响应的头部信息。注意，不应直接修改返回的 Map 对象，而应使用提供的方法来添加或修改头部。

4. **`addHeader(HeaderName key, HeaderValue value)`**

   - 参数：`HeaderName key` - 头部名称。
   - 参数：`HeaderValue value` - 头部值。
   - 说明：向响应中添加一个头部。

5. **`addHeaders(Map<HeaderName, HeaderValue> headers)`**

   - 参数：`Map<HeaderName, HeaderValue> headers` - 要添加的头部集合。
   - 说明：添加一组头部到响应中。

6. **`getContentType()`**

   - 返回：`HeaderValue` - "Content-Type"头部的值。
   - 说明：获取响应的"Content-Type"头部内容。

7. **`addCookie(Cookie cookie)`**

   - 参数：`Cookie cookie` - 要添加的 Cookie。
   - 返回：`boolean` - 添加是否成功。
   - 说明：向响应中添加一个 Cookie。

8. **`getCharset()`**

   - 返回：`String` - 字符集。
   - 说明：获取响应使用的字符集。

9. **`getCookies()`**

   - 返回：`List<Cookie>` - Cookie 列表。
   - 说明：返回响应中包含的所有 Cookie。

10. **`getHttpRequest()`**

    - 返回：`HttpRequest` - 对应的 HTTP 请求。
    - 说明：获取与此响应相关联的 HTTP 请求。

11. **`getStatus()`**

    - 返回：`HttpResponseStatus` - 响应状态。
    - 说明：获取响应的状态码。

12. **`isStaticRes()`**

    - 返回：`boolean` - 是否是静态资源。
    - 说明：检查此响应是否表示静态资源。

13. **`logstr()`**

    - 返回：`String` - 日志字符串。
    - 说明：生成响应的日志表示，通常用于调试和日志记录。

14. **`setCharset(String charset)`**

    - 参数：`String charset` - 字符集。
    - 说明：设置响应使用的字符集。

15. **`setCookies(List<Cookie> cookies)`**

    - 参数：`List<Cookie> cookies` - Cookie 列表。
    - 说明：设置响应中包含的 Cookie。

16. **`setHttpRequestPacket(HttpRequest request)`**

    - 参数：`HttpRequest request` - HTTP 请求。
    - 说明：设置与此响应相关联的 HTTP 请求。

17. **`setStaticRes(boolean isStaticRes)`**

    - 参数：`boolean isStaticRes` - 是否是静态资源。
    - 说明：设置此响应是否表示静态资源。

18. **`setStatus(HttpResponseStatus status)`**

    - 参数：`HttpResponseStatus status` - 响应状态。
    - 说明：设置响应的状态码。

19. **`isHasGzipped()`**

    - 返回：`boolean` - 是否已经被 GZIP 压缩。
    - 说明：检查响应的内容是否已经被 GZIP 压缩。

20. **`setHasGzipped(boolean hasGzipped)`**

    - 参数：`boolean hasGzipped` - 是否已经被 GZIP 压缩。
    - 说明：设置响应的内容是否已经被 GZIP 压缩。

21. **`isSkipIpStat()`**

    - 返回：`boolean` - 是否忽略 IP 访问统计。
    - 说明：检查是否忽略对此响应的 IP 访问统计。

22. **`setSkipIpStat(boolean skipIpStat)`**

    - 参数：`boolean skipIpStat` - 是否忽略 IP 访问统计。
    - 说明：设置是否忽略对此响应的 IP 访问统计。

23. **`isSkipTokenStat()`**

    - 返回：`boolean` - 是否忽略 token 访问统计。
    - 说明：检查是否忽略对此响应的 token 访问统计。

24. **`setSkipTokenStat(boolean skipTokenStat)`**

    - 参数：`boolean skipTokenStat` - 是否忽略 token 访问统计。
    - 说明：设置是否忽略对此响应的 token 访问统计。

25. **`getLastModified()`**

    - 返回：`HeaderValue` - 最后修改时间。
    - 说明：获取响应的最后修改时间头部。

26. **`getHeader(HeaderName name)`**

    - 参数：`HeaderName name` - 头部名称。
    - 返回：`HeaderValue` - 头部值。
    - 说明：根据头部名称获取相应的头部值。

27. **`setLastModified(HeaderValue lastModified)`**

    - 参数：`HeaderValue lastModified` - 最后修改时间。
    - 说明：设置响应的最后修改时间头部。

28. **`toString()`**

    - 返回：`String` - 响应的字符串表示。
    - 说明：返回响应的字符串表示，通常用于调试和日志记录。

29. **`getHeaderByteCount()`** - 返回：`int` - 头部字节计数。 - 说明：获取响应头部的字节大小。

### 12.3.Resps

1. css(HttpRequest request, String bodyString)：创建一个带有给定正文字符串的 CSS 响应。设置 `Content-Type` 为 `text/css;charset=utf-8`。

2. css(HttpRequest request, String bodyString, String charset)：与上一个方法类似，但允许指定字符集。

3. bytes(HttpRequest request, byte[] bodyBytes, String extension)：使用字节数组作为正文创建响应。`Content-Type` 从文件扩展名推断得出。

4. file(HttpRequest request, File fileOnServer)：根据服务器上的文件构建响应。如果文件不存在，则处理 404 错误。

5. file(HttpRequest request, String path)：重载方法，根据文件路径创建响应。

6. resp404(HttpRequest request, RequestLine requestLine, HttpConfig httpConfig)：返回带有可自定义错误页面的 404 响应。

7. resp404(HttpRequest request)：简化方法，返回 404 响应。

8. resp500(HttpRequest request, RequestLine requestLine, HttpConfig httpConfig, Throwable throwable)：返回 500 响应，通常用于服务器错误。

9. resp500(HttpRequest request, Throwable throwable)：与上一个方法类似，但简化了方便使用。

10. bytesWithContentType(HttpRequest request, byte[] bodyBytes, String contentType)：创建带有字节数组内容和指定 `Content-Type` 的响应。

11. bytesWithHeaders(HttpRequest request, byte[] bodyBytes, Map<HeaderName, HeaderValue> headers)：与上一个方法类似，但允许添加额外的头部。

12. html(HttpRequest request, String bodyString)：生成带有给定正文字符串的 HTML 响应。

13. forward(HttpRequest request, String newPath)：将请求重定向到新路径。

14. html(HttpRequest request, String bodyString, String charset)：类似于 `html` 方法，但允许指定字符集。

15. js(HttpRequest request, String bodyString)：生成带有指定正文字符串的 JavaScript 响应。

16. js(HttpRequest request, String bodyString, String charset)：与 `js` 方法类似，但允许指定字符集。

17. json(HttpRequest request, Object body)：将对象转换为 JSON 并作为响应发送。

18. json(HttpRequest request, Object body, String charset)：类似于 `json` 方法，但允许指定字符集。

19. redirect(HttpRequest request, String path)：将客户端重定向到指定路径。

20. redirectForever(HttpRequest request, String path)：类似于 `redirect`，但表示永久重定向。

21. redirect(HttpRequest request, String path, HttpResponseStatus status)：带有指定 HTTP 状态的重定向。

22. redirectWithPage(HttpRequest request, String path)：使用 HTML 页面中的脚本重定向。

23. string(HttpRequest request, String bodyString, String Content_Type)：发送带有指定 `Content-Type` 的字符串响应。

24. string(HttpRequest request, String bodyString, String charset, String mimeTypeStr)：与前一个方法类似，但允许指定字符集和 MIME 类型。

25. try304(HttpRequest request, long lastModifiedOnServer)：检查自上次请求以来内容是否已修改；如果没有，发送 304 未修改的响应。

26. txt(HttpRequest request, String bodyString)：发送纯文本响应。

27. txt(HttpRequest request, String bodyString, String charset)：类似于 `txt` 方法，但允许指定字符集。

每个方法都旨在处理 HTTP 响应生成的不同方面，使发送基于请求和所需内容类型的适当响应变得更加容易。

### 12.4.Tio

`Tio`是一个用于管理网络通信的核心类，特别是在处理客户端和服务器之间的连接、消息发送、连接绑定和关闭等功能。类包含了大量的用于管理网络连接、发送和接收数据包、处理连接状态、以及管理连接的黑名单等操作的方法。这些方法使得开发者可以在客户端和服务器之间有效地进行通信，并对连接进行精细化管理.

下面是每个方法的中文解释：`Tio`

#### 静态内部类 `IpBlacklist`

1. **add(TioConfig tioConfig, String ip)**: 将 IP 地址添加到特定 `TioConfig` 的黑名单中。
2. **add(String ip)**: 将 IP 地址添加到全局黑名单中。
3. **clear(TioConfig tioConfig)**: 清空特定 `TioConfig` 的黑名单。
4. **clear()**: 清空全局黑名单。
5. **getAll(TioConfig tioConfig)**: 获取特定 `TioConfig` 的黑名单列表。
6. **getAll()**: 获取全局黑名单列表。
7. **isInBlacklist(TioConfig tioConfig, String ip)**: 检查 IP 是否在特定 `TioConfig` 的黑名单中。
8. **remove(TioConfig tioConfig, String ip)**: 从特定 `TioConfig` 的黑名单中移除 IP。
9. **remove(String ip)**: 从全局黑名单中移除 IP。

#### 类方法

1. **bindBsId(ChannelContext channelContext, String bsId)**: 将业务 ID 绑定到特定的通道上下文（`ChannelContext`）。
2. **bindGroup(ChannelContext channelContext, String group)**: 将群组绑定到特定的通道上下文。
3. **bindGroup(TioConfig tioConfig, String userid, String group)**: 将用户 ID 绑定到群组。
4. **bindToken(ChannelContext channelContext, String token)**: 将令牌绑定到特定的通道上下文。
5. **bindUser(ChannelContext channelContext, String userid)**: 将用户 ID 绑定到特定的通道上下文。
6. **bSend(ChannelContext channelContext, Packet packet)**: 阻塞方式发送消息到指定的通道上下文。
7. **bSend(TioConfig tioConfig, String ip, int port, Packet packet)**: 阻塞方式发送消息到指定的 IP 和端口。
8. **bSendToAll(TioConfig tioConfig, Packet packet, ChannelContextFilter channelContextFilter)**: 阻塞方式发送消息给所有连接。
9. **bSendToBsId(TioConfig tioConfig, String bsId, Packet packet)**: 阻塞方式发送消息给指定业务 ID 的连接。
10. **bSendToGroup(TioConfig tioConfig, String group, Packet packet, ChannelContextFilter channelContextFilter)**: 阻塞方式发送消息给指定群组。
11. **bSendToId(TioConfig tioConfig, String channelContextId, Packet packet)**: 阻塞方式发送消息给指定的通道上下文 ID。
12. **bSendToIp(TioConfig tioConfig, String ip, Packet packet, ChannelContextFilter channelContextFilter)**: 阻塞方式发送消息给指定 IP 的所有连接。
13. bSendToSet(TioConfig tioConfig, SetWithLock&lt;ChannelContext&gt; setWithLock, Packet packet, ChannelContextFilter channelContextFilter) 阻塞方式发送消息给指定的一组通道上下文。
14. **bSendToToken(TioConfig tioConfig, String token, Packet packet)**: 阻塞方式发送消息给指定令牌的所有连接。
15. **bSendToUser(TioConfig tioConfig, String userid, Packet packet)**: 阻塞方式发送消息给指定用户 ID 的所有连接。
16. **close(ChannelContext channelContext, String remark)**: 关闭指定的通道上下文连接。
17. **close(ChannelContext channelContext, String remark, CloseCode closeCode)**: 关闭指定的通道上下文连接，并指定关闭代码。
18. **closeIp(TioConfig tioConfig, String ip, String remark, CloseCode closeCode)**: 关闭指定 IP 的所有连接。
19. **closeGroup(TioConfig tioConfig, String group, String remark, CloseCode closeCode)**: 关闭指定群组的所有连接。
20. **closeUser(TioConfig tioConfig, String userid, String remark, CloseCode closeCode)**: 关闭指定用户 ID 的所有连接。
21. **closeToken(TioConfig tioConfig, String token, String remark, CloseCode closeCode)**: 关闭指定令牌的所有连接。
22. **getAll(TioConfig tioConfig)**: 获取特定 `TioConfig` 的所有连接。
23. **getConnecteds(ClientTioConfig clientTioConfig)**: 获取客户端配置中所有处于正常连接状态的连接。
24. **getByBsId(TioConfig tioConfig, String bsId)**: 根据业务 ID 查找通道上下文。
25. **getByClientNode(TioConfig tioConfig, String clientIp, Integer clientPort)**: 根据客户端 IP 和端口获取通道上下文。
26. **getByChannelContextId(TioConfig tioConfig, String channelContextId)**: 根据通道上下文 ID 获取通道上下文。
27. **getByGroup(TioConfig tioConfig, String group)**: 获取指定群组的所有客户端。
28. **getByToken(TioConfig tioConfig, String token)**: 根据令牌获取通道上下文集合。
29. **getByIp(TioConfig tioConfig, String ip)**: 根据客户端 IP 获取通道上下文集合。
30. **getByUserid(TioConfig tioConfig, String userid)**: 根据用户 ID 获取通道上下文集合。
31. **getPageOfAll(TioConfig tioConfig, Integer pageIndex, Integer pageSize)**: 获取所有连接的分页列表。
32. **getPageOfConnecteds(ClientTioConfig clientTioConfig, Integer pageIndex, Integer pageSize)**: 获取客户端配置中所有正常连接的分页列表。
33. **getPageOfGroup(TioConfig tioConfig, String group, Integer pageIndex, Integer pageSize)**: 获取指定群组中所有连接的分页列表。
34. **groupCount(TioConfig tioConfig, String group)**: 获取指定群组中连接的数量。
35. **isInGroup(String group, ChannelContext channelContext)**: 检查指定的通道上下文是否在给定的群组中。
36. **remove(ChannelContext channelContext, String remark)**: 移除指定的通道上下文。
37. **remove(TioConfig tioConfig, String clientIp, Integer clientPort, Throwable throwable, String remark)**: 删除指定 IP 和端口的连接。
38. **remove(ServerTioConfig serverTioConfig, String ip, String remark)**: 删除指定 IP 的所有连接。
39. **send(ChannelContext channelContext, Packet packet)**: 发送消息到指定的通道上下文。
40. **send(TioConfig tioConfig, String ip, int port, Packet packet)**: 发送消息到指定的 IP 和端口。
41. **sendToAll(TioConfig tioConfig, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给所有连接。
42. **sendToBsId(TioConfig tioConfig, String bsId, Packet packet)**: 发送消息给指定业务 ID 的连接。
43. **sendToGroup(TioConfig tioConfig, String group, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给指定群组。
44. **sendToId(TioConfig tioConfig, String channelContextId, Packet packet)**: 发送消息给指定的通道上下文 ID。
45. **sendToIp(TioConfig tioConfig, String ip, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给指定 IP 的所有连接。
46. **sendToSet(TioConfig tioConfig, SetWithLock&lt;ChannelContext&gt; setWithLock, Packet packet, ChannelContextFilter channelContextFilter)**: 发送消息给指定的一组通道上下文。
47. **sendToToken(TioConfig tioConfig, String token, Packet packet)**: 发送消息给指定令牌的所有连接。
48. **sendToUser(TioConfig tioConfig, String userid, Packet packet)**: 发送消息给指定用户 ID 的所有连接。
49. **unbindBsId(ChannelContext channelContext)**: 解绑通道上下文的业务 ID。
50. **unbindGroup(ChannelContext channelContext)**: 解除指定通道上下文的群组绑定。
51. **unbindGroup(String group, ChannelContext channelContext)**: 将指定通道上下文从特定群组中解绑。
52. **unbindGroup(TioConfig tioConfig, String userid, String group)**: 将用户 ID 从群组中解除绑定。
53. **unbindToken(ChannelContext channelContext)**: 解除通道上下文绑定的令牌。
54. **unbindToken(TioConfig tioConfig, String token)**: 解除特定令牌的绑定。
55. **unbindUser(ChannelContext channelContext)**: 解除通道上下文绑定的用户 ID。
56. **unbindUser(TioConfig tioConfig, String userid)**: 解除特定用户 ID 的绑定。
