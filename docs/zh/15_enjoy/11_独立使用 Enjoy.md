# 独立使用 Enjoy

Enjoy Template Engine 的使用不限于 web，可以使用在任何 java 开发环境中。Enjoy 常被用于代码生成、email 生成、模板消息生成等具有模板特征数据的应用场景，使用方式极为简单。

由于很多同学提出要在非 jfinal 环境下使用 Enjoy，所以 Enjoy 模板引擎发布了独立版本，maven 坐标如下：

```
<dependency>
  <groupId>com.jfinal</groupId>
  <artifactId>enjoy</artifactId>
  <version>5.1.2</version>
</dependency>
```

独立引入 enjoy 项目，可以用于任何 java 项目中。

### 1､Engine 与 Template

Engine 是使用 Enjoy 的配置入口和使用入口，主要功能之一是配置 Enjoy 各种参数，其二是通过 getTemplate、getTemplateByString 方法获取到 Template 对象，例如：

```
Engine engine = Engine.use();

engine.setDevMode(true);
engine.setToClassPathSourceFactory();

engine.getTemplate("index.html");
```

Template 代表对模板的抽象，可以调用其 render 系方法对模板进行渲染，例如：

```
Kv kv = Kv.by("key", 123);
Template template = engine.getTemplate("index.html");

// 字节流模式输出到 OutputStream
ByteArrayOutputStream baos = new ByteArrayOutputStream();
template.render(kv, baos);

// 字符流模式输出到 StringWriter
StringWriter sw = new StringWriter();
template.render(kv, sw);

// 直接输出到 String 变量
String str = template.renderToString(kv);
```

以上代码中的 template.render(kv. baos) 将数据渲染到 OutputStream 用于 web 项目可极大提升性能。后续的两种 render 方式分别将渲染结果输出到 Writer 与 String 变量中，方便 "非 web" 项目中使用。

以上代码中的 render 系列方法的第一个参数类型为 Map。Kv 继承自 Map，并添加了一些提升用户体验的方法，可用于替代使用 Map 的场景。

### 2、基本用法

直接举例：

```
Engine.use().getTemplate("demo.html").renderToString(Kv.by("k", "v"));
```

一行代码搞定模板引擎在任意环境下的使用，将极简贯彻到底。上例中的 use()方法将从 Engine 中获取默认存在的 main Engine 对象，然后通过 getTemplate 获取 Template 对象，最后再使用 renderToString 将模板渲染到 String 之中。

### 3、进阶用法

直接举例：

```
Engine engine = Engine.create("myEngine");
engine.setDevMode(true);
engine.setToClassPathSourceFactory();
Template template = engine.getTemplate("wxAppMsg.txt");
String wxAppMsg = template.renderToString(Kv.by("toUser", "james"));

engine = Engine.use("myEngine");
```

上例第一行代码创建了名为 "myEngine" 的 Engine 对象，第二行代码设置了热加载模板文件，第三行代码设置引擎从 class path 以及 jar 包中加载模板文件，第四行代码利用 wxAppMsg.txt 这个模板创建一个 Template 对象，第五行代码使用该对象渲染内容到 String 对象中，从而生成了微信小程序消息内容。

注意，最后一行代码使用 use 方法获取到了第一行代码创建的 engine 对象，意味着使用正确的 engineName 可以在任何地方获取到之前创建的 engine 对象，极为方便。

除了可以将模板渲染到 String 中以外，还可以渲染到任意的 Writer 之中，只需要用一下 Template.render(Map data, java.io.Writer wirter)方法即可实现，例如：Writer 接口如果指向文件，那么就将其内容渲染到文件之中，甚至可以实现 Writer 接口将内容渲染到 socket 套接字中。

除了外部模板文件可以作为模板内容的来源以外，还可以通过 String 数据或者 IStringSource 接口实现类作为模板数据的来源，以下是代码示例：

```
Template template = engine.getTemplateByString("#(x + 123)");
String result = template.renderToString(Kv.by("x", 456));

template = engine.getTemplate(new MySource());
result = template.renderToString(Kv.by("k", "v"));
```

上例代码第一行通过 getTemplateByString 来获取 Template 对象，而非从外部模板文件来获取，这种用法非常适合模板内容非常简短的情况，避免了创建外部模板文件，例如：非常适合用于替换 JDK 中的 String.format(…) 方法。

上例中的第三行代码，传入的参数是 new MySource()，MySource 类是 ISource 接口的实现类，通过该接口可以实现通过任意方式来获取模板内容，例如，通过网络 socket 连接来获取，ISource 接口用法极其简单，在此不再赘述。

### 4、Engine 对象管理

Engine 对象的创建方式有两种，一种是通过 Engine.create(name) 方法，另一种是直接使用 new Engine() 语句，前者创建的对象是在 Engine 模块管辖之内，可以通过 Engine.use(name) 获取到，而后者创建的对象脱离了 Engine 模块管辖，无法通过 Engine.use(name) 获取到，开发者需要自行管理。

JFinal 的 render 模块以及 activerecord 模块使用 new Engine() 创建实例，无法通过 Engine.use(name) 获取到，前者可以通过 RenderManager.me().getEngine() 获取到，后者可以通过 activeRecordPlugin.getEngine() 获取到。

Engine 对象管理的设计，允许在同一个应用程序中使用多个 Engine 实例用于不同的用途，JFinal 自身的 render、activerecord 模块对 Engine 的使用就是典型的例子。

强烈建议加入 JFinal 俱乐部，获取极为全面的 jfinal 最佳实践项目源代码 jfinal-club，项目中包含大量的 模板引擎使用实例，可以用最快的速度，几乎零成本的轻松方式，掌握 JFinal Template Engine 最简洁的用法，省去看文档的时间：http://www.jfinal.com/club
