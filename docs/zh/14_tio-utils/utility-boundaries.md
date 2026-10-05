# Base64 输入与锁等待

## Base64 的字符校验

`Base64Utils.decodeToBytes` 使用标准 Base64 字母表，要求输入长度是四的倍数，支持末尾的 `=` 补位。空字符串得到空字节数组。非法字符（包括中文等非 ASCII 字符）会抛出 `IllegalArgumentException`，调用方可以统一处理输入校验失败。

```java
import java.nio.charset.StandardCharsets;
import nexus.io.tio.utils.base64.Base64Utils;

public class Base64TextExample {
  public String roundTrip(String text) {
    byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
    String encoded = Base64Utils.encodeToString(bytes);
    return new String(Base64Utils.decodeToBytes(encoded), StandardCharsets.UTF_8);
  }
}
```

字节数组接口可用于任意二进制数据。字符串便捷接口沿用默认字符集；需要跨平台一致的文本编码时，推荐如上显式指定 UTF-8。`byteArrayToAltBase64` 和 `altDecodeToBytes` 配套使用框架的替代字母表，该字母表不是 URL-safe Base64，不应混用。

## 锁等待与线程中断

`LockUtils.runWriteOrWaitRead` 尝试获取写锁，获取成功时执行回调，并在回调结束或抛出异常后释放写锁。未获取写锁的线程进入读锁等待分支，便于多个调用者协调同一项工作；回调仅在获取写锁的分支执行。等待读锁超时后会返回，调用方应再次检查业务结果。

读锁等待被中断时，方法保留线程的中断状态并返回。调用方可以通过 `Thread.currentThread().isInterrupted()` 识别取消请求并停止后续工作。此行为适用于读锁等待阶段，并不承诺主动取消已经执行中的写回调。

```java
import nexus.io.tio.utils.lock.LockUtils;

public class LockWaitExample {
  public boolean runOrWait(String key, Runnable action) throws Exception {
    LockUtils.runWriteOrWaitRead(key, null, () -> action.run(), 5L);
    return !Thread.currentThread().isInterrupted();
  }
}
```

示例返回值只表示是否观察到中断，不表示回调一定执行，也不表示等待读锁一定成功。


## 同键锁的复用

`getLockObj` 与 `getReentrantReadWriteLock` 按键原子获取锁。myLock 参数保留用于调用兼容，创建过程由内部注册表统一协调，不要求调用方提供同一个监视器。

锁的生命周期跟随使用引用：调用方持有锁对象或读写锁句柄期间，同键查找复用同一实例，不受固定空闲时间影响。注册表使用弱引用，在锁无人引用且被垃圾回收后，后续访问可以清理对应条目，兼顾长期任务的互斥与动态键的资源管理。读锁与写锁句柄同时保留所属锁的引用。

调用方应在完整的加锁、操作和解锁期间保留取得的锁或句柄，并在 finally 中解锁。同名键协调的是当前 JVM 内的线程，不代替分布式锁。


## 图片 Data URL

`Base64Utils.encodeImage` 与 `decodeImage` 配合传递带 MIME 类型的二进制内容。解码接收 `data:类型/子类型[;参数=值];base64,数据`，保留 MIME 类型并返回解码字节；支持如 `charset=utf-8` 的附加参数。data 标记和 base64 标记不区分大小写。

```java
import nexus.io.tio.utils.base64.Base64Utils;
import nexus.io.tio.utils.encoder.ImageVo;

public class ImageDataUrlExample {
  public ImageVo roundTrip(byte[] pngBytes) {
    String dataUrl = Base64Utils.encodeImage(pngBytes, "image/png");
    return Base64Utils.decodeImage(dataUrl);
  }
}
```

输入需要包含 MIME 类型、base64 标记和非空数据。结构不符合要求、数据为空或 Base64 字符非法时，统一抛出 `IllegalArgumentException`，便于在请求入口集中处理。MIME 字段用于携带声明的类型；解码不检查字节是否为对应格式的图片，业务有此需求时应继续使用图片解码器校验。
