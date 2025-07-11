# 第1章 走进Java

## `Java` 技术体系
**根据 `Java` 各个组成部分的功能划分**
- `Java` 程序设计语言
- 各种硬件平台上的 `Java` 虚拟机实现
- `Class` 文件格式
- `Java` 类库 `API`
- 来自商业机构的开源社区的第三方 `Java` 库

**根据技术服务的领域划分**
- `Java Card`。支持Java小程序运行在小内存设备上的平台。
- `Java ME`。支持Java程序在移动终端上运行的平台。
- `Java SE`。支持面向桌面级应用开发的平台。
- `Java EE`。支持使用多层架构的企业级平台

**`Java`技术体系所包括的内容**
![java-system](/know-jvm/part-1/unit-01/java-system.png)

## Java虚拟机家族
首先明确一点 `JAVA虚拟机` &ne; `HotSpot`。在历史上曾涌现了多种经典，特色的虚拟机实现。

- 虚拟机始祖：Sun Classic/Exact VM。  
  **准确式内存管理**：Exact VM使用准确式内存管理，即虚拟机可以知道内存中某个位置的数据具体是什么类型。
- 武林盟主：HotSpot VM
- 小家碧玉：Mobile/Embedded VM
- 天下第二：BEA JRockit/IBM J9 VM
- 软硬合璧：BEA Liquid VM/Azul VM
- 挑战者：Apache Harmony/GoogleAndroid Dalvik VM
- 没有成功：但并非失败：Microsoft JVM 及 其他
