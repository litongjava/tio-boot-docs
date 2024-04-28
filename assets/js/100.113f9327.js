(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{471:function(a,n,e){"use strict";e.r(n);var s=e(10),t=Object(s.a)({},(function(){var a=this,n=a._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[n("h1",{attrs:{id:"tio-boot-jfinal-plugins-整合-ehcache"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#tio-boot-jfinal-plugins-整合-ehcache"}},[a._v("#")]),a._v(" tio-boot jfinal-plugins 整合 ehcache")]),a._v(" "),n("p",[a._v("Tio-boot 是一个基于 Java 的网络编程框架，用于快速开发高性能的网络应用程序。\nEhcache 是一个广泛使用的开源 Java 缓存，它可以提高应用程序的性能和扩展性。")]),a._v(" "),n("p",[a._v("整合 ecache 需要用到 jfinal-plugins\nhttps://central.sonatype.com/artifact/com.litongjava/jfinal-plugins")]),a._v(" "),n("h3",{attrs:{id:"添加依赖"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#添加依赖"}},[a._v("#")]),a._v(" 添加依赖")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v("<dependency>\n  <groupId>com.litongjava</groupId>\n  <artifactId>jfinal-plugins</artifactId>\n  <version>1.0.6</version>\n</dependency>\n<dependency>\n  <groupId>net.sf.ehcache</groupId>\n  <artifactId>ehcache-core</artifactId>\n  <version>2.6.11</version>\n</dependency>\n\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br")])]),n("h3",{attrs:{id:"添加配置文件-ehcache-xml"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#添加配置文件-ehcache-xml"}},[a._v("#")]),a._v(" 添加配置文件 ehcache.xml")]),a._v(" "),n("p",[n("code",[a._v("ehcache.xml")]),a._v(" 是 Ehcache 缓存的配置文件。EcachePlugin 启动时会自动加载这个配置,它定义了缓存的基本属性和行为。以下是文件中每个部分的详细解释：")]),a._v(" "),n("ol",[n("li",[n("p",[n("strong",[n("code",[a._v("<diskStore>")])]),a._v(": 指定磁盘存储的路径，用于溢出或持久化缓存数据到磁盘。")])]),a._v(" "),n("li",[n("p",[n("strong",[n("code",[a._v("<defaultCache>")])]),a._v(": 设置默认缓存的属性。这些属性将应用于未单独配置的所有缓存。")]),a._v(" "),n("ul",[n("li",[n("strong",[n("code",[a._v("eternal")])]),a._v(": 设置为 "),n("code",[a._v("false")]),a._v(" 表示缓存不是永久的，可以过期。")]),a._v(" "),n("li",[n("strong",[n("code",[a._v("maxElementsInMemory")])]),a._v(": 内存中可以存储的最大元素数量。")]),a._v(" "),n("li",[n("strong",[n("code",[a._v("overflowToDisk")])]),a._v(": 当内存中的元素数量超过最大值时，是否溢出到磁盘。")]),a._v(" "),n("li",[n("strong",[n("code",[a._v("diskPersistent")])]),a._v(": 是否在 JVM 重启之间持久化到磁盘。")]),a._v(" "),n("li",[n("strong",[n("code",[a._v("timeToIdleSeconds")])]),a._v(": 元素最后一次被访问后多久会变成空闲状态。")]),a._v(" "),n("li",[n("strong",[n("code",[a._v("timeToLiveSeconds")])]),a._v(": 元素从创建或最后一次更新后多久会过期。")]),a._v(" "),n("li",[n("strong",[n("code",[a._v("memoryStoreEvictionPolicy")])]),a._v(": 当内存达到最大值时，移除元素的策略（例如，LRU 表示最近最少使用）。")])])])]),a._v(" "),n("p",[a._v("ehcache.xml 配置文件内容如下")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v('<?xml version="1.0" encoding="UTF-8"?>\n<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n  xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd" updateCheck="false">\n\n  <diskStore path="java.io.tmpdir/EhCache" />\n\n  <defaultCache eternal="false" maxElementsInMemory="10000" overflowToDisk="false" diskPersistent="false"\n    timeToIdleSeconds="1800" timeToLiveSeconds="259200" memoryStoreEvictionPolicy="LRU" />\n</ehcache>\n')])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br")])]),n("h3",{attrs:{id:"ehcachepluginconfig-配置类"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#ehcachepluginconfig-配置类"}},[a._v("#")]),a._v(" EhCachePluginConfig 配置类")]),a._v(" "),n("p",[a._v("这个类是一个配置类，用于初始化和配置 EhCache 插件。它通过 @AConfiguration 注解标记为配置类。类中的方法 ehCachePlugin 通过 @ABean 注解标记为 Bean 方法,框架启动时会执行该方法并将返回值放到 bean 容器中。在这个方法中，创建了一个 Plugin 实例并启动它。destroyMethod 指定在服务关闭时将会调用该方法,关闭该插件")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v('package com.enoleap.manglang.pen.api.server.config;\n\nimport com.litongjava.jfinal.aop.annotation.ABean;\nimport com.litongjava.jfinal.aop.annotation.AConfiguration;\nimport com.litongjava.jfinal.plugin.ehcache.EhCachePlugin;\n\n@AConfiguration\npublic class EhCachePluginConfig {\n\n  @ABean(destroyMethod = "stop")\n  public EhCachePlugin ehCachePlugin() {\n    EhCachePlugin ehCachePlugin = new EhCachePlugin();\n    ehCachePlugin.start();\n    return ehCachePlugin;\n  }\n}\n')])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br"),n("span",{staticClass:"line-number"},[a._v("14")]),n("br"),n("span",{staticClass:"line-number"},[a._v("15")]),n("br"),n("span",{staticClass:"line-number"},[a._v("16")]),n("br")])]),n("p",[a._v("如果不想将 EhCachePlugin 放入 Aop 容器,你可以使用下面的配置类")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v("package com.enoleap.manglang.pen.api.server.config;\n\nimport com.litongjava.jfinal.aop.annotation.AConfiguration;\nimport com.litongjava.jfinal.aop.annotation.AInitialization;\nimport com.litongjava.jfinal.plugin.ehcache.EhCachePlugin;\nimport com.litongjava.tio.boot.server.TioBootServer;\n\n@AConfiguration\npublic class EhCachePluginConfig {\n\n  @AInitialization\n  public EhCachePlugin ehCachePlugin() {\n    EhCachePlugin ehCachePlugin = new EhCachePlugin();\n    ehCachePlugin.start();\n    TioBootServer.addDestroyMethod(ehCachePlugin::stop);\n    return ehCachePlugin;\n  }\n}\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br"),n("span",{staticClass:"line-number"},[a._v("14")]),n("br"),n("span",{staticClass:"line-number"},[a._v("15")]),n("br"),n("span",{staticClass:"line-number"},[a._v("16")]),n("br"),n("span",{staticClass:"line-number"},[a._v("17")]),n("br"),n("span",{staticClass:"line-number"},[a._v("18")]),n("br")])]),n("h3",{attrs:{id:"控制器"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#控制器"}},[a._v("#")]),a._v(" 控制器")]),a._v(" "),n("ol",[n("li",[n("p",[n("strong",[a._v("EhCacheTestController")]),a._v(":")]),a._v(" "),n("ul",[n("li",[a._v("这个控制器包含一个方法 "),n("code",[a._v("test01")]),a._v("，用于测试将数据添加到 EhCache 缓存中并从中检索数据。")]),a._v(" "),n("li",[a._v("在这个方法中，首先尝试从缓存中获取一个键值。如果不存在，它将计算一个新值并将其存储在缓存中。")]),a._v(" "),n("li",[a._v("这个控制器演示了如何使用 Ehcache 存储和检索简单的键值对。")])])]),a._v(" "),n("li",[n("p",[n("strong",[a._v("EhCacheController")]),a._v(":")]),a._v(" "),n("ul",[n("li",[a._v("这个控制器包含多个方法，用于与 Ehcache 进行更复杂的交互。")]),a._v(" "),n("li",[a._v("方法如 "),n("code",[a._v("getCacheNames")]),a._v(" 和 "),n("code",[a._v("getAllCacheValue")]),a._v(" 用于检索缓存中的信息，例如缓存名称或所有缓存的值。")]),a._v(" "),n("li",[a._v("其他方法允许按名称检索特定缓存的值，或者根据缓存名称和键检索特定的值。")]),a._v(" "),n("li",[a._v("这个控制器提供了更深入的视图，展示了如何管理和检查 Ehcache 中的数据。")])])])]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v('package com.litongjava.tio.web.hello.AController;\n\nimport com.litongjava.jfinal.plugin.ehcache.CacheKit;\nimport com.litongjava.tio.http.server.annotation.RequestPath;\n\nimport lombok.extern.slf4j.Slf4j;\n\n@Slf4j\n@RequestPath("/ecache/test")\npublic class EhCacheTestController {\n\n  public String test01() {\n    String cacheName = "student";\n    String cacheKey = "litong";\n\n    String cacheData = CacheKit.get(cacheName, cacheKey);\n\n    if (cacheData == null) {\n      String result = "001";\n      log.info("计算新的值");\n      CacheKit.put(cacheName, cacheKey, result);\n    }\n\n    return cacheData;\n  }\n\n}\n\n')])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br"),n("span",{staticClass:"line-number"},[a._v("14")]),n("br"),n("span",{staticClass:"line-number"},[a._v("15")]),n("br"),n("span",{staticClass:"line-number"},[a._v("16")]),n("br"),n("span",{staticClass:"line-number"},[a._v("17")]),n("br"),n("span",{staticClass:"line-number"},[a._v("18")]),n("br"),n("span",{staticClass:"line-number"},[a._v("19")]),n("br"),n("span",{staticClass:"line-number"},[a._v("20")]),n("br"),n("span",{staticClass:"line-number"},[a._v("21")]),n("br"),n("span",{staticClass:"line-number"},[a._v("22")]),n("br"),n("span",{staticClass:"line-number"},[a._v("23")]),n("br"),n("span",{staticClass:"line-number"},[a._v("24")]),n("br"),n("span",{staticClass:"line-number"},[a._v("25")]),n("br"),n("span",{staticClass:"line-number"},[a._v("26")]),n("br"),n("span",{staticClass:"line-number"},[a._v("27")]),n("br"),n("span",{staticClass:"line-number"},[a._v("28")]),n("br")])]),n("p",[a._v("访问测试 http://localhost/ecache/test/test01")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v('package com.litongjava.tio.web.hello.AController;\n\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nimport com.litongjava.jfinal.plugin.ehcache.CacheKit;\nimport com.litongjava.tio.http.server.annotation.RequestPath;\n\nimport net.sf.ehcache.Cache;\nimport net.sf.ehcache.CacheManager;\nimport net.sf.ehcache.Element;\n\n@RequestPath("/ecache")\npublic class EhCacheController {\n  public String[] getCacheNames() {\n    String[] cacheNames = CacheKit.getCacheManager().getCacheNames();\n    return cacheNames;\n  }\n\n  public Map<String, Map<String, Object>> getAllCacheValue() {\n    CacheManager cacheManager = CacheKit.getCacheManager();\n    String[] cacheNames = cacheManager.getCacheNames();\n    Map<String, Map<String, Object>> retval = new HashMap<>(cacheNames.length);\n    for (String name : cacheNames) {\n      Map<String, Object> map = cacheToMap(cacheManager, name);\n      retval.put(name, map);\n    }\n    return retval;\n\n  }\n\n  public Map<String, Object> getCacheValueByCacheName(String cacheName) {\n    CacheManager cacheManager = CacheKit.getCacheManager();\n    Map<String, Object> retval = cacheToMap(cacheManager, cacheName);\n    return retval;\n  }\n\n  public Object getCacheValueByCacheNameAndCacheKey(String cacheName, String key) {\n    Object object = CacheKit.get(cacheName, key);\n    return object;\n  }\n\n  private Map<String, Object> cacheToMap(CacheManager cacheManager, String name) {\n    Cache cache = cacheManager.getCache(name);\n    @SuppressWarnings("unchecked")\n    List<String> keys = cache.getKeys();\n    Map<String, Object> map = new HashMap<>(keys.size());\n    for (String key : keys) {\n      Element element = cache.get(key);\n      Object value = element.getObjectValue();\n      map.put(key, value);\n    }\n    return map;\n  }\n}\n')])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br"),n("span",{staticClass:"line-number"},[a._v("14")]),n("br"),n("span",{staticClass:"line-number"},[a._v("15")]),n("br"),n("span",{staticClass:"line-number"},[a._v("16")]),n("br"),n("span",{staticClass:"line-number"},[a._v("17")]),n("br"),n("span",{staticClass:"line-number"},[a._v("18")]),n("br"),n("span",{staticClass:"line-number"},[a._v("19")]),n("br"),n("span",{staticClass:"line-number"},[a._v("20")]),n("br"),n("span",{staticClass:"line-number"},[a._v("21")]),n("br"),n("span",{staticClass:"line-number"},[a._v("22")]),n("br"),n("span",{staticClass:"line-number"},[a._v("23")]),n("br"),n("span",{staticClass:"line-number"},[a._v("24")]),n("br"),n("span",{staticClass:"line-number"},[a._v("25")]),n("br"),n("span",{staticClass:"line-number"},[a._v("26")]),n("br"),n("span",{staticClass:"line-number"},[a._v("27")]),n("br"),n("span",{staticClass:"line-number"},[a._v("28")]),n("br"),n("span",{staticClass:"line-number"},[a._v("29")]),n("br"),n("span",{staticClass:"line-number"},[a._v("30")]),n("br"),n("span",{staticClass:"line-number"},[a._v("31")]),n("br"),n("span",{staticClass:"line-number"},[a._v("32")]),n("br"),n("span",{staticClass:"line-number"},[a._v("33")]),n("br"),n("span",{staticClass:"line-number"},[a._v("34")]),n("br"),n("span",{staticClass:"line-number"},[a._v("35")]),n("br"),n("span",{staticClass:"line-number"},[a._v("36")]),n("br"),n("span",{staticClass:"line-number"},[a._v("37")]),n("br"),n("span",{staticClass:"line-number"},[a._v("38")]),n("br"),n("span",{staticClass:"line-number"},[a._v("39")]),n("br"),n("span",{staticClass:"line-number"},[a._v("40")]),n("br"),n("span",{staticClass:"line-number"},[a._v("41")]),n("br"),n("span",{staticClass:"line-number"},[a._v("42")]),n("br"),n("span",{staticClass:"line-number"},[a._v("43")]),n("br"),n("span",{staticClass:"line-number"},[a._v("44")]),n("br"),n("span",{staticClass:"line-number"},[a._v("45")]),n("br"),n("span",{staticClass:"line-number"},[a._v("46")]),n("br"),n("span",{staticClass:"line-number"},[a._v("47")]),n("br"),n("span",{staticClass:"line-number"},[a._v("48")]),n("br"),n("span",{staticClass:"line-number"},[a._v("49")]),n("br"),n("span",{staticClass:"line-number"},[a._v("50")]),n("br"),n("span",{staticClass:"line-number"},[a._v("51")]),n("br"),n("span",{staticClass:"line-number"},[a._v("52")]),n("br"),n("span",{staticClass:"line-number"},[a._v("53")]),n("br"),n("span",{staticClass:"line-number"},[a._v("54")]),n("br"),n("span",{staticClass:"line-number"},[a._v("55")]),n("br"),n("span",{staticClass:"line-number"},[a._v("56")]),n("br")])]),n("p",[a._v("访问测试\nhttp://localhost/ecache/getCacheNames"),n("br"),a._v("\nhttp://localhost/ecache/getAllCacheValue")])])}),[],!1,null,null,null);n.default=t.exports}}]);