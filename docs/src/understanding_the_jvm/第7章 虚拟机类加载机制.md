# 第7章 虚拟机类加载机制
## 7.1 类加载的时机
&emsp;&emsp;一个类型（Class、Interface、二进制流形式的class文件等）从被虚拟机加载到内存中开始，到卸载出内存为止，它的整个生命周期会经历**七个阶段**，分别是：**加载（Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化（Initializaion）、使用（Using）、卸载（Unloading）**。其中验证、准备、解析三个部分统称
为**连接**。