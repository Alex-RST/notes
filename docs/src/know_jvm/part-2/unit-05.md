# 第5章 调优案例分析与实战

## 大内存硬件上的程序部署策略
- 通过一个单独的 Java 虚拟机实例来管理大量的 Java 堆内存。
- 同时使用若干个 Java 虚拟机，建立逻辑集群来利用硬件资源。