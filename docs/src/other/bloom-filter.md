# 布隆过滤器
## 简介
&emsp;&emsp;布隆过滤器（Bloom Filter）是1970年由布隆提出的。它实际上是一个很长的二进制向量和一系列随机映射函数。布隆过滤器可以用于检索一个元素是否在一个集合中。它的优点是空间效率和查询时间都比一般的算法要好的多，缺点是有一定的误识别率和删除困难。

&emsp;&emsp;上面这句介绍比较全面的描述了什么是布隆过滤器，如果还是不太好理解的话，就可以把布隆过滤器理解为一个set集合，我们可以通过add往里面添加元素，通过contains来判断是否包含某个元素。由于本文讲述布隆过滤器时会结合Redis来讲解，因此类比为Redis中的Set数据结构会比较好理解，而且Redis中的布隆过滤器使用的指令与Set集合非常类似（后续会讲到）。

**优点：**
- 时间复杂度低，增加和查询元素的时间复杂为O(N)。（N为哈希函数的个数，通常情况比较小）；
- 保密性强，布隆过滤器不存储元素本身；
- 存储空间小，如果允许存在一定的误判，布隆过滤器是非常节省空间的（相比其他数据结构如Set集合）。

**缺点：**
- 有点一定的误判率，但是可以通过调整参数来降低；
- 无法获取元素本身；
- 很难删除元素。

## 原理
### 数据结构
&emsp;&emsp;布隆过滤器它实际上是一个很长的**二进制向量和一系列随机映射函数**。以Redis中的布隆过滤器实现为例，Redis中的布隆过滤器底层是一个大型位数组（二进制数组）+ 多个无偏hash函数。

**一个大型位数组（二进制数组）：**
![Bloom Filter](/other/bloom-filter/bloom-filter-binaryArray.png)

**多个无偏hash函数：**   
&emsp;&emsp;无偏hash函数就是能把元素的hash值计算的比较均匀的hash函数，能使得计算后的元素下标比较均匀的映射到位数组中。
如下就是一个简单的布隆过滤器示意图，其中k1、k2代表增加的元素，a、b、c即为无偏hash函数，最下层则为二进制数组。
![Bloom Filter](/other/bloom-filter/bloom-filter-hashFunc.png)

### 空间计算
&emsp;&emsp;在布隆过滤器增加元素之前，首先需要初始化布隆过滤器的空间，也就是上面说的二进制数组，除此之外还需要计算无偏hash函数的个数。布隆过滤器提供了两个参数，分别是预计加入元素的大小n，运行的错误率f。布隆过滤器中有算法根据这两个参数会计算出二进制数组的大小l，以及无偏hash函数的个数k。它们之间的关系比较简单：
- 错误率越低，位数组越长，控件占用较大
- 错误率越低，无偏hash函数越多，计算耗时较长

## 使用场景
&emsp;&emsp;布隆过滤器可以告诉我们 “某样东西一定不存在或者可能存在”，也就是说布隆过滤器说这个数不存在则一定不存，布隆过滤器说这个数存在可能不存在（误判，后续会讲），利用这个判断是否存在的特点可以做很多有趣的事情。
- 解决[Redis缓存穿透](./redis.md#缓存穿透)问题（面试重点）
- 邮件过滤，使用布隆过滤器来做邮件黑名单过滤
- 对爬虫网址进行过滤，爬过的不再爬
- 解决新闻推荐过的不再推荐(类似抖音刷过的往下滑动不再刷到)
- HBase\RocksDB\LevelDB等数据库内置布隆过滤器，用于判断数据是否存在，可以减少数据库的IO请求

## 简单实现（Java）
```java
public class BloomFilter {

    private static final int DEFAULT_SIZE = 1000;
    private BitSet bitSet;
    private int[] hashSeeds;
    private int size;

    public BloomFilter(int size, int... hashSeeds) {
        this.size = size;
        this.bitSet = new BitSet(size);
        this.hashSeeds = hashSeeds;
    }

    public void add(String value) {
        for (int seed : hashSeeds) {
            int hash = hash(value, seed);
            bitSet.set(hash);
        }
    }

    public boolean contains(String value) {
        for (int seed : hashSeeds) {
            int hash = hash(value, seed);
            if (!bitSet.get(hash)) {
                return false;
            }
        }
        return true;
    }

    private int hash(String value, int seed) {
        int hash = 0;
        for (char c : value.toCharArray()) {
            hash = seed * hash + c;
        }
        return (hash & 0x7fffffff) % size;
    }

    public static void main(String[] args) {
        BloomFilter filter = new BloomFilter(DEFAULT_SIZE, 3, 5, 7);

        filter.add("hello");
        filter.add("world");

        System.out.println(filter.contains("hello")); // true
        System.out.println(filter.contains("world")); // true
        System.out.println(filter.contains("java")); // false
    }
}
```