# Shared Object 扩展

通过使用 addSharedObject 方法，将某个具体对象添加为共享对象，可以全局进行使用，以下是代码示例：

```
public void configEngine(Engine me) {
   me.addSharedObject("RESOURCE_HOST", "http://res.jfinal.com");
   me.addSharedObject("StrKit", new com.jfinal.kit.StrKit());
}
```

以上代码中的第二行，添加了一个名为 RESOURCE_HOST 的共享对象，而第三行代码添加了一个名为 StrKit 的共享对象，以下是在模板中的使用例子：

```
<img src="#(RESOURCE_HOST)/img/girl.jpg" />
#if(StrKit.isBlank(title))
   ...
#end
```

以上代码第一行中使用输出指令输出了 RESOUCE_HOST 这个共享变量，对于大型 web 应用系统，通过这种方式可以很方便地规划资源文件所在的服务器。以上第二行代码调用了名为 StrKit 这个共享变量的 isBlank 方法，使用方式符合开发者直觉。

注意：由于对象被全局共享，所以需要注意线程安全问题，尽量只共享常量以及无状态对象。
