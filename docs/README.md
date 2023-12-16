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

## gpts-jfinal

你可以询问 gpts jfinal,它已经包含了本框架的部分知识
https://chat.openai.com/g/g-za2zgLE34-jfinal

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
      <version>1.1.8</version>
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
  <tio.boot.version>1.1.8</tio.boot.version>
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
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.litongjava</groupId>
  <artifactId>tio-boot-web-hello</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>1.8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
    <graalvm.version>23.1.1</graalvm.version>
    <tio.boot.version>1.1.7</tio.boot.version>
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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>2.7.4</version>
            <configuration>
              <mainClass>${main.class}</mainClass>
              <excludeGroupIds>org.projectlombok</excludeGroupIds>
            </configuration>
            <!-- 设置执行目标 -->
            <executions>
              <execution>
                <goals>
                  <goal>repackage</goal>
                </goals>
              </execution>
            </executions>
          </plugin>
        </plugins>
      </build>
    </profile>
    <!-- assembly -->
    <profile>
      <id>assembly</id>
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
                --no-fallback
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

@RequestPath 注解用于指定请求路径,当在启动类上添加@ComponentScan 注解后,启动时注解处理器会处理@RequestPath 注解将 Controller 添加到 bean 容器中并设置路由

#### 2.1.8.启动测试

访问 http://localhost/

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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>2.7.4</version>
            <configuration>
              <mainClass>${main.class}</mainClass>
              <excludeGroupIds>org.projectlombok</excludeGroupIds>
            </configuration>
            <!-- 设置执行目标 -->
            <executions>
              <execution>
                <goals>
                  <goal>repackage</goal>
                </goals>
              </execution>
            </executions>
          </plugin>
        </plugins>
      </build>
    </profile>
    <!-- assembly -->
    <profile>
      <id>assembly</id>
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
                --no-fallback
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
export JAVA_HOME=~/program/graalvm-jdk-21.0.1+18.1
export GRAALVM_HOME=~/program/graalvm-jdk-21.0.1+18.1
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

```
import com.litongjava.tio.http.server.annotation.RequestPath;

@RequestPath("/test")
public class TestController {

  @RequestPath
  public String index() {
    return "index";
  }
}
```

在 Action 的方法签名中支持的类型有

- ServerChannelContext
- HttpConfig
- HttpSession
- HttpRequest

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

##### 从 http 请求中获取 json 字符串

从 http 请求中获取 json 字符串,接收 JSON 数据有需要手动转为 JavaBean

```
String bodyString = request.getBodyString();
```

示例代码

```
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

import lombok.extern.slf4j.Slf4j;

@RequestPath("/test/json")
@Slf4j
public class TestJsonController {

  @RequestPath(value = "/getBodyString")
  public HttpResponse getBodyString(HttpRequest request) throws Exception {
    String bodyString = request.getBodyString();
    log.info(bodyString);
    HttpResponse ret = Resps.txt(request, bodyString);
    return ret;
  }

}
```

1. **`@RequestPath`**:
   @RequestPath("/test/json"),用于声明这个类是一个请求控制器，并指定了访问这个控制器的基础 URL 路径。在这种情况下，任何发送到 `/test/json` 的 HTTP 请求都将由这个控制器处理。

2. **Method `getBodyString`**:
   - `@RequestPath(value = "/getBodyString")`: 这个方法注解指定了具体的请求路径。当 HTTP 请求发送到 `/test/json/getBodyString` 时，将调用此方法。
   - 方法接收一个 `HttpRequest` 对象作为参数，代表接收到的 HTTP 请求。
   - `request.getBodyString()`: 从 HTTP 请求体中获取字符串内容。
   - `log.info(bodyString)`: 使用日志记录请求体的内容。
   - `HttpResponse ret = Resps.txt(request, bodyString)`: 创建一个 `HttpResponse` 对象来响应请求。`Resps.txt` 方法创建了一个文本响应，内容为请求体中的字符串。
   - `return ret;`: 返回构建的响应对象。
     请求信息

```
curl --location --request POST 'http://127.0.0.1/test/json/getBodyString' \
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

##### 自动封装为 java bean

在 Action 的方法签名上添加参数 User user

```
import com.litongjava.tio.boot.hello.model.User;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

import lombok.extern.slf4j.Slf4j;

@RequestPath("/test/json")
@Slf4j
public class TestJsonController {

  @RequestPath(value = "/bean")
  public User bean(User user, HttpRequest request) throws Exception {
    return user;
  }

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
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.boot.hello.model.User;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

import lombok.extern.slf4j.Slf4j;

@RequestPath("/test/json")
@Slf4j
public class TestJsonController {

  @RequestPath(value = "/responseUser")
  public User responseUser(HttpRequest request) throws Exception {
    return User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
  }

}

```

@RequestPath(value = "/responseUser"): 方法注解，指定了此方法处理的具体请求路径。当 HTTP 请求发送到 /test/json/responseUser 时，此方法将被调用。
方法返回 User 类型的对象。这里使用了 User 类的 builder 模式创建了一个 User 对象，并设置了相关属性。
该方法无需额外的 HTTP 响应处理，因为 tio-boot 框架将自动处理 User 对象的序列化并返回 JSON 格式的响应。
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
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.boot.hello.model.User;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

import lombok.extern.slf4j.Slf4j;

@RequestPath("/test/json")
@Slf4j
public class TestJsonController {

  @RequestPath(value = "/responseJson")
  public HttpResponse json(HttpRequest request) throws Exception {
    User user = User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
    HttpResponse ret = Resps.json(request, user);
    return ret;
  }
}
```

**Method `responseJson`**:

- `@RequestPath(value = "/responseJson")`: 方法注解，指定了此方法处理的具体请求路径。当 HTTP 请求发送到 `/test/json/responseJson` 时，此方法将被调用。
- 方法内部创建了一个 `User` 对象，使用了 Builder 模式设置了其属性。
- 使用 `Resps.json(request, user)` 生成了一个包含 JSON 格式用户数据的 `HttpResponse` 对象。这种方式是 tio-boot 框架中处理和返回 JSON 数据的标准做法。
- 最后，方法返回这个 `HttpResponse` 对象。

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
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.boot.hello.model.User;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;
import com.litongjava.tio.utils.resp.Resp;

import lombok.extern.slf4j.Slf4j;

@RequestPath("/test/json")
@Slf4j
public class TestJsonController {

  @RequestPath("/responseJsonResp")
  public HttpResponse responseJsonResp(HttpRequest request) {
    User user = User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
    return Resps.json(request, Resp.ok(user));
  }
}
```

**Method `responseJsonResp`**:

- `@RequestPath("/responseJsonResp")`: 方法注解，指定了此方法处理的具体请求路径。当 HTTP 请求发送到 `/test/json/responseJsonResp` 时，此方法将被调用。
- 方法内部创建了一个 `User` 对象，使用了 Builder 模式设置了其属性。
- 使用 `Resps.json(request, Resp.ok(user))` 生成了一个包含 JSON 格式用户数据的 `HttpResponse` 对象。`Resp.ok(user)` 封装了 `User` 对象，并添加了一些额外的响应信息，例如成功状态。
- 最后，方法返回这个 `HttpResponse` 对象。
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
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.boot.hello.model.User;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;
import com.litongjava.tio.utils.resp.Resp;
import com.litongjava.tio.utils.resp.RespVo;

import lombok.extern.slf4j.Slf4j;

@RequestPath("/test/json")
@Slf4j
public class TestJsonController {

  @RequestPath("/responseJsonRespVo")
  public HttpResponse responseJsonResps(HttpRequest request) {
    User user = User.builder().loginName("Ping E Lee").nick("李通").ip("127.0.0.1").build();
    return Resps.json(request, RespVo.ok(user));
  }
}
```

**Method `responseJsonResps`**:

- `@RequestPath("/responseJsonRespVo")`: 方法注解，指定了此方法处理的具体请求路径。当 HTTP 请求发送到 `/test/json/responseJsonRespVo` 时，此方法将被调用。
- 方法内部创建了一个 `User` 对象，使用了 Builder 模式设置了其属性。
- 使用 `Resps.json(request, RespVo.ok(user))` 生成了一个包含 JSON 格式用户数据的 `HttpResponse` 对象。`RespVo.ok(user)` 封装了 `User` 对象，并可能添加了一些额外的响应信息，例如成功状态，这是一种标准的响应对象格式。
- 最后，方法返回这个 `HttpResponse` 对象。
  返回数据如下

```
{
    "data": "数据部分",
    "ok": true
}
```

### 6.3.接收文件

#### 6.3.1.接收文件

接受文件在 Controller 的方法中添加 UploadFile 类型的参数,在发送 http 请求时,请求的 key 是 UploadFile 类型的参数名.通常是 file,下面的案例是 uploadFile

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

### 5.10 返回字符串

```
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.http.server.annotation.RequestPath;

@RequestPath("/test/string")
public class TestStringController {

@RequestPath()
  public String index() {
    return "index";
  }
}
```

这段代码定义了一个使用 tio-boot 框架的 HTTP 控制器，专门用于处理 /test/string 路径下的 Web 请求，并返回一个字符串。

- `@RequestPath()`: 方法注解，指定了此方法处理的具体请求路径。结合类注解，当 HTTP 请求发送到 `/test/string` 时，此方法将被调用。
- 方法不接收任何参数，这意味着它响应的是不需要任何输入的请求。
- 方法返回一个字符串 `"index"`。在 tio-boot 框架中，会直接将字符串 `"index"` 作为响应内容发送给客户端不会查找名为 `"index"` 的视图模板，并用该模板生成 HTTP 响应。

### 6.11.返回文本数据

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

### 6.12.返回网页

#### 6.12.1.无标签网页

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

#### 6.12.2.有标签网页

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

### 6.13 获取请求字节

```
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.server.annotation.RequestPath;

@RequestPath("/test/bytes")
public class TestBytesController {

  @RequestPath
  public String index(HttpRequest reuqest) {
    byte[] body = reuqest.getBody();
    return "index";
  }
}
```

**Method `index`**:

- `@RequestPath`: 方法注解，没有提供具体的路径值，这意味着它将使用类级别的路径 `/test/bytes`。因此，当 HTTP 请求发送到 `/test/bytes` 时，此方法将被调用。
- 方法接收一个 `HttpRequest` 对象作为参数，代表接收到的 HTTP 请求。
- `byte[] body = reuqest.getBody();`: 从 HTTP 请求中获取字节数组格式的请求体。
- 方法返回一个字符串 `"index"`。这个字符串会会作为 Response 返回。

这对深度学习框架很有用,可以它获取客户端发送的 NumPy 的字节数据

### 6.14 返回图片

#### 返回验证码

```
package com.litongjava.tio.boot.hello.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;
import com.litongjava.tio.utils.resp.RespVo;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;

@RequestPath("/captcha")
public class CaptchaController {

  @RequestPath("")
  public HttpResponse captcha(HttpRequest request) {
    // 创建线性验证码
    LineCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 100);

    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      // 获取验证码图片，并写入到输出流
      captcha.write(outputStream);

      // 将输出流转换为字节数组
      byte[] captchaBytes = outputStream.toByteArray();

      // 使用 Resps 工具类创建一个包含验证码图片的响应
      HttpResponse response = Resps.bytesWithContentType(request, captchaBytes, "image/jpeg");

      // 返回响应
      return response;
    } catch (IOException e) {
      e.printStackTrace();
      return Resps.json(request, RespVo.fail("Error generating captcha"));
    }
  }
}
```

这段代码定义了一个 Java 控制器类，用于生成并返回一个图形验证码。它利用了 `hutool` 库中的 `CaptchaUtil` 工具和 `tio-boot` 网络框架。以下是对代码的详细解释：

1. **包和导入**:

   - `package com.litongjava.tio.boot.hello.controller;`: 定义了类所在的包。
   - 导入了需要用到的类和接口，包括处理 HTTP 请求和响应的类，验证码生成工具类等。

2. **类和注解**:

   - `@RequestPath("/captcha")`: 类级别的注解，设置请求的路径。在这个例子中，类处理以 `/captcha` 开头的请求。
   - `public class CaptchaController`: 定义了一个名为 `CaptchaController` 的公共类。

3. **方法和路由**:

   - `@RequestPath("")`: 方法级别的注解，指定当访问 `/captcha` 路径时，调用此方法。
   - `public HttpResponse captcha(HttpRequest request)`: 定义了一个处理 HTTP 请求的方法，接收一个 `HttpRequest` 对象。

4. **生成验证码**:
   - `LineCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 100)`: 使用 `hutool` 的 `CaptchaUtil` 生成一个线性（LineCaptcha）验证码，尺寸为 200x100 像素。
5. **创建和返回响应**:

   - `try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream())`: 使用 `try-with-resources` 语句创建一个 `ByteArrayOutputStream` 实例，确保流在操作结束后会被正确关闭。
   - `captcha.write(outputStream)`: 将验证码图片写入到输出流。
   - `byte[] captchaBytes = outputStream.toByteArray()`: 将输出流转换为字节数组。
   - `HttpResponse response = Resps.bytesWithContentType(request, captchaBytes, "image/jpeg")`: 使用 `Resps.bytesWithContentType` 方法创建一个新的 `HttpResponse`，其中包含验证码图片数据，设置内容类型为“image/jpeg”。

6. **异常处理**:
   - `catch (IOException e)`: 捕获并处理可能在验证码生成或响应创建过程中出现的 IO 异常。
   - `e.printStackTrace()`: 打印错误堆栈信息。
   - `return Resps.json(request, RespVo.fail("Error generating captcha"))`: 发生异常时返回一个包含错误信息的 JSON 响应。

总结：这个控制器的作用是生成一个图形验证码，并将它作为 HTTP 响应以图片的形式返回给客户端。如果在生成验证码的过程中出现问题，它会返回一个包含错误信息的 JSON 响应。

#### 返回二维码

添加依赖

```
<dependency>
  <groupId>com.google.zxing</groupId>
  <artifactId>core</artifactId>
  <version>3.4.1</version> <!-- 使用最新版本 -->
</dependency>
```

```
package com.litongjava.tio.boot.hello.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;
import com.litongjava.tio.utils.resp.RespVo;

import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.qrcode.QrCodeUtil;

@RequestPath("/qr")
public class QrController {

  @RequestPath("")
  public HttpResponse qr(HttpRequest request, String content) {
    // 获取要生成的二维码内容
    if (StrUtil.isBlank(content)) {
      return Resps.json(request, RespVo.fail("No content provided for QR code"));
    }

    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      // 生成二维码图片，并写入到输出流
      QrCodeUtil.generate(content, 300, 300, "png", outputStream);

      // 将输出流转换为字节数组
      byte[] qrCodeBytes = outputStream.toByteArray();

      // 使用 Resps 工具类创建一个包含二维码图片的响应
      HttpResponse response = Resps.bytesWithContentType(request, qrCodeBytes, "image/png");

      // 返回响应
      return response;
    } catch (IOException e) {
      e.printStackTrace();
      return Resps.json(request, RespVo.fail("Error generating QR code"));
    }
  }
}

```

测试访问 http://localhost/qr?content=tio-boot  
这段代码是一个 Java 控制器类，用于生成并返回一个二维码图片。它是基于 `hutool` 库的 `QrCodeUtil` 工具和 `tio` 网络框架实现的。以下是对代码的逐行解释：

1. **类和注解**:

   - `@RequestPath("/qr")`: 这是一个类级别的注解，用于设置请求的路径。在这个例子中，它将处理以 `/qr` 开头的请求。
   - `public class QrController`: 定义了一个名为 `QrController` 的公共类。

2. **方法和路由**:

   - `@RequestPath("")`: 方法级别的注解，指定当访问 `/qr` 路径时，将调用此方法。
   - `public HttpResponse qr(HttpRequest request, String content)`: 定义了一个处理 HTTP 请求的方法。它接收两个参数：一个 `HttpRequest` 对象和一个 `String` 类型的 `content`。

3. **生成二维码**:

   - `if (StrUtil.isBlank(content))`: 检查传入的 `content` 字符串是否为空。如果为空，则返回一个包含错误信息的 JSON 响应。
   - `try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream())`: 使用 `try-with-resources` 语句创建一个 `ByteArrayOutputStream` 实例。这确保了流在操作结束后会被正确关闭。
   - `QrCodeUtil.generate(content, 300, 300, "png", outputStream)`: 使用 `hutool` 的 `QrCodeUtil` 生成一个尺寸为 300x300 像素的 PNG 格式二维码，并写入到 `outputStream`。

4. **创建响应**:

   - `byte[] qrCodeBytes = outputStream.toByteArray()`: 将输出流转换为字节数组。
   - `HttpResponse response = Resps.bytesWithContentType(request, qrCodeBytes, "image/png")`: 使用 `Resps.bytesWithContentType` 方法创建一个新的 `HttpResponse`，其中包含二维码图片数据和设置为“image/png”的内容类型。

5. **异常处理**:

   - `catch (IOException e)`: 捕获并处理可能在二维码生成或响应创建过程中出现的 IO 异常。
   - `e.printStackTrace()`: 打印错误堆栈信息。
   - `return Resps.json(request, RespVo.fail("Error generating QR code"))`: 发生异常时返回一个包含错误信息的 JSON 响应。

6. **请求示例**:
   - 访问 `http://localhost/qr?content=tio-boot` 将会触发这个控制器方法，`content=tio-boot` 表示生成包含文本 “tio-boot” 的二维码。

这个控制器的作用是接收一个文本内容，并将其转换为二维码图片，然后将这个图片作为 HTTP 响应返回给客户端。如果在生成二维码的过程中出现问题，它会返回一个包含错误信息的 JSON 响应。

### 6.15.Session

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

### 14 Cookie

```
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.tio.http.common.Cookie;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;

@RequestPath("/test/cookie")
public class TestCookieController {

  @RequestPath("/index")
  public String index(HttpRequest request) {
    Cookie cookie = request.getCookie("access-token");
    if (cookie != null) {
      String accessToken = cookie.getValue();
      return accessToken;
    }
    return null;
  }

  @RequestPath("/set-cookie")
  public HttpResponse setCookie(HttpRequest request) {

    HttpResponse response = Resps.txt(request, "set-cookit");
    Cookie cookie = new Cookie(null, "access-token", "token-value", null);
    response.addCookie(cookie);
    return response;
  }

}
```

Cookie 构建方法

```
  /**
   * 创建一个 Cookie
   * @param domain  cookie的受控域
   * @param value   名称
   * @param value   值
   * @param maxAge  失效时间,单位秒
   * @return Cookie 对象
   */
  public Cookie(String domain, String name, String value, Long maxAge) {
    setName(name);
    setValue(value);
    setPath("/");
    setDomain(domain);
    setMaxAge(maxAge);
    setHttpOnly(false);
  }
```

这段代码定义了一个使用 tio-boot 框架的 HTTP 控制器，用于处理 `/test/cookie` 路径下的 Web 请求，并涉及 HTTP Cookie 的读取和设置。以下是对代码的部分解释：

1. **Method `index`**:

   ```
   - 当 HTTP 请求发送到 `/test/cookie/index` 时，此方法将被调用。
   - 方法从 HTTP 请求中提取名为 `"access-token"` 的 Cookie。
   - 如果 Cookie 存在，方法返回 Cookie 的值；否则返回 `null`。

   ```

2. **Method `setCookie`**:

   - 当 HTTP 请求发送到 `/test/cookie/set-cookie` 时，此方法将被调用。
   - 创建一个文本响应 `"set-cookie"`。
   - 构造一个新的 Cookie 对象，名称为 `"access-token"`，值为 `"token-value"`，并将其添加到响应中。
   - 返回包含新设置的 Cookie 的响应对象。

3. **Cookie Constructor**:
   - `Cookie(String domain, String name, String value, Long maxAge)`: 构造器用于创建一个新的 Cookie 对象。参数包括域名、名称、值和最大有效期。
   - 在 `setCookie` 方法中，创建的 Cookie 没有指定域名和最大有效期，这意味着它将被视为会话 Cookie，并且只在客户端与服务器的会话期间有效。

总结：`TestCookieController` 类是一个 tio-boot HTTP 控制器，它包含两个方法，一个用于读取请求中的特定 Cookie，另一个用于设置新的 Cookie 并将其发送回客户端。这使得该控制器可以在客户端和服务器之间有效地管理 Cookie 数据。

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

如果使用了 Hotswap-classloader 需要在启动类中添加 SwapClassPrefix,添加之后才可以支持 切面代理类的 热加载,否则会出现异常

```

HotSwapResolver.addHotSwapClassPrefix("com.litongjava.jfinal");

```

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
config.add("/\*\*", GlobalInteceptor.class);
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

/\*\*

- 用于群聊的 group id
  \*/
  public static final String GROUP_ID = "showcase-websocket";
  public static final String CHARSET = "utf-8";

/\*\*

- 握手时走这个方法，业务可以在这里获取 cookie，request 参数等
  \*/
  @Override
  public HttpResponse handshake(HttpRequest request, HttpResponse httpResponse, ChannelContext channelContext)
  throws Exception {
  String clientip = request.getClientIp();
  String myname = request.getParam("name");

  Tio.bindUser(channelContext, myname);

// channelContext.setUserid(myname);
log.info("收到来自{}的 ws 握手包\r\n{}", clientip, request.toString());
return httpResponse;
}

/\*\*

- @param httpRequest
- @param httpResponse
- @param channelContext
- @throws Exception
- @author tanyaowu
  \*/
  @Override
  public void onAfterHandshaked(HttpRequest httpRequest, HttpResponse httpResponse, ChannelContext channelContext)
  throws Exception {
  // 绑定到群组，后面会有群发
  Tio.bindGroup(channelContext, GROUP_ID);
  int count = Tio.getAll(channelContext.tioConfig).getObj().size();

  String msg = "{name:'admin',message:'" + channelContext.userid + " 进来了，共【" + count + "】人在线" + "'}";
  // 用 tio-websocket，服务器发送到客户端的 Packet 都是 WsResponse
  WsResponse wsResponse = WsResponse.fromText(msg, CHARSET);
  // 群发
  Tio.sendToGroup(channelContext.tioConfig, GROUP_ID, wsResponse);

}

/\*\*

- 字节消息（binaryType = arraybuffer）过来后会走这个方法
  \*/
  @Override
  public Object onBytes(WsRequest wsRequest, byte[] bytes, ChannelContext channelContext) throws Exception {
  return null;
  }

/\*\*

- 当客户端发 close flag 时，会走这个方法
  \*/
  @Override
  public Object onClose(WsRequest wsRequest, byte[] bytes, ChannelContext channelContext) throws Exception {
  Tio.remove(channelContext, "receive close flag");
  return null;
  }

/\*

- 字符消息（binaryType = blob）过来后会走这个方法
  \*/
  @Override
  public Object onText(WsRequest wsRequest, String text, ChannelContext channelContext) throws Exception {
  WsSessionContext wsSessionContext = (WsSessionContext) channelContext.get();
  String path = wsSessionContext.getHandshakeRequest().getRequestLine().path;
  log.info("path:{}", path);

  // log.info("收到 ws 消息:{}", text);

  if (Objects.equals("心跳内容", text)) {
  return null;
  }
  // channelContext.getToken()
  // String msg = channelContext.getClientNode().toString() + " 说：" + text;
  String msg = "{name:'" + channelContext.userid + "',message:'" + text + "'}";
  // 用 tio-websocket，服务器发送到客户端的 Packet 都是 WsResponse
  WsResponse wsResponse = WsResponse.fromText(msg, CHARSET);
  // 群发
  Tio.sendToGroup(channelContext.tioConfig, GROUP_ID, wsResponse);

  // 返回值是要发送给客户端的内容，一般都是返回 null,返回为 null,handler 不会发送数据
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

## 12.JWT

```
package com.litongjava.tio.boot.hello.controller;

import cn.hutool.jwt.JWTUtil;
import com.litongjava.tio.http.common.HeaderName;
import com.litongjava.tio.http.common.HeaderValue;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.common.HttpResponse;
import com.litongjava.tio.http.server.annotation.RequestPath;
import com.litongjava.tio.http.server.util.Resps;
import com.litongjava.tio.utils.resp.RespVo;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * token永不过期
 */
@RequestPath("/auth")
public class AuthController {

  // 使用HmacSHA256签名算法的密钥
  byte[] key = "litongjava".getBytes();
  // 用于存储tokens的Map
  private static Map<String, String> tokenStore = new HashMap<>();

  @RequestPath("/login")
  public HttpResponse login(HttpRequest request, String username, String password) {
    if (isValidUser(username, password)) {
      // 生成JWT token
      String accessToken = createJWTToken(username, key);

      // 将token存储到Map中
      tokenStore.put(username, accessToken);

      // 创建HttpResponse，并添加token作为头部
      HeaderName headerName = HeaderName.from("Authorization");
      HeaderValue headerValue = HeaderValue.from("Bearer " + accessToken);

      HttpResponse httpResponse = Resps.json(request, RespVo.ok());
      httpResponse.addHeader(headerName, headerValue);
      return httpResponse;
    } else {
      return Resps.json(request, RespVo.fail("Invalid username or password"));
    }
  }

  @RequestPath("/verifyToken")
  public RespVo verifyToken(String token) {
    // 验证token是否有效
    if (isValidToken(token)) {
      return RespVo.ok();
    } else {
      return RespVo.fail("Token is invalid or expired");
    }
  }

  private boolean isValidUser(String username, String password) {
    // 在这里实现您的用户验证逻辑
    // 暂时返回true模拟验证成功
    return true;
  }

  public static String createJWTToken(String username, byte[] key) {
    // 载荷，可根据需要添加更多数据
    Map<String, Object> payload = new HashMap<>();
    payload.put("username", username);

    // 设置过期时间，例如1小时后
    long expirationMillis = System.currentTimeMillis() + 3600000; // 1小时 = 3600000毫秒
    Date expiration = new Date(expirationMillis);
    payload.put("exp", expiration.getTime() / 1000); // JWT通常使用秒为单位的时间戳

    // 生成JWT token
    return JWTUtil.createToken(payload, key);
  }

  private boolean isValidToken(String token) {
    // 使用相同的密钥验证token
    return JWTUtil.verify(token, key);
  }
}

```

代码展示了一个用于身份验证和令牌管理的 `AuthController` 类，它是使用 tio-boot 框架编写的。这个类提供了用户登录和验证令牌的功能。下面是对代码的关键点的解释：

1. **类定义和成员变量**:

   - 类被注解为 `@RequestPath("/auth")`，这意味着它处理以 `/auth` 开头的 HTTP 请求路径。
   - `key` 是用于 JWT 签名的密钥，这里是一个硬编码的字符串 `"litongjava"`。在实际应用中，这个密钥应该是安全生成和存储的。
   - `tokenStore` 是一个用于存储生成的令牌的静态映射（Map）。

2. **`login` 方法**:

   - 当用户尝试登录时，此方法被调用。
   - 它首先调用 `isValidUser` 方法来验证用户名和密码。
   - 如果验证成功，它调用 `createJWTToken` 方法生成 JWT 令牌。
   - 然后，生成的令牌被存储在 `tokenStore` 中，并以 `Authorization` 头的形式添加到响应中。
   - 最后，方法返回一个 `HttpResponse` 对象，该对象包含 JSON 格式的响应。

3. **`verifyToken` 方法**:

   - 此方法用于验证传入的令牌是否有效。
   - 它调用 `isValidToken` 方法来检查令牌。
   - 根据令牌的有效性，它返回一个包含相应消息的 `RespVo` 对象。

4. **`createJWTToken` 方法**:

   - 这是一个静态辅助方法，用于生成带有用户信息和过期时间的 JWT 令牌。
   - 它将用户名作为载荷的一部分，并计算一个小时后的时间作为令牌的过期时间。
   - 这个方法使用 `JWTUtil.createToken` 方法生成令牌。

5. **`isValidToken` 方法**:

   - 用于验证给定令牌的有效性。
   - 它使用相同的密钥 `key` 来验证令牌。

6. **安全性和实用性的考虑**:
   - 密钥应该安全生成和存储，不应硬编码在代码中。
   - 在生产环境中，令牌应该有一个合理的过期时间，并且应该提供令牌刷新的机制。
   - 用户验证逻辑（`isValidUser` 方法）应该实现实际的验证过程，例如检查数据库中的用户凭据。
   - 令牌存储（`tokenStore`）应考虑使用更安全和可扩展的存储解决方案，如数据库或缓存系统。在内存中存储令牌可能不适合大规模或生产环境。

## 13.MQTT

## 14.Mica-mqtt

```
<mica-mqtt.version>2.2.6</mica-mqtt.version>
<dependency>
  <groupId>net.dreamlu</groupId>
  <artifactId>mica-mqtt-client</artifactId>
  <version>${mica-mqtt.version}</version>
</dependency>
```

```
package com.litongjava.mica.mqtt.client.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.tio.core.ChannelContext;

import net.dreamlu.iot.mqtt.core.client.IMqttClientConnectListener;

/**
 * Client Connection Status Listening
 */
public class MqttClientConnectListener implements IMqttClientConnectListener {
  private static final Logger logger = LoggerFactory.getLogger(MqttClientConnectListener.class);

  @Override
  public void onConnected(ChannelContext context, boolean isReconnect) {
    if (isReconnect) {
      logger.info("Reconnect mqtt server reconnected successfully");
    } else {
      logger.info("Connection to mqtt server successful");
    }
  }

  @Override
  public void onDisconnect(ChannelContext channelContext, Throwable throwable, String remark, boolean isRemove) {
    logger.error("mqtt link broken remark:{} isRemove:{}", remark, isRemove, throwable);
  }

}
```

```
package com.litongjava.mica.mqtt.client.config;

import java.nio.charset.StandardCharsets;
import java.util.Timer;
import java.util.TimerTask;

import org.tio.core.ChannelContext;

import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;
import net.dreamlu.iot.mqtt.codec.MqttPublishMessage;
import net.dreamlu.iot.mqtt.codec.MqttQoS;
import net.dreamlu.iot.mqtt.core.client.IMqttClientMessageListener;
import net.dreamlu.iot.mqtt.core.client.MqttClient;
import net.dreamlu.iot.mqtt.core.client.MqttClientCreator;

@Configuration
@Slf4j
public class MicaMQTTClientConfig {

  @Bean
  public MqttClient MqttClient() {
    // 初始化 mqtt 客户端
    MqttClientCreator creator = MqttClient.create().ip("192.168.3.9").port(1883).username("mica").password("mica");
    // 连接监听
    MqttClient client = creator.connectListener(new MqttClientConnectListener()).willMessage(builder -> {
      builder.topic("/test/offline").messageText("down").retain(false).qos(MqttQoS.AT_MOST_ONCE); // 遗嘱消息
    })
        // 同步连接，也可以使用 connect() 异步（可以避免 broker 没启动照成启动卡住），但是下面的订阅和发布可能还没连接成功。
        .connectSync();

    // 订阅
    client.subQos0("/test/123", new IMqttClientMessageListener() {
      @Override
      public void onSubscribed(ChannelContext context, String topicFilter, MqttQoS mqttQoS) {
        // 订阅成功之后触发，可在此处做一些业务逻辑
        log.info("topicFilter:{} MqttQoS:{} Subscription successful", topicFilter, mqttQoS);
      }

      @Override
      public void onMessage(ChannelContext context, String topic, MqttPublishMessage message, byte[] payload) {
        log.info(topic + '\t' + new String(payload, StandardCharsets.UTF_8));
      }
    });

    // 发送
    Timer timer = new Timer();
    timer.schedule(new TimerTask() {
      @Override
      public void run() {
        client.publish("/test/client", "hello this is mica client".getBytes(StandardCharsets.UTF_8));
      }
    }, 1000, 2000);

    return client;
  }
}
```

这段代码主要涉及两个 Java 类，它们是用于配置和实现 MQTT 客户端的功能。让我们逐个进行解释：

#### MqttClientConnectListener 类

这个类实现了 `IMqttClientConnectListener` 接口，用于监听 MQTT 客户端的连接状态。

- **方法**:
  - `onConnected`: 当客户端成功连接到 MQTT 服务器时调用。如果是重新连接（`isReconnect` 为 `true`），则记录“重连成功”的消息；否则，记录“连接成功”的消息。
  - `onDisconnect`: 当客户端与 MQTT 服务器的连接断开时调用。记录断开连接的详细信息和错误（如果有）。

#### MicaMQTTClientConfig 类

这个类使用了 JFinal 的 `@Configuration` 和 `@Bean` 注解，表明它是一个配置类，用于初始化和配置 MQTT 客户端。

- **方法**:
  - `MqttClient`: 定义了一个 `MqttClient` Bean。在这个方法中，执行了以下操作：
    - **初始化 MQTT 客户端**：使用 `MqttClient.create()` 创建一个 MQTT 客户端实例，并设置了服务器的 IP 地址、端口、用户名和密码。
    - **设置连接监听器**：添加了前面定义的 `MqttClientConnectListener` 实例作为连接监听器。
    - **配置遗嘱消息**：设置了客户端的遗嘱消息，当客户端意外断开连接时，服务器将会发布这条消息到指定的主题（`/test/offline`）。
    - **同步连接**：调用 `connectSync()` 方法来同步连接到 MQTT 服务器。
    - **订阅主题**：订阅了 `/test/123` 主题，并定义了如何处理订阅成功事件和收到的消息。
    - **定时发送消息**：使用 `Timer` 定时向 `/test/client` 主题发送消息。

这段代码通过 JFinal AOP 提供的注解方式配置了一个 MQTT 客户端。客户端在启动时会自动连接到 MQTT 服务器，订阅指定的主题，并定期向另一个主题发送消息。同时，它通过实现连接监听器来记录连接和断开事件。这样的设置在 IoT（物联网）应用中很常见，用于设备与 MQTT 服务器之间的通信。

## 14.tio server

整合 tio-server 启动一个 tcp 服务器

```
package com.litongjava.tio.boot.hello.tioserver;
import com.litongjava.tio.core.intf.Packet;

/**
* socket消息包
*/
@SuppressWarnings("serial")
public class DemoPacket extends Packet {
  private byte[] body;

  public byte[] getBody() {
    return body;
  }

  public void setBody(byte[] body) {
    this.body = body;
  }
}
```

```
package com.litongjava.tio.boot.hello.tioserver;
import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.core.Tio;
import com.litongjava.tio.core.intf.Packet;
import com.litongjava.tio.server.intf.ServerAioListener;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DemoTioServerListener implements ServerAioListener {
  public void onAfterConnected(ChannelContext channelContext, boolean isConnected, boolean isReconnect) throws Exception {
  }

  public void onAfterDecoded(ChannelContext channelContext, Packet packet, int packetSize) throws Exception {
  }

  public void onAfterReceivedBytes(ChannelContext channelContext, int receivedBytes) throws Exception {
  }

  public void onAfterSent(ChannelContext channelContext, Packet packet, boolean isSentSuccess) throws Exception {
  }

  public void onAfterHandled(ChannelContext channelContext, Packet packet, long cost) throws Exception {
  }

  /**
   * 连接关闭前触发本方法
   *
   * @param channelContext        the channelcontext
   * @param throwable the throwable 有可能为空
   * @param remark    the remark 有可能为空
   * @param isRemove
   * @throws Exception
   */

  public void onBeforeClose(ChannelContext channelContext, Throwable throwable, String remark, boolean isRemove) throws Exception {
    log.info("关闭后清除认证信息");
    Tio.unbindToken(channelContext);
  }

  /**
   * @param channelContext
   * @param interval              已经多久没有收发消息了，单位：毫秒
   * @param heartbeatTimeoutCount 心跳超时次数，第一次超时此值是1，以此类推。此值被保存在：channelContext.stat.heartbeatTimeoutCount
   * @return 返回true，那么服务器则不关闭此连接；返回false，服务器将按心跳超时关闭该连接
   */
  public boolean onHeartbeatTimeout(ChannelContext channelContext, Long interval, int heartbeatTimeoutCount) {
    log.info("心跳超时");
    Tio.unbindToken(channelContext);
    return false;
  }
}
```

```
package com.litongjava.tio.boot.hello.tioserver;

import java.nio.ByteBuffer;

import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.core.Tio;
import com.litongjava.tio.core.TioConfig;
import com.litongjava.tio.core.exception.TioDecodeException;
import com.litongjava.tio.core.intf.Packet;
import com.litongjava.tio.server.intf.ServerAioHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DemoTioServerHandler implements ServerAioHandler {

  public Packet decode(ByteBuffer buffer, int limit, int position, int readableLength, ChannelContext channelContext)
      throws TioDecodeException {
    log.info("buffer:{}", buffer);
    // 获取由ByteBuffer支持的字节数组
    byte[] bytes = new byte[readableLength];
    buffer.get(bytes);
    // 封装为ShowcasePacket
    DemoPacket imPackage = new DemoPacket();
    imPackage.setBody(bytes);
    return imPackage;
  }

  public ByteBuffer encode(Packet packet, TioConfig tioConfig, ChannelContext channelContext) {
    DemoPacket helloPacket = (DemoPacket) packet;
    byte[] body = helloPacket.getBody();
    // ByteBuffer的总长度是消息体长度
    int bodyLength = body.length;
    log.info("encode:{}", bodyLength);

    // 创建一个新的ByteBuffer
    ByteBuffer buffer = ByteBuffer.allocate(bodyLength);
    // 设置字节序
    buffer.order(tioConfig.getByteOrder());
    // 消息消息体
    buffer.put(body);
    return buffer;
  }

  public void handler(Packet packet, ChannelContext channelContext) throws Exception {
    DemoPacket packingPacket = (DemoPacket) packet;
    byte[] body = packingPacket.getBody();
    if (body == null) {
      return;
    }
    String string = new String(body);
    log.info("received:{}", string);
    // 响应数据
    String sendMessage = "收到了你的消息，你的消息是:" + string;
    log.info("sendMessage:{}", sendMessage);
    byte[] bytes = sendMessage.getBytes();
    // 响应包
    DemoPacket responsePacket = new DemoPacket();
    responsePacket.setBody(bytes);
    // 响应消息
    log.info("开始响应");
    Tio.send(channelContext, responsePacket);
    log.info("响应完成");
  }
}
```

```
package com.litongjava.tio.boot.hello.tioserver;

import java.io.IOException;

import com.litongjava.tio.server.ServerTioConfig;
import com.litongjava.tio.server.TioServer;
import com.litongjava.tio.server.intf.ServerAioHandler;
import com.litongjava.tio.server.intf.ServerAioListener;

public class DemoTioServer {
  // handler, 包括编码、解码、消息处理
  ServerAioHandler serverHandler = new DemoTioServerHandler();
  // 事件监听器，可以为null，但建议自己实现该接口，可以参考showcase了解些接口
  ServerAioListener serverListener = new DemoTioServerListener();
  // 配置对象
  ServerTioConfig tioServerConfig = new ServerTioConfig(serverHandler, serverListener);

  /**
   * 启动程序入口
   */
  public void start() throws IOException {

    // 设置心跳,-1 取消心跳
    tioServerConfig.setHeartbeatTimeout(-1);
    // TioServer对象
    TioServer tioServer = new TioServer(tioServerConfig);

    // 启动服务
    tioServer.start(null, 6789);
  }
}
```

```
package com.litongjava.tio.boot.hello.config;

import java.io.IOException;

import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.litongjava.tio.boot.hello.tioserver.DemoTioServer;

@Configuration
public class TioServerConfig {

  @Bean
  public DemoTioServer demoTioServer() {
    DemoTioServer demoTioServer = new DemoTioServer();
    try {
      demoTioServer.start();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return demoTioServer;
  }

}
```

上面的代码是一个使用 Java TIO 网络框架实现的简单服务器应用的示例。让我们逐部分进行解释：

#### `DemoPacket` 类（数据包定义）

- **目的**：为服务器定义一个自定义的数据包结构。在网络通信中，数据包是数据的格式化单位。
- **主要元素**：
  - 继承自 Tio 框架的 `Packet` 类。
  - 包含一个 `byte[] body` 用于存储数据载荷。

#### `DemoTioServerListener` 类（服务器事件监听器）

- **目的**：实现 `ServerAioListener` 接口，定义各种服务器事件的行为。
- **关键功能**：
  - `onAfterConnected`、`onAfterDecoded` 等：在特定事件（如连接或解码数据包）后触发的方法。
  - `onBeforeClose`：在关闭连接之前执行的操作，例如解绑令牌。
  - `onHeartbeatTimeout`：管理超时的连接。

#### `DemoTioServerHandler` 类（服务器处理器）

- **目的**：实现 `ServerAioHandler` 接口，处理数据包的编码、解码和处理。
- **关键功能**：
  - `decode`：将传入的原始数据转换为 `DemoPacket` 对象。
  - `encode`：将 `DemoPacket` 对象转换为传输的原始数据。
  - `handler`：处理接收到的数据包并发送响应。

#### `DemoTioServer` 类（服务器配置和启动）

- **目的**：设置并启动 Tio 服务器。
- **主要元素**：
  - 配置心跳超时、服务器处理器和监听器。
  - 在指定端口（`6789`）上启动服务器。

#### `TioServerConfig` 类（tio-boot 配置）

- **包名**：`com.litongjava.tio.boot.hello.config`
- **目的**：使用 tio-boot 框架的注解来配置并启动 `DemoTioServer`。
- **主要元素**：
  - 用 `@Configuration` 注解标记，表示这是一个 tio-boot 配置类。
  - 包含一个用 `@Bean` 注解的方法 `demoTioServer`，该方法启动 `DemoTioServer`。

#### 整体流程

1. **数据包定义**：自定义数据包（`DemoPacket`）来携带数据。
2. **事件处理**：`DemoTioServerListener` 监听服务器事件，如连接、断开连接和心跳。
3. **数据处理**：`DemoTioServerHandler` 处理数据包的编码和解码，并处理传入的消息。
4. **服务器设置和启动**：`DemoTioServer` 配置并启动 Tio 服务器，使用定义的处理器和监听器。
5. **tio-boot 集成**：`TioServerConfig` 使用 tio-boot 来管理 `DemoTioServer` 的生命周期和配置。

这段代码演示了 TIO 服务器的基本但完整的设置，包括数据包处理、事件监听、消息处理，以及与 tio-boot 框架的集成，便于管理和配置。

## 15.Caffine

### Caffeine 简介

#### 什么是 Caffeine

Caffeine 是一个高性能的 Java 缓存库，提供了近乎最优的命中率。它是一个完全在内存中的缓存，可以用作本地缓存或与其他缓存解决方案结合使用。Caffeine 的主要特点包括：

- 快速的读写操作
- 基于大小、时间和引用的驱逐策略
- 统计和监听功能
- 易用的 API

### tio-boot 整合 Caffeine

1. 添加依赖：首先，需要在项目的`pom.xml`中添加 Caffeine 的依赖项。tio-boot 已经内置了 caffeine-2.9.3 依赖

```xml
<dependency>
 <groupId>com.github.ben-manes.caffeine</groupId>
 <artifactId>caffeine</artifactId>
 <version>2.9.3</version>
</dependency>
```

2. 配置缓存：在你的 Java 配置类中，你可以创建一个 Caffeine 缓存实例。例如：

```java
package com.litongjava.tio.boot.hello.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CaffeineCacheConfig {
  @Bean
  public Cache<String, Object> caffeineCache() {
    return Caffeine.newBuilder()
      .maximumSize(10000)
      .expireAfterWrite(5, TimeUnit.MINUTES)
      .build();
  }
}

```

3. 使用缓存：一旦缓存被配置，你就可以在应用中使用它来存储和检索数据。

```java
package com.litongjava.tio.boot.hello.controller;

import com.github.benmanes.caffeine.cache.Cache;
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.server.annotation.RequestPath;
import lombok.extern.slf4j.Slf4j;

@RequestPath("/caffeine")
@Slf4j
public class CaffeineTestController {
  @RequestPath("/test")
  public Object test(HttpRequest request) {
    Cache<String, Object> cache = Aop.get(Cache.class);
    Object value = cache.getIfPresent("key");
    if (value == null) {
      log.info("计算value");
      cache.put("key", "11111");
    }

    return value;
  }
}
```

访问测试:
http://localhost//caffeine/test

## 16.redis

tio-boot-整合 redis

### 16.1.redis 简介

Redis 是一个开源的内存数据结构存储系统，可以用作数据库、缓存和消息中间件。它支持多种数据结构，如字符串、哈希、列表、集合、有序集合等，并提供了丰富的操作命令。在 Java 开发中，使用 Redis 可以提高应用的性能和可扩展性。

### 16.2.使用 Jedis 整合 Redis

添加依赖

```
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>3.6.3</version>
</dependency>

```

添加配置类

```
package com.litongjava.tio.boot.hello.config;

import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import redis.clients.jedis.Jedis;

@Configuration
public class JedisConfig {

  @Bean(destroyMethod = "close")
  public Jedis jedis() {
    //得到Jedis对象
    Jedis jedis = new Jedis("localhost", 6379);
    //jedis.auth();
    //向redis中添加一个字符串,测试中文乱码
    jedis.set("name", "litong");
    //获取redis中的字符串
    String string = jedis.get("name");
    System.out.println(string);
    return jedis;
  }
}
```

这段代码是一个 Java 配置类，用于配置和初始化一个 Jedis 客户端连接。下面是对这个类中每个部分的解释：

#### 导入的类

- `com.litongjava.jfinal.aop.annotation.Bean` 和 `com.litongjava.jfinal.aop.annotation.Configuration`：这些是 JFinal Aop 框架中的注解，用于定义配置类和 Bean。

#### 类定义

- `@Configuration`：这个注解标记了类 `JedisConfig` 作为配置类。在 JFinal 框架中，配置类用于定义和配置应用程序的不同部分，如数据源、服务等。

#### Jedis 配置方法

- `@Bean(destroyMethod = "close")`：这个注解定义了一个 Bean，即 Jedis 实例。`destroyMethod = "close"` 指定当应用程序关闭或者该 Bean 不再需要时，应该调用 Jedis 的 `close()` 方法来关闭连接。
- `public Jedis jedis()`：这个方法配置并返回一个 Jedis 实例。该方法的主体执行以下操作：
  - 创建一个指向本地主机（localhost）在端口 6379（Redis 的默认端口）的新 Jedis 实例。这假设 Redis 服务器运行在本地并监听默认端口。
  - `jedis.set("name", "litong")`：这行代码向 Redis 中添加一个键值对，键是 `"name"`，值是 `"litong"`。
  - `String string = jedis.get("name")`：这行代码从 Redis 中检索键 `"name"` 对应的值，并将其存储在局部变量 `string` 中。
  - `System.out.println(string)`：打印检索到的值（"litong"）到控制台。
  - 返回创建的 Jedis 实例。

#### 注意事项

- 此配置类在创建 Jedis 实例时执行了一个 Redis 操作（设置并获取一个键值对）。通常，这种直接在配置方法中执行业务逻辑（如与 Redis 交互）并不是最佳实践。配置类应该专注于设置和配置组件，而业务逻辑应该放在服务类或控制器中。
- 此配置没有显示地处理 Redis 密码认证。如果 Redis 服务器设置了密码，你需要通过 `jedis.auth("yourpassword")` 来认证。
- 使用单个 Jedis 实例可能不适合多线程环境。在生产环境中，通常使用 `JedisPool` 来管理连接池，以便更好地处理并发请求。

### 16.4.使用 hutool RedisDS

添加依赖,tio-boot 已经内置了 hutool-all 以来,包含 hutool-redis,主要添加 jedis 依赖即可

```
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>3.6.3</version>
</dependency>
```

配置类

```
package com.litongjava.tio.boot.hello.config;

import cn.hutool.db.nosql.redis.RedisDS;
import cn.hutool.setting.Setting;
import com.jfinal.kit.StrKit;
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.litongjava.tio.boot.context.Enviorment;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.Protocol;

@Configuration
public class HutoolRedisConfig {
  @Bean(destroyMethod = "close")
  public RedisDS redisDS() {
    Enviorment enviorment = Aop.get(Enviorment.class);
    String redisHost = enviorment.get("redis.host", "127.0.0.1");
    String redisPort = enviorment.get("redis.port", "6379");
    String redisPassword = enviorment.get("redis.password");

    // 配置你的Redis连接信息
    Setting setting = new Setting();

    String group = "redis";
    // 地址
    setting.setByGroup("host", group, redisHost);
    // 端口
    setting.setByGroup("port", group, redisPort);
    // 密码
    if (!StrKit.isBlank(redisPassword)) {
      setting.setByGroup("password", group, redisPassword);
    }

    // 连接超时
    setting.setByGroup("timeout", group, String.valueOf(Protocol.DEFAULT_TIMEOUT));
    setting.setByGroup("connectionTimeout", group, String.valueOf(Protocol.DEFAULT_TIMEOUT));
    // 读取数据超时
    setting.setByGroup("timeout", group, String.valueOf(Protocol.DEFAULT_TIMEOUT));
    setting.setByGroup("soTimeout", group, String.valueOf(Protocol.DEFAULT_TIMEOUT));
    // 数据库序号
    setting.setByGroup("database", group, String.valueOf(Protocol.DEFAULT_DATABASE));
    // 客户端名
    setting.setByGroup("clientName", group, "Hutool");
    // 是否使用SSL
    setting.setByGroup("ssl", group, String.valueOf(false));
    RedisDS redisDS = new RedisDS(setting, group);
    //连接redis
    redisDS.getJedis();
    return redisDS;
  }
}
```

测试 Controller

```
package com.litongjava.tio.boot.hello.controller;

import cn.hutool.db.nosql.redis.RedisDS;
import com.litongjava.jfinal.aop.Aop;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.server.annotation.RequestPath;
import lombok.extern.slf4j.Slf4j;

@RequestPath("/huredis")
@Slf4j
public class HuRedisTestController {

  @RequestPath("/test")
  public String test(HttpRequest request) {
    RedisDS redisDS = Aop.get(RedisDS.class);
    String value = redisDS.getStr("key");
    if (value == null) {
      log.info("计算新的value");
      redisDS.setStr("key", "value");
    }
    return value;
  }
}
```

这两段代码分别是配置类和控制器类的示例，用于在 Java 项目中使用 Hutool 的 `RedisDS` 类来配置和访问 Redis 数据库。

#### 配置类 (`HutoolRedisConfig`)

1 **类和方法注解**:

- `@Configuration`: 表示这是一个配置类，用于定义和配置 Beans。
- `@Bean(destroyMethod = "close")`: 创建一个 Bean，并指定当 Bean 不再需要时应该调用的销毁方法，这里是 `close()`。

2. **方法 `redisDS()`**:

- 从 `Enviorment` 实例（由 `Aop.get(Enviorment.class)` 获取）中读取 Redis 的配置信息（主机、端口、密码等）。
- 使用 Hutool 的 `Setting` 类来设置 Redis 的各种配置参数，如主机、端口、密码、超时、数据库索引等。
- 创建 `RedisDS` 实例，传入配置的 `Setting` 对象和配置组名。
- 通过 `redisDS.getJedis()` 连接到 Redis 数据库。
- 返回 `RedisDS` 实例。

#### 控制器类 (`HuRedisTestController`)

1. **类和方法注解**:

- `@RequestPath("/huredis")`: 定义控制器的基本路径。
- `@Slf4j`: Lombok 注解，为类提供一个日志实例。

2. **方法 `test(HttpRequest request)`**:

- 通过 `Aop.get(RedisDS.class)` 获取 RedisDS 实例。
- 使用 `redisDS.getStr("key")` 尝试从 Redis 获取与 `"key"` 关联的值。
- 如果值不存在（`null`），则记录信息并使用 `redisDS.setStr("key", "value")` 设置新的键值对。
- 返回从 Redis 获取的值（如果之前不存在，则为 `null`）。

这段代码展示了如何使用 Hutool 提供的 `RedisDS` 类在 tio-boot 框架中配置和访问 Redis 数据库。配置类 `HutoolRedisConfig` 负责设置 Redis 连接，而控制器类 `HuRedisTestController` 则处理具体的 Redis 交互逻辑。 17.使用 Redisson

## 17.Redisson

### 17.1.Redisson 简介

#### 17.1.1.什么是 Redisson

Redisson 是一个提供了多种分布式和可扩展 Java 数据结构的 Redis 客户端。

##### Redisson 库的用途

- **分布式实现**：Redisson 提供了标准 Java 集合接口的分布式和可扩展实现，如 `Map`、`Set`、`List`、`Queue`、`Deque` 等。
- **附加功能**：除了数据结构，Redisson 还提供分布式锁、同步器（如 CountDownLatch、Semaphore）、发布/订阅、集群支持等功能。
- **对象映射**：Redisson 还包括一个对象映射框架（RORM），可以将 Java 对象直接映射到 Redis 数据结构中。

##### 使用场景

- **高级缓存需求**：如果你的应用程序有复杂的缓存需求，或者你需要利用 Redis 提供的高级数据结构和功能，Redisson 是一个很好的选择。
- **分布式系统**：在分布式系统中，Redisson 的分布式数据结构和同步器非常有用，可以帮助处理不同实例间的数据共享和协调问题。

#### 17.1.2.Redisson 和 Jedis 的区别

Redisson 不依赖于 Jedis。Redisson 和 Jedis 都是用于与 Redis 数据库交互的 Java 客户端，但它们是独立开发的，各自实现了与 Redis 交互的不同机制和 API。

- **Redisson**：它使用自己的客户端来连接和操作 Redis。Redisson 提供了一系列高级功能，如分布式数据结构、分布式锁、可靠话题等，还支持多种集群模式，如主从、哨兵、集群等。

- **Jedis**：这是一个比较轻量级的客户端，主要提供了一个直接且简洁的 API 来与 Redis 进行交互。它支持各种基本的 Redis 操作，但不提供 Redisson 那样的高级分布式特性。

由于两者提供了不同的特性和优势，开发者会根据应用程序的具体需求和场景来选择使用 Redisson 或 Jedis。例如，需要高级分布式特性和集群支持时，可能会倾向于选择 Redisson；而对于简单的 Redis 操作，Jedis 可能更为合适。

### 17.2.使用 Redisson 连接 redis

要使用 Redisson 连接到 Redis，首先需要添加 Redisson 的 Maven 依赖到你的项目中。然后，可以创建一个新的配置类来配置和初始化 Redisson 客户端。以下是这个过程的详细说明：

#### . 添加 Redisson 依赖

在你的 `pom.xml` 文件中，添加 Redisson 的依赖。例如：

```xml
<dependency>
  <groupId>org.redisson</groupId>
  <artifactId>redisson</artifactId>
  <version>3.16.0</version>
</dependency>
```

redisson 依赖了 netty

请确保使用最新的版本号。

#### 创建 Redisson 配置类

创建一个新的配置类用于初始化 Redisson 客户端。你可以使用 `Redisson.create()` 方法和 `Config` 类来配置 Redisson。例如：

```java
package com.litongjava.tio.boot.hello.config;

import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

@Configuration
public class RedissonConfig {

  @Bean(destroyMethod = "shutdown")
  public RedissonClient redissonClient() {
    Config config = new Config();
    config.useSingleServer()
      .setAddress("redis://localhost:6379")
      .setDatabase(0);

    // 如果你的 Redis 设置了密码
    // .setPassword("yourPassword");

    return Redisson.create(config);
  }
}
```

在这个例子中：

- `Config` 类用于配置 Redisson。
- `useSingleServer()` 方法指定了单节点模式。
- `setAddress("redis://localhost:6379")` 指定 Redis 服务器的地址和端口。
- `setDatabase(0)` 指定默认数据库索引。
- `Redisson.create(config)` 创建并返回 Redisson 客户端实例。
- `@Bean(destroyMethod = "shutdown")` 注解确保当应用程序关闭时，Redisson 客户端也会被正确关闭。

#### 3. 使用 Redisson 客户端

一旦配置类设置好，你可以在你的应用程序中注入 `RedissonClient` 并使用它来与 Redis 交互。例如：

```java
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.jfinal.aop.Aop;
import com.litongjava.jfinal.aop.Autowired;
import com.litongjava.tio.http.common.HttpRequest;
import com.litongjava.tio.http.server.annotation.RequestPath;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBucket;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;

@RequestPath("/redisson")
@Slf4j
public class RedissonTestController {
  @RequestPath("/test")
  public String test(HttpRequest request) {
    String value = null;

    // 使用 Redisson 客户端
    RedissonClient redissonClient = Aop.get(RedissonClient.class);
    // 例如，获取一个锁
    RLock lock = redissonClient.getLock("myLock");
    lock.lock();
    // 创建或获取一个存储桶对象
    RBucket<String> bucket = redissonClient.getBucket("yourKey");
    //获取支持
    value = bucket.get();
    if (value == null) {

      log.info("计算新的value");
      value = "yourValue";
      // 向 Redis 中设置值
      bucket.set(value);
    }

    try {
      // 处理你的业务逻辑
    } finally {
      lock.unlock();
    }
    return value;
  }
}
```

请注意，Redisson 的 API 远不止于此。它提供了对许多复杂数据结构的支持，比如列表、映射、集合、分布式锁等，这些都可以通过 `RedissonClient` 实例来访问和操作。

这个例子演示了如何在你的服务类中使用 `RedissonClient`。你可以使用 Redisson 提供的丰富 API 来实现复杂的分布式功能，如分布式锁、集合、映射等。

### 17.4.Caffeine 整合 redis

#### 17.4.1.Caffeine 和 redis 的区别

Caffeine 本身不会将数据存储到 Redis 中。如果你想要将数据缓存到 Redis 中，你需要使用专门为 Redis 设计的缓存解决方案，如 Spring Cache with Redis 或 Jedis。这些工具和库允许你直接与 Redis 数据库交互，将数据存储在 Redis 中并从中检索。

在一些复杂的应用中，Caffeine 和 Redis 可能会一起使用，每个在不同的层级提供缓存服务：

- Caffeine：作为第一层缓存，提供快速的本地缓存。它非常适合频繁访问且相对较小的数据集。
- Redis：作为第二层缓存，主要用于更大规模的、分布式的数据存储和缓存。它适合需要跨多个应用实例共享的数据。

在这样的设置中，通常首先检查 Caffeine 缓存中是否存在所需的数据。如果未找到，然后检查 Redis 缓存，并且可能将从 Redis 检索的数据放入 Caffeine 缓存以加快后续访问的速度。

#### 17.2.结合使用 Caffeine 和 Redis

要创建一个服务，整合 Caffeine 和 Redisson 缓存，你可以遵循以下步骤。此服务将首先检查 Caffeine 缓存中是否存在所需数据。如果未找到，它将检查 Redisson 缓存，并可能将从 Redisson 检索的数据放入 Caffeine 缓存以加快后续访问的速度。

##### 编写一个整合 Caffeine 和 Redisson 的服务类

```java
package com.litongjava.tio.boot.hello.services;

import com.github.benmanes.caffeine.cache.Cache;
import com.litongjava.jfinal.aop.annotation.Service;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import com.litongjava.jfinal.aop.Aop;

@Service
public class CacheService {

  private final Cache<String, Object> caffeineCache;
  private final RedissonClient redissonClient;

  public CacheService() {
    this.caffeineCache = Aop.get(Cache.class);
    this.redissonClient = Aop.get(RedissonClient.class);
  }

  public Object get(String key) {
    // 首先尝试从 Caffeine 缓存中获取数据
    Object value = caffeineCache.getIfPresent(key);
    if (value != null) {
      return value;
    }

    // 如果 Caffeine 缓存中没有，则尝试从 Redisson 缓存中获取
    RBucket<Object> bucket = redissonClient.getBucket(key);
    value = bucket.get();

    if (value != null) {
      // 如果在 Redisson 中找到数据，则将其添加到 Caffeine 缓存中
      caffeineCache.put(key, value);
    }

    return value;
  }

  public void put(String key, Object value) {
    // 同时更新 Caffeine 和 Redisson 缓存
    caffeineCache.put(key, value);
    RBucket<Object> bucket = redissonClient.getBucket(key);
    bucket.set(value);
  }
}

```

##### 说明

**服务类 (`CacheService`)**: - 这个类整合了 Caffeine 和 Redisson 客户端。 - `get(String key)` 方法首先尝试从 Caffeine 缓存获取数据。如果未找到，它会从 Redisson 获取数据，并且将其放入 Caffeine 缓存中。 - `put(String key, Object value)` 方法同时更新 Caffeine 和 Redisson 缓存。

**缓存客户端获取**: - 使用 `Aop.get` 方法从 JFinal AOP 容器中获取 Caffeine 缓存和 Redisson 客户端实例。

**使用服务**: - 你可以在你的应用程序中的其他部分，如控制器或业务逻辑层中，注入或实例化 `CacheService` 类，并通过它来处理缓存逻辑。

这个服务提供了一个简单的方式来整合两种不同类型的缓存，利用了 Caffeine 的高性能本地缓存能力和 Redisson 的分布式缓存能力。通过这种方式，你可以提高数据检索的效率和应用程序的整体性能。

##### 测试 Controller

```
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.jfinal.aop.Aop;
import com.litongjava.tio.boot.hello.services.CacheService;
import com.litongjava.tio.http.server.annotation.RequestPath;
import lombok.extern.slf4j.Slf4j;

@RequestPath("/cache")
@Slf4j
public class CacheTestController {

  @RequestPath("/test")
  public Object test() {
    CacheService cacheService = Aop.get(CacheService.class);
    String key = "cache-test1234";
    Object value = cacheService.get(key);
    if (value == null) {
      log.info("计算新的value");
      value = "12343";
      cacheService.put(key, value);
    }
    return value;
  }
}
```

## tio-boot 内置 Tcp 支持

tio-boot 内置了 tcp 的支持,可以使用一个端口支持 tcp,http,websocket 三种协议,当一个数据包发送到 tio-boot-server 时,TioBootServerHandler 会根据内置的判断方法,选择对应处理器进行协议的处理.

- com.litongjava.tio.http.server.HttpServerAioHandler 内置的 http 协议处理器
- com.litongjava.tio.websocket.server.WsServerAioHandler 内置的 WebSocket 协议处理器
- com.litongjava.tio.server.intf.ServerAioHandler tcp 协议处理器,这是一个接口,需要自己实现 tcp 的处理逻辑

下面介绍如何使用 tio-boot 内置 Tcp 功能

```
package com.litongjava.tio.web.hello.tcp;
import com.litongjava.tio.core.intf.Packet;

/**
* socket消息包
*/
@SuppressWarnings("serial")
public class DemoPacket extends Packet {
  private byte[] body;

  public byte[] getBody() {
    return body;
  }

  public void setBody(byte[] body) {
    this.body = body;
  }
}
```

```

package com.litongjava.tio.web.hello.tcp;

import java.nio.ByteBuffer;

import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.core.Tio;
import com.litongjava.tio.core.TioConfig;
import com.litongjava.tio.core.exception.TioDecodeException;
import com.litongjava.tio.core.intf.Packet;
import com.litongjava.tio.server.intf.ServerAioHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DemoHandler implements ServerAioHandler {

  public Packet decode(ByteBuffer buffer, int limit, int position, int readableLength, ChannelContext channelContext)
      throws TioDecodeException {
    log.info("buffer:{}", buffer);
    // 获取由ByteBuffer支持的字节数组
    byte[] bytes = new byte[readableLength];
    buffer.get(bytes);
    // 封装为ShowcasePacket
    DemoPacket imPackage = new DemoPacket();
    imPackage.setBody(bytes);
    return imPackage;
  }

  public ByteBuffer encode(Packet packet, TioConfig tioConfig, ChannelContext channelContext) {
    DemoPacket helloPacket = (DemoPacket) packet;
    byte[] body = helloPacket.getBody();
    // ByteBuffer的总长度是消息体长度
    int bodyLength = body.length;
    log.info("encode:{}", bodyLength);

    // 创建一个新的ByteBuffer
    ByteBuffer buffer = ByteBuffer.allocate(bodyLength);
    // 设置字节序
    buffer.order(tioConfig.getByteOrder());
    // 消息消息体
    buffer.put(body);
    return buffer;
  }

  public void handler(Packet packet, ChannelContext channelContext) throws Exception {
    DemoPacket packingPacket = (DemoPacket) packet;
    byte[] body = packingPacket.getBody();
    if (body == null) {
      return;
    }
    String string = new String(body);
    log.info("received:{}", string);
    // 响应数据
    String sendMessage = "收到了你的消息，你的消息是:" + string;
    log.info("sendMessage:{}", sendMessage);
    byte[] bytes = sendMessage.getBytes();
    // 响应包
    DemoPacket responsePacket = new DemoPacket();
    responsePacket.setBody(bytes);
    // 响应消息
    log.info("开始响应");
    Tio.send(channelContext, responsePacket);
    log.info("响应完成");
  }
}
```

```

package com.litongjava.tio.web.hello.tcp;

import com.litongjava.tio.core.ChannelContext;
import com.litongjava.tio.core.intf.Packet;
import com.litongjava.tio.server.intf.ServerAioListener;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DemoTioServerListener implements ServerAioListener {
  public void onAfterConnected(ChannelContext channelContext, boolean isConnected, boolean isReconnect)
      throws Exception {
    log.info("{},{},{}", channelContext, isConnected, isReconnect);
  }

  public void onAfterDecoded(ChannelContext channelContext, Packet packet, int packetSize) throws Exception {
    log.info("{},{},{}", channelContext, packet, packetSize);
  }

  public void onAfterReceivedBytes(ChannelContext channelContext, int receivedBytes) throws Exception {
    log.info("{},{}", channelContext, receivedBytes);
  }

  public void onAfterSent(ChannelContext channelContext, Packet packet, boolean isSentSuccess) throws Exception {
    log.info("{},{}", channelContext, packet);
  }

  public void onAfterHandled(ChannelContext channelContext, Packet packet, long cost) throws Exception {
    log.info("{},{},{}", channelContext, packet, cost);
  }

  /**
   * 连接关闭前触发本方法
   *
   * @param channelContext        the channelcontext
   * @param throwable the throwable 有可能为空
   * @param remark    the remark 有可能为空
   * @param isRemove
   * @throws Exception
   */

  public void onBeforeClose(ChannelContext channelContext, Throwable throwable, String remark, boolean isRemove)
      throws Exception {
    log.info("{},{},{},{}", channelContext, throwable, remark, isRemove);
  }

  /**
   * @param channelContext
   * @param interval              已经多久没有收发消息了，单位：毫秒
   * @param heartbeatTimeoutCount 心跳超时次数，第一次超时此值是1，以此类推。此值被保存在：channelContext.stat.heartbeatTimeoutCount
   * @return 返回true，那么服务器则不关闭此连接；返回false，服务器将按心跳超时关闭该连接
   */
  public boolean onHeartbeatTimeout(ChannelContext channelContext, Long interval, int heartbeatTimeoutCount) {
    log.info("{},{},{}", channelContext, interval, heartbeatTimeoutCount);
    return false;
  }
}

```

```
package com.litongjava.tio.web.hello;

import com.litongjava.jfinal.aop.annotation.ComponentScan;
import com.litongjava.tio.boot.TioApplication;
import com.litongjava.tio.server.intf.ServerAioHandler;
import com.litongjava.tio.server.intf.ServerAioListener;
import com.litongjava.tio.web.hello.tcp.DemoHandler;
import com.litongjava.tio.web.hello.tcp.DemoTioServerListener;

@ComponentScan
public class HelloApp {
  public static void main(String[] args) {
    long start = System.currentTimeMillis();
    ServerAioHandler demoHandler = new DemoHandler();
    ServerAioListener listener = new DemoTioServerListener();
    TioApplication.run(HelloApp.class, demoHandler, listener, args);
    long end = System.currentTimeMillis();
    System.out.println((end - start) + "ms");
  }
}
```

### 1. `DemoPacket` 类

这是一个继承自 `Packet` 的类，用于表示一个 socket 消息包。它主要包含一个 `byte[] body` 字段来存储消息体的数据。

### 2. `DemoHandler` 类

这个类实现了 `ServerAioHandler` 接口，用于处理 TCP 协议。它主要包含三个方法：

- `decode`: 解码方法，用于从 `ByteBuffer` 中读取数据并转换为 `DemoPacket`。
- `encode`: 编码方法，将 `DemoPacket` 的数据转换为 `ByteBuffer`，以便于传输。
- `handler`: 处理方法，用于接收解码后的 `DemoPacket`，执行业务逻辑，并响应客户端。

### 3. `DemoTioServerListener` 类

这个类实现了 `ServerAioListener` 接口，用于监听服务器在处理 TCP 连接时的不同事件如连接建立、消息解码、消息接收、消息发送、处理完成和连接关闭等。
。这个监听器允许你在连接的生命周期中的关键时刻进行自定义处理。这对于监控、日志记录、资源管理和异常处理等方面非常有用。
下面是对 `DemoTioServerListener` 中各个方法的详细解释：

#### 1. `onAfterConnected`

- **作用**: 当一个新的连接建立后调用。
- **参数**:
  - `ChannelContext`: 表示当前连接的上下文。
  - `isConnected`: 表示是否成功连接。
  - `isReconnect`: 表示是否为重连。
- **实现逻辑**: 在这个方法中，通常用于记录连接建立的信息，或者进行一些初始化操作。

#### 2. `onAfterDecoded`

- **作用**: 在消息解码后调用。
- **参数**:
  - `ChannelContext`: 当前连接的上下文。
  - `Packet`: 解码后的数据包。
  - `packetSize`: 数据包的大小。
- **实现逻辑**: 用于处理解码后的数据，如记录日志或进行一些验证。

#### 3. `onAfterReceivedBytes`

- **作用**: 在接收到数据字节后调用。
- **参数**:
  - `ChannelContext`: 当前连接的上下文。
  - `receivedBytes`: 接收到的字节数。
- **实现逻辑**: 可用于监控数据流量，如记录接收到的总字节数。

#### 4. `onAfterSent`

- **作用**: 在发送数据包后调用。
- **参数**:
  - `ChannelContext`: 当前连接的上下文。
  - `Packet`: 发送的数据包。
  - `isSentSuccess`: 是否发送成功。
- **实现逻辑**: 用于确认数据发送的状态，可以用来记录日志或处理发送失败的情况。

#### 5. `onAfterHandled`

- **作用**: 在消息处理完毕后调用。
- **参数**:
  - `ChannelContext`: 当前连接的上下文。
  - `Packet`: 被处理的数据包。
  - `cost`: 处理消耗的时间。
- **实现逻辑**: 用于记录处理消息所需的时间，或进行一些后处理工作。

#### 6. `onBeforeClose`

- **作用**: 在连接关闭前触发。
- **参数**:
  - `ChannelContext`: 当前连接的上下文。
  - `Throwable`: 引起关闭的异常，可能为空。
  - `remark`: 备注信息，可能为空。
  - `isRemove`: 是否移除。
- **实现逻辑**: 在连接即将关闭时被调用，通常用于清理资源或记录日志。

#### 7. `onHeartbeatTimeout`

- **作用**: 心跳超时时调用。
- **参数**:
  - `ChannelContext`: 当前连接的上下文。
  - `interval`: 已经多久没有收发消息了，单位是毫秒。
  - `heartbeatTimeoutCount`: 心跳超时次数。
- **实现逻辑**: 当连接心跳超时时调用，可以根据需要决定是否关闭连接。

### 4. `HelloApp` 类

这是应用程序的入口类。它使用 `TioApplication.run` 方法启动服务器，并传入 `DemoHandler` 和 `DemoTioServerListener` 作为处理器和监听器。

### 总结

整体上，这段代码展示了如何使用 `tio-boot` 框架来构建一个同时支持 TCP、HTTP 和 WebSocket 协议的服务器。它通过定义消息包的格式（`DemoPacket`）、处理逻辑（`DemoHandler`）、事件监听（`DemoTioServerListener`）以及应用程序启动配置（`HelloApp`），实现了一个基本的网络通信服务器。

## Netty

Netty 是一个高性能的网络库，用于创建一个服务器，该服务器在指定端口上监听传入的网络连接.

添加依赖

```
<dependency>
  <groupId>io.netty</groupId>
  <artifactId>netty-all</artifactId>
  <version>4.1.65.Final</version>
</dependency>
```

```
package com.litongjava.tio.boot.hello.nettyserver;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;

public class NettyChannelHandler extends ChannelInitializer<SocketChannel> {
  @Override
  protected void initChannel(SocketChannel socketChannel) throws Exception {
    ChannelPipeline p = socketChannel.pipeline();
    p.addLast(new NettyServerHandler());
  }
}



package com.litongjava.tio.boot.hello.nettyserver;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.CharsetUtil;
import io.netty.util.ReferenceCountUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NettyServerHandler extends ChannelInboundHandlerAdapter {

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    // 出现异常就关闭
    cause.printStackTrace();
    ctx.close();
  }

  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    try {
      ByteBuf in = (ByteBuf) msg;
      String string = in.toString(CharsetUtil.UTF_8);
      log.info("received:{}", string);
      // 这里调用service服务,数据库
    } finally {
      ReferenceCountUtil.release(msg);
    }
  }
}
```

```
package com.litongjava.tio.boot.hello.nettyserver;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class NettyServerBootstrap {
  private int port;
  private NettyChannelHandler nettyChannelHandler;
  private EventLoopGroup boss = new NioEventLoopGroup();
  private EventLoopGroup worker = new NioEventLoopGroup();

  public NettyServerBootstrap(int port, NettyChannelHandler nettyChannelHandler) {
    this.port = port;
    this.nettyChannelHandler = nettyChannelHandler;
  }

  public void start() {
    boss = new NioEventLoopGroup();
    worker = new NioEventLoopGroup();
    try {
      ServerBootstrap bootstrap = new ServerBootstrap();
      bootstrap.group(boss, worker);
      bootstrap.channel(NioServerSocketChannel.class);
      bootstrap.option(ChannelOption.SO_BACKLOG, 1024); // 连接数
      bootstrap.option(ChannelOption.TCP_NODELAY, true); // 不延迟，消息立即发送
      bootstrap.childOption(ChannelOption.SO_KEEPALIVE, true); // 长连接
      bootstrap.childHandler(nettyChannelHandler);
      ChannelFuture f = bootstrap.bind(port).sync();
      if (f.isSuccess()) {
        log.info("netty start successful:{}", this.port);
      }
      f.channel().closeFuture().sync();
    } catch (Exception e) {
      log.info("netty start fail：" + e.getMessage());
      e.printStackTrace();
    } finally {
      close();
    }
  }

  public void close() {
    log.info("close netty");
    if (boss != null) {
      boss.shutdownGracefully();
    }
    if (worker != null) {
      worker.shutdownGracefully();
    }

  }
}
```

```
package com.litongjava.tio.boot.hello.controller;

import com.litongjava.jfinal.aop.Aop;
import com.litongjava.jfinal.aop.annotation.Bean;
import com.litongjava.jfinal.aop.annotation.Configuration;
import com.litongjava.tio.boot.context.Enviorment;
import com.litongjava.tio.boot.hello.nettyserver.NettyChannelHandler;
import com.litongjava.tio.boot.hello.nettyserver.NettyServerBootstrap;

import cn.hutool.core.thread.ThreadUtil;

@Configuration
public class NettyServerConfig {

  @Bean(destroyMethod = "close")
  public NettyServerBootstrap nettyServerBootstrap() {
    Enviorment enviorment = Aop.get(Enviorment.class);
    int nioPort = enviorment.getInt("noi.server.port", 17902);

    NettyChannelHandler nettyChannelHandler = new NettyChannelHandler();
    NettyServerBootstrap nettyServerBootstrap = new NettyServerBootstrap(nioPort, nettyChannelHandler);
    ThreadUtil.execute(() -> {
      nettyServerBootstrap.start();
    });
    return nettyServerBootstrap;
  }
}
```

```
package com.litongjava.tio.boot.hello.nettyserver;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;

public class SocketClientSender {
  public static void main(String[] args) {
    try {
      Socket socket = new Socket("127.0.0.1", 17902);
      OutputStream outputStream = socket.getOutputStream();
      PrintWriter printWriter = new PrintWriter(outputStream);
      printWriter.write("$tmb00035ET3318/08/22 11:5804029.94,027.25,20.00,20.00$");
      System.out.println("send message");
      printWriter.flush();
      socket.shutdownOutput();
      socket.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
```

这些代码展示了一个使用 Netty 库的基本服务器-客户端应用程序。`NettyServerHandler` 处理入站消息和异常情况。`NettyChannelHandler` 用于初始化通道。`NettyServerBootstrap` 负责配置和启动服务器。`NettyServerConfig` 在应用程序启动时配置服务器。`SocketClientSender` 演示了如何创建一个客户端来发送消息给服务器。

这些代码中的每个类和方法的用途和意义：

#### 1. `NettyServerHandler` 类 (`com.litongjava.tio.boot.hello.nettyserver`)

这个类扩展了 Netty 的 `ChannelInboundHandlerAdapter`，用于处理入站的网络事件。

- `channelRead(ChannelHandlerContext ctx, Object msg)`: 当从客户端接收到数据时调用。它将接收到的 `ByteBuf` 转换为字符串，并记录接收到的消息。处理完成后，释放消息资源以避免内存泄漏。
- `exceptionCaught(ChannelHandlerContext ctx, Throwable cause)`: 当处理过程中发生异常时调用。这个方法记录异常并关闭当前的连接。

#### 2. `NettyChannelHandler` 类 (`com.litongjava.tio.boot.hello.nettyserver`)

这个类是 `ChannelInitializer<SocketChannel>` 的扩展，用于初始化新的连接通道。

- `initChannel(SocketChannel socketChannel)`: 在这个方法中，你可以添加各种处理器到这个通道的流水线（`ChannelPipeline`），这里添加了 `NettyServerHandler` 实例。

#### 3. `NettyServerBootstrap` 类 (`com.litongjava.tio.boot.hello.nettyserver`)

这个类负责配置和启动 Netty 服务器。

- 构造函数: 接收端口号和 `NettyChannelHandler` 实例。
- `start()`: 这个方法配置和启动 Netty 服务器。它设置了服务器的各种选项（如连接队列长度、TCP_NODELAY 等），并将服务器绑定到指定的端口。
- `close()`: 用于优雅地关闭服务器，释放资源。

#### 4. `NettyServerConfig` 类 (`com.litongjava.tio.boot.hello.controller`)

##### 用途

`NettyServerConfig` 是一个配置类，主要用于初始化和配置 Netty 服务器。这个类使用了 JFinalAop Framework 的 `@Configuration` 注解，这表明它是一个用于定义配置信息的类，JFinalAop 容器会特别处理这个类，以便在应用程序启动时应用这些配置。

##### 方法解释

- `nettyServerBootstrap()`: 此方法创建并配置 `NettyServerBootstrap` 实例。它从环境配置中读取端口号，并在新线程中启动服务器。这是一个被 `@Bean` 注解标记的方法，用于创建 `NettyServerBootstrap` 类的实例。在 JFinalAop 的上下文中，这表明 `NettyServerBootstrap` 实例会被视为一个 Bean，并由 JFinalAop 容器管理其生命周期。

  - **初始化过程**：方法首先通过 `Aop.get(Enviorment.class)` 获取环境配置信息，从中读取服务器端口号。这种方式表明它使用了 JFinal 的 AOP 特性来注入依赖，这里是获取应用程序的环境设置。

  - **创建 `NettyServerBootstrap` 实例**：使用从环境配置中获取的端口号和一个新创建的 `NettyChannelHandler` 实例，初始化 `NettyServerBootstrap` 类的对象。

  - **启动服务器**：通过 `ThreadUtil.execute()` 方法，在新的线程中调用 `nettyServerBootstrap.start()` 启动 Netty 服务器。这样做可以避免阻塞正在执行的主线程，确保服务器的启动过程是异步的。

  - **返回值**：方法返回创建的 `NettyServerBootstrap` 实例。由于这个方法被标记为 `@Bean`，因此这个实例会被 JFinalAop 容器管理，可以在其他部分的应用程序中被注入和使用。

- `@Bean(destroyMethod = "close")`: 这个注解的 `destroyMethod` 属性指定了当 JFinalAop 容器关闭或者这个 Bean 被移除时应该调用的方法。在这个例子中，当应用程序关闭时，`NettyServerBootstrap` 实例的 `close()` 方法会被自动调用，这个方法会负责清理资源，比如关闭服务器和释放线程资源。

`NettyServerConfig` 类是 Netty 服务器在基于 JFinalAop 框架的应用程序中的配置类。它负责创建和配置 `NettyServerBootstrap` 实例，确保 Netty 服务器作为一个 JFinalAop Bean 被正确初始化、运行和关闭。这种配置方式使得 Netty 服务器的设置与 JFinalAop 应用程序的生命周期紧密集成，便于管理和维护。

#### 5. `SocketClientSender` 类 (`com.litongjava.tio.boot.hello.nettyserver`)

这个类包含一个简单的客户端，用于向服务器发送消息。

- `main(String[] args)`: 这个方法创建一个套接字连接到服务器，发送一条消息，然后关闭连接。

## 18.常用内置类方法说明

### 18.1.HttpRequest

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

#### 18. `getDomain()`

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

#### 18. `getChannelContext()`

- **说明**: 获取当前 HTTP 请求的通道上下文。
- **用法**:
  ```java
  ChannelContext channelContext = httpRequest.getChannelContext();
  ```

#### 18. `getContentLength()`

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

#### 18. `getCookieMap()`

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

### 18.2.HttpResponse

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

### 18.3.Resps

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

### 18.4.Tio

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
