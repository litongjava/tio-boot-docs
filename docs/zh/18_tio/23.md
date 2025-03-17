# 成员排序

## 内置排序

### 实现 Comparator 比较器

为了对 `ChannelContext` 对象进行排序，可以实现 `Comparator` 接口。以下是 `ChannelContextComparator` 的实现，它按照连接的创建时间和唯一标识符（ID）对 `ChannelContext` 进行排序：

```java
package xxx;

import java.util.Comparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.tio.core.ChannelContext;
import cn.hutool.core.util.StrUtil;

/**
 * 自定义比较器，用于对 ChannelContext 进行排序
 */
public class ChannelContextComparator implements Comparator<ChannelContext> {
    private static final Logger log = LoggerFactory.getLogger(ChannelContextComparator.class);

    // 单例模式
    public static final ChannelContextComparator me = new ChannelContextComparator();

    // 私有构造方法
    private ChannelContextComparator() {}

    /**
     * 比较方法
     * o2 在前面请返回 1
     * o1 在前面请返回 -1
     */
    @Override
    public int compare(ChannelContext o1, ChannelContext o2) {
        return compareWhenEqual(o1, o2);
    }

    /**
     * 当都为游客或为同一个用户时，比较创建时间和唯一 ID
     * o2 在前面请返回 1
     * o1 在前面请返回 -1
     */
    private int compareWhenEqual(ChannelContext o1, ChannelContext o2) {
        if (o2.stat.timeCreated > o1.stat.timeCreated) { // 后进的在前面（o2 在前面）
            return 1;
        } else if (o2.stat.timeCreated < o1.stat.timeCreated) { // 先进的在前面（o1 在前面）
            return -1;
        } else {
            String cid1 = o1.getId();
            String cid2 = o2.getId();
            return StrUtil.compare(cid1, cid2, false); // 按照 ID 字符串进行比较
        }
    }
}
```

#### 说明

- **排序规则：**

  - 首先按照 `ChannelContext` 对象的 `timeCreated` 进行排序，较晚创建的对象排在前面。
  - 如果 `timeCreated` 相同，则按 `ChannelContext` 的 ID 进行字符串比较。

- **单例模式：**  
  `ChannelContextComparator` 使用了单例模式，确保整个系统中只存在一个比较器实例。

### 初始化时设置比较器

在 `ServerTioConfig` 中，将 `ChannelContextComparator` 设置为群组的比较器，以确保群组内的元素按指定顺序排列：

```java
serverTioConfig.groups.setChannelContextComparator(ChannelContextComparator.me);
```

### 效果

通过这种方式，群组中的元素将按顺序存储，对于即时通讯（IM）应用中的群聊功能非常有用，可以实现按连接时间、用户 ID 等特定顺序排列用户，从而提供更好的用户体验。

## 参考文献

[tiocloud 文档资料](https://www.tiocloud.com/doc/tio/?pageNumber=1)
