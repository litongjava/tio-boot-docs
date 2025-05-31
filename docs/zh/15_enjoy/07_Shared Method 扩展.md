# Shared Method 扩展

### 1､基本用法

Enjoy 模板引擎可以极其简单的直接使用任意的 java 类中的 public 方法，并且被使用的 java 类无需实现任何接口也无需继承任何抽象类，完全无耦合。以下代码以 JFinal 之中的 com.jfinal.kit.StrKit 类为例：

```
public void configEngine(Engine me) {
   me.addSharedMethod(new com.jfinal.kit.StrKit());
}
```

以上代码已将 StrKit 类中所有的 public 方法添加为 shared method，添加完成以后便可以直接在模板中使用，以下是代码示例：

```
#if(isBlank(nickName))
   ...
#end

#if(notBlank(title))
   ...
#end
```

上例中的 isBlank 和 notBlank 方法都来自于 StrKit 类，这种扩展方式简单、便捷、无耦合。

### 2、默认 Shared Method 配置扩展

Enjoy 模板引擎默认配置添加了 com.jfinal.template.ext.sharedmethod.SharedMethodLib 为 Shared Method，所以其中的方法可以直接使用不需要配置。里头有 isEmpty(...) 与 notEmpty(...) 两个方法可以使用。

isEmpty(...) 用来判断 Collection、Map、数组、Iterator、Iterable 类型对象中的元素个数是否为 0，其规如下：

- null 返回 true

- List、Set 等一切继承自 Collection 的，返回 isEmpty()

- Map 返回 isEmpty()

- 数组返回 length == 0

- Iterator 返回 ! hasNext()

- Iterable 返回 ! iterator().hasNext()

以下是代码示例：

```
#if ( isEmpty(list) )
    list 中的元素个数等于 0
#end

#if ( notEmpty(map) )
    map 中的元素个数大于 0
#end
```

如上所示，isEmpty(list) 判断 list 中的元素是否大于 0。notEmpty(...) 的功能与 isEmpty(...) 恰好相反，等价于 ! isEmpty(...)
