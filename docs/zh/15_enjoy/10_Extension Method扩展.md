# Extension Method 扩展

Extension Method 用于对已存在的类在其外部添加扩展方法，该功能类似于 ruby 语言中的 mixin 特性。

Enjoy 默认已经为 BigDecimal、BigInteger、String、Integer、Long、Float、Double、Short、Byte 这 9 个常用的 java 类型，添加了 toBigDecimal()、toBigInteger()、toInt()、toLong()、toFloat()、toDouble()、toBoolean()、toShort()、toByte() 9 个 extension method。以下是使用示例：

```
#set(age = "18")
#if(age.toInt() >= 18)
   join to the party
#end
```

上例第一行代码中的 age 为 String 类型，由于 String 被添加了 toInt() 扩展方法，所以调用其 toInt() 方法后便可与后面的 Integer 型的值 18 进行比较运算。

注意：BigDecimal、BigInteger 添加于 5.1.2 版本，使用时需要升级到该版本或者自己扩展。

Extension Method 特性有两大应用场景，第一个应用场景是为 java 类库中的现存类进行功能性扩展，下面给出一个为 Integer 添加扩展方法的例子：

```
public class MyIntegerExt {
  public Integer square(Integer self) {
    return self * self;
  }

  public Double power(Integer self, Double exponent) {
    return Math.pow(self, exponent);
  }

  public Boolean isOdd(Integer self) {
    return self % 2 != 0;
  }
}
```

如上面代码所示，由于是对 Integer 进行扩展，所以上述三个扩展方法中的第一个参数必须是 Integer 类型，以便调用该方法时让这个参数承载调用者自身。其它参数可以是任意类型，例如上述 power 方法中的 exponent 参数。扩展方法至少要有一个参数。以下代码是对上述扩展方法进行配置：

```
Engine.addExtensionMethod(Integer.class, MyIntegerExt.class);
```

上述代码第一个参数 Integer 是被扩展的类，第二个参数 MyIntegerExt 是扩展类，通过上面简单的两步，即可在模板中使用：

```
#set(num = 123)
#(num.square())
#(num.power(10D))
#(num.isOdd())
```

上述代码第二、三、四行调用了 MyIntegerExt 中的三个扩展方法，分别实现了对 123 的求平方、求 10 次方、判断是否为奇数的功能。

如上例所示，extension method 可以在类自身以外的地方对其功能进行扩展，在模板中使用时的书写也变得非常方便。

Extension Method 的另一个重要的应用场景，是将不确定类型变得确定，例如 Controller.keepPara()方法会将所有参数当成 String 的类型来 keep 住，所以表单中的 Integer 类型在 keepPara()后变成了 String 型，引发模板中的类型不正确异常，以下是解决方案：

```
<select name="type">
  #for(x : list)
    <option value="#(x.type)" #if(x.type == type.toInt()) selected #end />
  #end
</select>
```

假定 type 为 Integer 类型，上面的 select 域在表单提交后，如果在后端使用了 keepPara()，那么再次渲染该模板时 type 会变为 String 类型，从而引发类型不正确异常，通过 type.toInt()即可解决。当然，你也可以使用 keepPara(Integer.class, “type”) 进行解决。
