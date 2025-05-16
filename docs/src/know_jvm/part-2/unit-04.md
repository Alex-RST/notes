# 第4章 虚拟机性能监控和故障处理工具

## jps
- 列出正在运行的虚拟机进程
- `jps [ options ] [ hostid ]`

|options|explain|
|:---:|---|
|-q|只输出LVMID，省略主类的名称|
|-m|输出虚拟机进程启动时传递给主类main()函数的参数|
|-l|输出主类全名，如果进程是jar包，则输出jar包路径|
|-v|输出虚拟机进程启动时的JVM参数|

## jstat
- 用于监视虚拟机各种运行状态信息
- 格式：`jstat [ option vmid [interval[s|ms] [count]] ]`

| options | explain |
|:---:|---|
|-class|监视类加载、卸载数量、总空间以及类装载所耗费的时间|
|-gc|监视Java堆状况，包括Eden区、2个Survivor区、老年代、永久代等的容量已用空间，垃圾收集时间合计等信息|
|-gccapacity|监视内容与-gc基本相同，但输出主要关注Java堆各个区域使用到的最大、最小空间|
|-gcutil|监视内容与-gc基本相同，但输出主要关注已使用空间占总空间的百分比|
|-gccause|与-gcuti1功能一样，但是会额外输出导致上--次垃圾收集产生的原因|
|-gcnew|监视新生代垃圾收集状况|
|-gcnewcapacity|监视内容与-gcnew基本相同，输出主要关注使用到的最大、最小空间|
|-gcold|监视老年代垃圾收集状况|
|-gcoldcapacity|监视内容与-gcold基本相同，输出主要关注使用到的最大、最小空间|
|-gcpermcapacity|输出永久代使用到的最大、最小空间|
|-compiler|输出即时编译器编译过的方法、耗时等信息|
|-printcompilation|输出已经被即时编译的方法|

## jinfo
- 实时查看和调整虚拟机各项参数
- 格式：`jinfo [ option ] pid`

## jmap
- 生成堆转储快照
- 格式：`jmap [ option ] vmid`

| options | explain |
|:---:|---|
|-dump|生成Java堆转储快照。格式为-dump:[live.,lformat=b,file=`<filename>`,其中live子参数说明是否只dump出存活的对象|
|-finalizerinfo|显示在F-Queue中等待Finalizer线程执行finalize方法的对象。只在Linux/Solaris平台下有效|
|-heap|显示Java堆详细信息，如使用哪种回收器、参数配置、分代状况等。只在Linux/Solaris平台下有效|
|-histo|显示堆中对象统计信息，包括类、实例数量、合计容量|
|-permstat|以ClassLoader为统计口径显示永久代内存状态。只在Linux/Solaris平台下有效|
|-F|当虚拟机进程对-dump选项没有响应时，可使用这个选项强制生成dump快照。只在Linux/Solaris平台下有效|

## jstack
- 生成虚拟机当前时刻的线程快照（一般称为 `threaddump` 或者`javacore` 文件）
- 格式：`jstack [ option ] vmid`

| options | explain |
|:---:|---|
|-F|当正常输出的请求不被响应时，强制输出线程堆栈|
|-l|除堆栈外，显示关于锁的附加信息|
|-m|如果调用到本地方法的话，可以显示C/C++的堆栈|

## ...