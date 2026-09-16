# 19_redis

本章集中介绍 Redis 安装、接入、RedisPlugin / RedisDb API、数据操作、序列化互通及两级缓存。先完成 Docker 安装与连接验证，再阅读 java-db 整合，并根据项目选用 Jedis、Hutool 或 Redisson。

本章区分 java-db 的 RedisDb 和 tio-utils 的 TioRedisCache；历史版本的类型名不可直接混用。

## 阅读目录

- [使用 Docker 安装 Redis](./00.md)
- [使用 java-db 整合 Redis](./01.md)
- [Java DB Redis 相关 Api](./02.md)
- [redis 使用示例](./03.md)
- [和 RedisTemplate 协作](./04.md)
- [使用 Jedis 连接池接入 Redis](./05.md)
- [hutool RedisDS](./06.md)
- [Redisson](./07.md)
- [Caffeine 与 Redis 两级缓存](./08.md)
- [使用 CacheUtils 整合 caffeine 和 redis 实现的两级缓存](./09.md)
