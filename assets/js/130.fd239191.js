(window.webpackJsonp=window.webpackJsonp||[]).push([[130],{502:function(t,n,s){"use strict";s.r(n);var a=s(10),e=Object(a.a)({},(function(){var t=this,n=t._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"tio-boot-整合-okhttp"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#tio-boot-整合-okhttp"}},[t._v("#")]),t._v(" tio-boot 整合 okhttp")]),t._v(" "),n("h2",{attrs:{id:"将-okhttpclient-添加到-bean-容器"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#将-okhttpclient-添加到-bean-容器"}},[t._v("#")]),t._v(" 将 OkHttpClient 添加到 bean 容器")]),t._v(" "),n("p",[t._v("tio-boot 整合 okhttp 非常简单,只需要添加一个配置类将 okhttp3.OkHttpClient 放到 bean 容器中即可,配置示例如下")]),t._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("package ai.adsgency.api.config;\n\nimport java.util.concurrent.TimeUnit;\n\nimport com.litongjava.jfinal.aop.annotation.ABean;\nimport com.litongjava.jfinal.aop.annotation.AConfiguration;\n\nimport okhttp3.ConnectionPool;\nimport okhttp3.OkHttpClient;\nimport okhttp3.OkHttpClient.Builder;\n\n@AConfiguration\npublic class OkHttpClientConfig {\n\n  @ABean\n  public OkHttpClient config() {\n    Builder builder = new OkHttpClient().newBuilder();\n    // 连接池\n    builder.connectionPool(pool());\n    // 连接超时\n    builder.connectTimeout(120L, TimeUnit.SECONDS).readTimeout(120L, TimeUnit.SECONDS).build();\n    return builder.build();\n  }\n\n  private ConnectionPool pool() {\n    return new ConnectionPool(200, 5, TimeUnit.MINUTES);\n  }\n}\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br"),n("span",{staticClass:"line-number"},[t._v("17")]),n("br"),n("span",{staticClass:"line-number"},[t._v("18")]),n("br"),n("span",{staticClass:"line-number"},[t._v("19")]),n("br"),n("span",{staticClass:"line-number"},[t._v("20")]),n("br"),n("span",{staticClass:"line-number"},[t._v("21")]),n("br"),n("span",{staticClass:"line-number"},[t._v("22")]),n("br"),n("span",{staticClass:"line-number"},[t._v("23")]),n("br"),n("span",{staticClass:"line-number"},[t._v("24")]),n("br"),n("span",{staticClass:"line-number"},[t._v("25")]),n("br"),n("span",{staticClass:"line-number"},[t._v("26")]),n("br"),n("span",{staticClass:"line-number"},[t._v("27")]),n("br"),n("span",{staticClass:"line-number"},[t._v("28")]),n("br")])]),n("h2",{attrs:{id:"为什么要将-okhttpclient-添加到-bean-容器"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#为什么要将-okhttpclient-添加到-bean-容器"}},[t._v("#")]),t._v(" 为什么要将 OkHttpClient 添加到 bean 容器")]),t._v(" "),n("p",[t._v("将"),n("code",[t._v("OkHttpClient")]),t._v("实例放入容器有多个好处，这种做法在开发大型应用时尤其重要。"),n("code",[t._v("OkHttpClient")]),t._v("是一个能够处理 HTTP 请求的高效客户端，具有配置灵活、支持同步阻塞与异步处理 HTTP 请求等特点。以下是将"),n("code",[t._v("OkHttpClient")]),t._v("放入容器中的几个主要理由：")]),t._v(" "),n("ol",[n("li",[n("p",[n("strong",[t._v("重用连接和线程池")]),t._v("："),n("code",[t._v("OkHttpClient")]),t._v("实例在内部使用了连接池和线程池来优化资源使用和提高性能。通过将其作为单例（或者有限的几个实例）放入容器中，可以确保整个应用共享这些资源，避免了重复创建和销毁带来的开销，从而减少了内存占用和提高了性能。")])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("统一配置")]),t._v("：将"),n("code",[t._v("OkHttpClient")]),t._v("配置在容器中可以让你在一个地方集中管理其配置，如超时设置、连接池大小等。这样做不仅使配置更加集中、易于管理，还能确保整个应用使用的是一致的 HTTP 客户端行为。对于需要调整 HTTP 行为以适应不同环境（开发、测试、生产）的情况，这一点尤其有用。")])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("便于维护和测试")]),t._v("：通过依赖注入管理"),n("code",[t._v("OkHttpClient")]),t._v("，可以更容易地在不同的环境或测试场景下替换或模拟这个客户端。这对于编写单元测试和集成测试尤其重要，因为你可以注入一个配置了不同行为（如模拟服务器响应）的客户端，而不用改变测试代码外的实际代码。")])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("减少资源泄漏的风险")]),t._v("：正确管理"),n("code",[t._v("OkHttpClient")]),t._v("实例（如通过容器确保其生命周期）有助于防止资源泄漏，例如忘记关闭连接。框架层面的管理有助于自动化这一过程，减少因错误使用 API 导致的问题。")])]),t._v(" "),n("li",[n("p",[n("strong",[t._v("提高开发效率")]),t._v("：最后，通过框架自动管理这些依赖项，开发者可以专注于业务逻辑而不是管理底层的 HTTP 通信细节，从而提高开发效率。")])])]),t._v(" "),n("p",[t._v("总的来说，将"),n("code",[t._v("OkHttpClient")]),t._v("放入容器中是一种最佳实践，它有助于优化应用的性能和资源使用，同时提高了代码的可维护性和测试性。")])])}),[],!1,null,null,null);n.default=e.exports}}]);