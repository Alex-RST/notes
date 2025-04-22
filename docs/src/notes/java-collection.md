# Java集合框架
## 1. Stream
### 1.1 Stream种类
1. **并行流**：Stream#parallel();
2. **无序流**：Stream#unordered();
3. **顺序流**：Stream#sequential();

### 1.2 Stream常用操作
**中间操作**
  -  limit();
  -  skip();
  -  distinct();
  -  map();
  -  flatMap();
  -  filter();
  -  sort();
  -  peek();

**终结操作**
  - max();
  - min();
  - foreach();
  - count();
  - collect();
  - reduce();
  - findFirst();
  - findAny();
  - anyMatch();
  - allMatch();
  - noneMatch();

**获取流**
  1. Collection#stream();
  2. Arrays.stream();

**常用下游收集器**
|方法名|描述|
|-|-|
|mapping(x -> y，dc) |将x转换为y，用下游收集器dc收集|
|flatMapping(x -> substream, dc)|将x转换为substream，用下游收集器dc收集|
|filtering(x -> boolean, dc)|过滤后，用下游收集器dc收集|
|counting()|求个数|
|mingBy((a, b) -> int)|求最小值|
|maxBy((a, b) -> int)|求最大值|
|summingInt(x -> int)|转int后求和|
|reducing(init, (p, x) -> r)|init初始值，用上次结果和当前元素x生成本次结果|

**自定义收集器**
Colector.of();

**常见函数式接口**
 - Supplier（生产者接口）
 - Consumer（消费者接口）
 - Predicate（谓词接口，用于判断）
 - Function（转换接口，类型转换）
 - BiConsumer
 - BiPredicate
 - BiFunction
