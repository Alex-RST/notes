# 附录一 虚拟机（HotSpot）常见参数表
| 参数 | 作用 | 用法 |
| --- | --- | --- |
|-XX:FieldsAllocationStyle| 对象属性在内存中的分配策略（如属性的顺序） |  |
|-Xnoclassgc|是否回收无用的类型|  |
|-verbose:class|查看类加载和卸载信息（`Product`版的`HotSpot`）||
|-XX:+TraceClass-Loading|查看类加载和卸载信息（`Product`版的`HotSpot`）||
|-XX:+TraceClassUnLoading|查看类加载和卸载信息（`FastDebug`版的`HotSpot`）||
|-Dcom.sun.management.jmxremote|开启`JMX`管理功能(JDK6及以上已默认开启)||
|-XX:MetaspaceSize|设置元空间初始大小（单位：字节）||
|-XX:MaxMetaspaceSize|设置最大元空间大小（单位：字节；默认-1，不受限制）||
|-XX:PermSize|设置永久代初始空间（JDK6及以下）||
|-XX:MaxPermSize|设置永久代最大空间（JDK6及以下）||
|-XX:MinMetaspaceFreeRatio|在垃圾收集之后控制最小的元空间剩余容量的百分比，可减少因为元空间不足导致的垃圾收集的频率||
|-XX:MaxMetaspaceFreeRatio|控制最大的元空间剩余容量的百分比||
|-XX:MaxDirectMemorySize|控制直接内存（Direct Memory）的容量大小||
|-Xms,-Xmx|堆的最小值与最大值||
|-Xss|设置栈容量|-Xss256k，-Xss1m等|