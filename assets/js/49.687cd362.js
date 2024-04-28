(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{421:function(e,t,s){"use strict";s.r(t);var a=s(10),n=Object(a.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h3",{attrs:{id:"接收日期类型参数"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#接收日期类型参数"}},[e._v("#")]),e._v(" 接收日期类型参数")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('  @RequestPath(value = "/date")\n  public HttpResponse date(Date[] date, java.sql.Date[] sqlDate, java.sql.Timestamp[] timestamp, HttpRequest request) throws Exception {\n    HttpResponse ret = Resps.json(request, Json.toFormatedJson(date) + Json.toFormatedJson(sqlDate) + Json.toFormatedJson(timestamp));\n    return ret;\n  }\n')])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br")])]),t("p",[e._v("这段代码定义了一个 Web 请求处理方法 "),t("code",[e._v("date")]),e._v("，映射到 URL 路径 "),t("code",[e._v("/date")]),e._v("。它接收四个参数：一个 "),t("code",[e._v("Date")]),e._v(" 类型的数组 "),t("code",[e._v("date")]),e._v("，一个 "),t("code",[e._v("java.sql.Date")]),e._v(" 类型的数组 "),t("code",[e._v("sqlDate")]),e._v("，一个 "),t("code",[e._v("java.sql.Timestamp")]),e._v(" 类型的数组 "),t("code",[e._v("timestamp")]),e._v("，以及一个 "),t("code",[e._v("HttpRequest")]),e._v(" 对象 "),t("code",[e._v("request")]),e._v("。")]),e._v(" "),t("p",[e._v("方法的主体创建并返回一个 "),t("code",[e._v("HttpResponse")]),e._v(" 对象。这个响应是使用 "),t("code",[e._v("Resps.json")]),e._v(" 方法生成的，它将 "),t("code",[e._v("date")]),e._v("、"),t("code",[e._v("sqlDate")]),e._v(" 和 "),t("code",[e._v("timestamp")]),e._v(" 数组转换为格式化的 JSON 字符串，并将它们串联起来。这样，当访问对应的 URL 时，此方法将返回这些日期和时间数组的 JSON 表示形式。")])])}),[],!1,null,null,null);t.default=n.exports}}]);