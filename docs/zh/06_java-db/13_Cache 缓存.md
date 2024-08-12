# Cache 缓存

### 1、使用 Ehcache 缓存

ActiveRecord 可以使用缓存以大大提高性能，默认的缓存实现是 ehcache，使用时需要引入 ehcache 的 jar 包及其配置文件，以下代码是 Cache 使用示例：

```
public void list() {
    List<Blog> blogList = Blog.dao.findByCache("cacheName", "key", "select * from blog");
    setAttr("blogList", blogList).render("list.html");
}
```

上例 findByCache 方法中的 cacheName 需要在 ehcache.xml 中配置如：<cache name="cacheName" …>。此外 Model.paginateByCache(…)、Db.findByCache(…)、Db.paginateByCache(…)方法都提供了 cache 支持。在使用时，只需传入 cacheName、key 以及在 ehccache.xml 中配置相对应的 cacheName 就可以了。

### 2、使用任意缓存实现

除了要把使用默认的 ehcache 实现以外，还可以通过实现 ICache 接口切换到任意的缓存实现上去，下面是个简单提示意性代码实现：

```
public class MyCache implements ICache {
  public <T>T get(String cacheName, Object key) {
  }

  public void put(String cacheName, Object key, Object value) {
  }

  public void remove(String cacheName, Object key) {
  }

  public void removeAll(String cacheName) {
  }
}
```

如上代码所示，MyCache 需要实现 ICache 中的四个抽象方法，然后通过下面的配置方式即可切换到自己的 cache 实现上去：

```
ActiveRecordPlugin arp = new ActiveRecordPlugin(...);
arp.setCache(new MyCache());
```

如上代码所示，通过调用 ActiveRecordPlugin.setCache(...) 便可切换 cache 实现。
