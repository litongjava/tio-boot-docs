(window.webpackJsonp=window.webpackJsonp||[]).push([[126],{496:function(t,s,a){"use strict";a.r(s);var n=a(10),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"tio-boot-添加-http-server-handler"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#tio-boot-添加-http-server-handler"}},[t._v("#")]),t._v(" tio-boot 添加 http-server handler")]),t._v(" "),s("p",[t._v("tio-boot 支持的两种组件最 http 请求进行处理")]),t._v(" "),s("ul",[s("li",[t._v("http-server handler")]),t._v(" "),s("li",[t._v("tio-boot controller")])]),t._v(" "),s("p",[s("strong",[t._v("注意")])]),t._v(" "),s("ul",[s("li",[t._v("1.http-server handler 的优先级高于 tio-boot controller")]),t._v(" "),s("li",[t._v("2.http-server handler 不支持参数封装,只能接受形参 HttpRequest,返回 HttpResponse")]),t._v(" "),s("li",[t._v("3.http-server handler 在性能上优于 tio-boot controller")])]),t._v(" "),s("h2",{attrs:{id:"创建-http-server-handler"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#创建-http-server-handler"}},[t._v("#")]),t._v(" 创建 http-server handler")]),t._v(" "),s("h4",{attrs:{id:"步骤-1-创建-handler-类"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#步骤-1-创建-handler-类"}},[t._v("#")]),t._v(" 步骤 1：创建 Handler 类")]),t._v(" "),s("p",[t._v("首先，创建一个名为 "),s("code",[t._v("HelloRequestHandler")]),t._v(" 的类，它包含了两个处理 HTTP 请求的方法。每个方法接收一个 "),s("code",[t._v("HttpRequest")]),t._v(" 对象，并返回一个 "),s("code",[t._v("HttpResponse")]),t._v(" 对象。例如：")]),t._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("common"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpRequest")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("common"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpResponse")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("util"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Resps")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloRequestHandler")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpResponse")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hello")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpRequest")]),t._v(" httpRequest"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Resps")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("txt")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("httpRequest"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpResponse")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hi")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpRequest")]),t._v(" httpRequest"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Resps")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("txt")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("httpRequest"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hi"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br"),s("span",{staticClass:"line-number"},[t._v("13")]),s("br"),s("span",{staticClass:"line-number"},[t._v("14")]),s("br")])]),s("p",[t._v("在这个例子中，"),s("code",[t._v("hello")]),t._v(' 方法返回文本 "hello"，而 '),s("code",[t._v("hi")]),t._v(' 方法返回文本 "hi"。')]),t._v(" "),s("h4",{attrs:{id:"步骤-2-定义并配置-httproutes"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#步骤-2-定义并配置-httproutes"}},[t._v("#")]),t._v(" 步骤 2：定义并配置 HttpRoutes")]),t._v(" "),s("p",[t._v("接下来，定义一个配置类 "),s("code",[t._v("HttpServerRequestHanlderConfig")]),t._v("。在这个类中，你将实例化 "),s("code",[t._v("SimpleHttpRoutes")]),t._v(" 并添加自定义路由。")]),t._v(" "),s("ul",[s("li",[t._v("使用 "),s("code",[t._v("@BeforeStartConfiguration")]),t._v(" 注解标记这个配置类，这样框架会在启动前加载它。")]),t._v(" "),s("li",[t._v("通过 "),s("code",[t._v("@AInitialization")]),t._v(" 注解定义一个 初始化方法")]),t._v(" "),s("li",[t._v("在这个方法中，首先通过 "),s("code",[t._v("Aop.get")]),t._v(" 方法获取 "),s("code",[t._v("HelloRequestHandler")]),t._v(" 的实例。然后，创建一个 "),s("code",[t._v("SimpleHttpRoutes")]),t._v(" 实例，并使用 "),s("code",[t._v("add")]),t._v(" 方法添加路由。")]),t._v(" "),s("li",[t._v("TioBootServer 中默认的 SimpleHttpRoutes 值为 null,所以需要通过外部进行设置")])]),t._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("jfinal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("aop"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Aop")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("jfinal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("aop"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("annotation"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AInitialization")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("jfinal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("aop"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("annotation"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BeforeStartConfiguration")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("boot"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TioBootServer")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token import"}},[s("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("litongjava"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("tio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("handler"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")])]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SimpleHttpRoutes")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@BeforeStartConfiguration")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpServerRequestHanlderConfig")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@AInitialization")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("httpRoutes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建simpleHttpRoutes")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SimpleHttpRoutes")]),t._v(" simpleHttpRoutes "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SimpleHttpRoutes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建controller")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloRequestHandler")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloRequestHandler")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Aop")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloRequestHandler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 添加action")]),t._v("\n    simpleHttpRoutes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/hi"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloRequestHandler")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("::")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hi")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    simpleHttpRoutes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/hello"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloRequestHandler")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("::")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("hello")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将simpleHttpRoutes添加到TioBootServer")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TioBootServer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("me")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setHttpRoutes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("simpleHttpRoutes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br"),s("span",{staticClass:"line-number"},[t._v("13")]),s("br"),s("span",{staticClass:"line-number"},[t._v("14")]),s("br"),s("span",{staticClass:"line-number"},[t._v("15")]),s("br"),s("span",{staticClass:"line-number"},[t._v("16")]),s("br"),s("span",{staticClass:"line-number"},[t._v("17")]),s("br"),s("span",{staticClass:"line-number"},[t._v("18")]),s("br"),s("span",{staticClass:"line-number"},[t._v("19")]),s("br"),s("span",{staticClass:"line-number"},[t._v("20")]),s("br"),s("span",{staticClass:"line-number"},[t._v("21")]),s("br"),s("span",{staticClass:"line-number"},[t._v("22")]),s("br"),s("span",{staticClass:"line-number"},[t._v("23")]),s("br"),s("span",{staticClass:"line-number"},[t._v("24")]),s("br"),s("span",{staticClass:"line-number"},[t._v("25")]),s("br")])]),s("p",[t._v("在上述配置中，"),s("code",[t._v("/hi")]),t._v(" 路由映射到 "),s("code",[t._v("HelloRequestHandler")]),t._v(" 的 "),s("code",[t._v("hi")]),t._v(" 方法，而 "),s("code",[t._v("/hello")]),t._v(" 路由映射到 "),s("code",[t._v("hello")]),t._v(" 方法。")])])}),[],!1,null,null,null);s.default=e.exports}}]);