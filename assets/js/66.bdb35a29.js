(window.webpackJsonp=window.webpackJsonp||[]).push([[66],{439:function(t,e,r){"use strict";r.r(e);var o=r(10),v=Object(o.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"tiobootserver-文档"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#tiobootserver-文档"}},[t._v("#")]),t._v(" TioBootServer 文档")]),t._v(" "),e("h2",{attrs:{id:"概述"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#概述"}},[t._v("#")]),t._v(" 概述")]),t._v(" "),e("p",[e("code",[t._v("TioBootServer")]),t._v(" 是 Tio 框架的核心启动类，负责初始化和启动 Tio 服务器。它提供了一个结构化的方式来配置和启动你的服务器应用程序。在启动过程中，"),e("code",[t._v("TioBootServer")]),t._v(" 将大量的类以静态变量的形式存储，使得开发者可以在框架启动前后进行灵活的配置和操作。")]),t._v(" "),e("h2",{attrs:{id:"主要功能"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#主要功能"}},[t._v("#")]),t._v(" 主要功能")]),t._v(" "),e("ul",[e("li",[e("strong",[t._v("初始化和启动")]),t._v(": 通过 "),e("code",[t._v("init")]),t._v(" 方法初始化服务器配置，并通过 "),e("code",[t._v("start")]),t._v(" 方法启动服务器。")]),t._v(" "),e("li",[e("strong",[t._v("动态配置")]),t._v(": 开发者可以在框架启动前后，通过获取和设置 "),e("code",[t._v("TioBootServer")]),t._v(" 中的静态变量来改变框架的行为。")]),t._v(" "),e("li",[e("strong",[t._v("资源清理")]),t._v(": 提供 "),e("code",[t._v("stop")]),t._v(" 方法来关闭服务器，并执行注册的销毁方法。")])]),t._v(" "),e("h2",{attrs:{id:"核心方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#核心方法"}},[t._v("#")]),t._v(" 核心方法")]),t._v(" "),e("h3",{attrs:{id:"init-servertioconfig-wsserverconfig-httpconfig"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#init-servertioconfig-wsserverconfig-httpconfig"}},[t._v("#")]),t._v(" init(ServerTioConfig, WsServerConfig, HttpConfig)")]),t._v(" "),e("p",[t._v("初始化 "),e("code",[t._v("TioBootServer")]),t._v("。接收 "),e("code",[t._v("ServerTioConfig")]),t._v("，"),e("code",[t._v("WsServerConfig")]),t._v(" 和 "),e("code",[t._v("HttpConfig")]),t._v(" 作为参数，用于配置服务器的 TCP，WebSocket 和 HTTP 设置。")]),t._v(" "),e("h3",{attrs:{id:"start-string-bindip-integer-bindport"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#start-string-bindip-integer-bindport"}},[t._v("#")]),t._v(" start(String bindIp, Integer bindPort)")]),t._v(" "),e("p",[t._v("启动服务器。绑定 IP 和端口，并开始接收客户端连接。")]),t._v(" "),e("h3",{attrs:{id:"stop"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#stop"}},[t._v("#")]),t._v(" stop()")]),t._v(" "),e("p",[t._v("关闭服务器。停止接收新的客户端连接，关闭当前连接，并执行注册的销毁方法。")]),t._v(" "),e("h3",{attrs:{id:"isrunning"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#isrunning"}},[t._v("#")]),t._v(" isRunning()")]),t._v(" "),e("p",[t._v("检查服务器是否正在运行。")]),t._v(" "),e("h3",{attrs:{id:"adddestroymethod-runnable-runnable"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#adddestroymethod-runnable-runnable"}},[t._v("#")]),t._v(" addDestroyMethod(Runnable runnable)")]),t._v(" "),e("p",[t._v("添加一个在服务器关闭时执行的方法。这允许开发者注册自定义的资源清理逻辑。")]),t._v(" "),e("h2",{attrs:{id:"常用类解释"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#常用类解释"}},[t._v("#")]),t._v(" 常用类解释")]),t._v(" "),e("ol",[e("li",[e("p",[e("strong",[e("code",[t._v("tioServer")])]),t._v(": 这可能是 T-io 服务器的一个实例。它作为服务器的中心运行点，处理进来的连接、数据以及管理资源。")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("wsServerConfig")])]),t._v(": 这代表 WebSocket 服务配置。它包含与 WebSocket 协议相关的设置，如连接超时时间、消息缓冲区大小等。")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("httpConfig")])]),t._v(": 类似于"),e("code",[t._v("wsServerConfig")]),t._v(" 代表 HTTP 服务配置。包括最大头部大小、会话超时时间等设置。")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("defaultHttpRequestHandlerDispather")])]),t._v(": 这是处理 HTTP 请求的默认分发器。它定义了如何处理和路由进来的 HTTP 请求。tio-boot 启动时会设置为 com.litongjava.tio.boot.http.handler.DefaultHttpRequestHandlerDispather")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("defaultHttpServerInterceptorDispatcher")])]),t._v(": 这代表 HTTP 拦截器的分发器，可以拦截并处理 HTTP 请求和响应，tio-boot 启动时会设置为 com.litongjava.tio.boot.http.interceptor.DefaultHttpServerInterceptorDispatcher")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("defaultWebSocketHandlerDispather")])]),t._v(": 这代表 websocket 的分发器，它定义了如何处理进来的 WebSocket 消息。tio-boot 启动时会设置为 com.litongjava.tio.boot.websocket.handler.DefaultWebSocketHandlerDispather")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("serverInteceptorConfigure")])]),t._v(": 这是服务器拦截器的配置设置，允许你为所有进来的请求或消息定义全局规则或行为。需要配合 DefaultHttpRequestHandlerDispather 使用")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("webSocketRoutes")])]),t._v(": 定义 WebSocket 连接的路由，每个路由都与不同的行为或处理逻辑相关联。需要配合 DefaultWebSocketHandlerDispather 使用")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("tioBootServerListener")])]),t._v(": 这个监听器可能处理与服务器生命周期相关的事件，比如服务器启动、停止或遇到错误时。")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("tioBootHttpRoutes")])]),t._v(": 管理 tio-boot http controller 的路由。每个路由指定了不同 HTTP 路径应该如何处理。")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("httpRoutes")])]),t._v(": 管理 tio http server hanlder 的路由")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("serverTcpHandler")])]),t._v(": 处理 TCP 连接。它负责处理通过 TCP 连接接收到的数据，并可能发送响应。")])]),t._v(" "),e("li",[e("p",[e("strong",[e("code",[t._v("serverAioListener")])]),t._v(": 请求 的监听器。这如接受连接、断开连接等.")])])]),t._v(" "),e("h2",{attrs:{id:"设置和获取配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#设置和获取配置"}},[t._v("#")]),t._v(" 设置和获取配置")]),t._v(" "),e("p",[t._v("上面这些熟悉都提供了静态的 get 和 set 方法,你可以在需要的时候获取配置或者设置自定义的配置")])])}),[],!1,null,null,null);e.default=v.exports}}]);