# 集合分页 PageUtils

`PageUtils` 为内存中的 List、Set 和 SetWithLock 提供分页，可选转换器只处理当前页的数据。

```java
import java.util.Arrays;
import nexus.io.model.page.Page;
import nexus.io.tio.utils.page.PageUtils;

public class PageExample {
  public Page<Integer> secondPage() {
    return PageUtils.fromList(Arrays.asList(1, 2, 3, 4, 5), 2, 2);
    // list=[3,4], pageNumber=2, pageSize=2, totalRow=5, totalPage=3
  }
}
```

## 参数和结果约定

- 页码从 1 开始，非正页码按 1 处理。
- 正数 `pageSize` 保留调用方指定的值，即使总记录数小于它。末页数据条数由 `getList().size()` 获取。
- 非正 `pageSize` 表示单页容纳整个集合；空集合采用有效页大小 1。
- 超出数据范围的页码返回空列表，仍保留总记录数和总页数。计算索引时使用长整型中间值，支持极大页码而不溢出。
- 空集合返回空列表、总记录数 0 和总页数 0；输入集合为 `null` 时返回 `null`。
- Set 按其迭代顺序分页。需要稳定顺序时，使用有明确顺序的集合，并保证分页期间的数据稳定。

`getTotalPage()` 可直接用于页数展示，`isLastPage()` 使用页码与总页数比较。集合分页不会发起数据库查询，也不会关闭或销毁原集合。
