# Redis

## 数据类型
- String
- List
- Hash
- Set
- Zset
- Geospatial
- Hyperloglog
- Bitmap：位存储

## 常见问题
### 缓存穿透
**产生原因**：
客户端请求的数据在缓存中和数据库中都不存在，这样缓存永远不会生效，这些请求都会访问数据库。导致DB的压力瞬间变大而卡死或者宕机。
- 大量的高并发的请求打在redis上
- 这些请求发现redis上并没有需要请求的资源，redis命中率降低
- 因此这些大量的高并发请求转向DB请求对应的资源
- DB压力瞬间增大，直接将DB打垮，进而引发一系列“灾害”。  
  
**解决方案**：
- [布隆过滤器](./bloom-filter.md "布隆过滤器")。使用BitMap作为布隆过滤器，将目前所有可以访问到的资源通过简单的映射关系放入到布隆过滤器中（哈希计算），当一个请求来临的时候先进行布隆过滤器的判断，如果有那么才进行放行，否则就直接拦截。
- **接口校验**。类似于用户权限的拦截，对于id = -3872这些无效访问就直接拦截，不允许这些请求到达Redis、DB上。
- **对空值进行缓存**。比如，虽然数据库中没有id = 1022的用户的数据，但是在redis中对其进行缓存（key=1022, value=null），这样当请求到达redis的时候就会直接返回一个null的值给客户端，避免了大量无法访问的数据直接打在DB上。
- **实时监控**。对redis进行实时监控，当发现redis中的命中率下降的时候进行原因的排查，配合运维人员对访问对象和访问数据进行分析查询，从而进行黑名单的设置限制服务(拒绝黑客攻击)。

### 缓存击穿
  热点key扛着大并发，当热点key失效时，一瞬间大量请求冲击持久层数据库。

### 缓存雪崩
  当redis中的大量key集体过期，可以理解为Redis中的大部分数据都清空/失效了，这时候如果有大量并发的请求来到，Redis就无法进行有效的响应（命中率急剧下降），也会导致DB先生的绝望。
  缓存雪崩的场景通常有两个：
  1. 大量热点key同时过期；
  2. 缓存服务故障或宕机；

## 操作
### string
- set [key] [value]
- setex [key] [time] [value]
- setnx [key] [value]
- get [key]
- incr [key]
- incrby [key] [num]
- decr [key] [num]
- decrby [key] [num]
- getrange [key] [start-index] [end-index]
- setrange [key] [start-index] [newValue]
- getset [key] [value]

### list
- lrange 
```sh
lrange [key] [start-index] [last-index]
e.g lrange list-name 0 1 （取出索引0到1的两个元素，包括头和尾的元素）
```
- lpush, rpush：左插入，有插入元素
```sh
lpush [key] [value]
rpush [key] [value]
```
- lpop，rpop：左取出，右取出元素
```sh
lpop [key]
rpop [key]
```
- lindex：查询指定下标元素
```sh
lindex [key] [index]
```
- llen：查询list列表长度（元素个数）
```sh
llen [key]
```

### set
- sadd（添加）
- smembers（查看所有元素）
- sismember（判断是否存在）
- scard（查看长度）
- srem（移除指定元素）
- sinter（交集）
- sunion（并集）
- sdiff（差集）

### hash
- hset（添加hash）
- hget（查询）
- hgetall（查询所有）
- hdel（删除hash中指定的值）
- hlen（获取hash的长度）s
- hexists（判断key是否存在）操作
- hkeys（获取所有key）
- hvals（获取所有value）
- hincrby（给值加增量）
- hsetnx（存在不添加）

### zset
- zadd（添加）
- zrange（查询）
- zrangebyscore（排序小-大）
- zrevrange（排序大-小）
- zrangebyscore withscores（查询所有值包含key）
- zrem（移除元素）
- zcard（查看元素个数）
- zcount（查询指定区间内的元素个数）

### 其他常用操作
- type [key]
- select [database]
- keys *
- expire [key] [time]
- ttl [key]
- exists [key]
- del [key]
- move [key] [database]
- flushall
- clear

### 服务器操作
- config set requirepass [pwd]
- auth [pwd]