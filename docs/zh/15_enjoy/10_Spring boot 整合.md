# Spring boot 整合

### 1、maven 坐标

Spring 整合可以在 pom.xml 中配置 jfinal 坐标，也可以配置 Enjoy Template Engine 的独立发布版本坐标，其 maven 坐标如下：

```
<dependency>
  <groupId>com.jfinal</groupId>
  <artifactId>enjoy</artifactId>
  <version>5.1.2</version>
</dependency>
```

JFinal Template Engine 的独立发布版本 Enjoy 只有 207K 大小，并且无任何第三方依赖。

### 2、Spring Boot 整合

Spring boot 下整合配置如下：

```
@Configuration
public class SpringBootConfig {

  @Bean(name = "jfinalViewResolver")
  public JFinalViewResolver getJFinalViewResolver() {

    // 创建用于整合 spring boot 的 ViewResolver 扩展对象
    JFinalViewResolver jfr = new JFinalViewResolver();

    // 对 spring boot 进行配置
    jfr.setSuffix(".html");
    jfr.setContentType("text/html;charset=UTF-8");
    jfr.setOrder(0);

    // 设置在模板中可通过 #(session.value) 访问 session 中的数据
    jfr.setSessionInView(true);

    // 获取 engine 对象，对 enjoy 模板引擎进行配置，配置方式与前面章节完全一样
    Engine engine  = JFinalViewResolver.engine;

    // 热加载配置能对后续配置产生影响，需要放在最前面
    engine.setDevMode(true);

    // 使用 ClassPathSourceFactory 从 class path 与 jar 包中加载模板文件
    engine.setToClassPathSourceFactory();

    // 在使用 ClassPathSourceFactory 时要使用 setBaseTemplatePath
    // 代替 jfr.setPrefix("/view/")
    engine.setBaseTemplatePath("/view/");

    // 添加模板函数
    engine.addSharedFunction("/common/_layout.html");
    engine.addSharedFunction("/common/_paginate.html");

    // 更多配置与前面章节完全一样
    // engine.addDirective(...)
    // engine.addSharedMethod(...);

    return jfr;
  }
}
```

如上所示，jfr.setToClassPathSourceFactory() 配置的 ClassPathSourceFactory 将从 class path 和 jar 包中加载模板文件。jfr.addSharedFunction(...) 配置共享模板函数。其上有关 enjoy 的配置本质上与对 Engine 对象的配置是一致的

如果从项目的 webapp 路径下加载模板文件则无需配置为 ClassPathSourceFactory。

### 3、Spring MVC 整合

在 Spring mvc 下整合 Enjoy 非常简单，只需要配置一个 bean 即可，如下是具体配置方式：

```
<bean id="viewResolver" class="com.jfinal.template.ext.spring.JFinalViewResolver">
  <!-- 是否热加载模板文件 -->
  <property name="devMode" value="true"/>
  <!-- 配置shared function，多文件用逗号分隔 -->
  <property name="sharedFunction" value="/view/_layout.html, /view/_paginate.html"/>

  <!-- 是否支持以 #(session.value) 的方式访问 session -->
  <property name="sessionInView" value="true"/>
  <property name="prefix" value="/view/"/>
  <property name="suffix" value=".html"/>
  <property name="order" value="1"/>
  <property name="contentType" value="text/html; charset=utf-8"/>
</bean>
```

更多、更详细的配置项及其说明，可以通过查看 JFinalViewResolver 头部的注释来了解，在绝大部分情况下，上面的配置项可以满足需求。
