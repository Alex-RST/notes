# 第7章 虚拟机类加载机制

## 类加载的时机
一个类型（Class、Interface、二进制流形式的class文件等）从被虚拟机加载到内存中开始，到卸载出内存为止，它的整个生命周期会经历**七个阶段**，分别是：**加载（Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化（Initializaion）、使用（Using）、卸载（Unloading）**。其中**验证**、**准备**、**解析**三个部分统称为**连接**。
![类加载步骤](/know-jvm/part-3/unit-07/class-load-step.png)

## 类加载过程
在类型的整个生命周期中，类加载过程占五个阶段：**加载（Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化（Initializaion）**

### 加载
加载阶段JVM需要完成三件事情：
- 通过一个类的全限定名来获取定义此类的二进制字节流。
- 将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构。
- 在内存中生成一个代表这个类的java.lang.Class对象，作为方法区这个类的各种数据的访问入口。

### 验证
直到2011年《Java虚拟机规范（Java SE 7版）》出版，规范中大幅增加了验证过程的描述（篇幅从不到10页增加到130 页），这时验证阶段的约束和验证规则才变得具体起来。从整体上看，验证阶段大致上会完成下面四个阶段的检验动作：
- 文件格式验证
- 元数据验证
- 字节码验证
- 符号引用验证

### 准备
准备阶段是正式为类中定义的变量（即静态变量，被static修饰的变量）分配内存并设置类变量初始值的阶段。   
需要注意两点：
- 此阶段分配内存仅为类变量
- 初始值“通常情况”下是数据类型的零值。
  当一个类变量以如下方式定义时，那变量value在准备阶段过后的初始值为0而不是123。
  ```java
  public static int value = 123;
  ```
  当一个变量以如下方式定义时，在编译期，该变量会标注为 ConstantValue ，那在准备阶段变量值就会被初始化为ConstantValue属性所指定的初始值
![基本数据类型的零值](/know-jvm/part-3/unit-07/init-value.png)

### 解析
解析阶段是Java虚拟机将常量池内的符号引用替换为直接引用的过程。解析动作主要针对类或接口、字段、类方法、接口方法、方法类型、方法句柄和调用点限定符这7类符号引用进行，分别对应于常量池的`CONSTANT_Class_info`、`CON-STANT_Fieldref_info`、`CONSTANT_Methodref_info`、`CONSTANT_InterfaceMethodref_info`、`CONSTANT_MethodType_info`、`CONSTANT_MethodHandle_info`、`CONSTANT_Dyna-mic_info`和`CONSTANT_InvokeDynamic_info`8种常量类型。

### 初始化
类的初始化阶段是类加载过程的最后一个步骤，之前介绍的几个类加载的动作里，除了在加载阶段用户应用程序可以通过自定义类加载器的方式局部参与外，其余动作都完全由Java虚拟机来主导控制。直到初始化阶段，Java虚拟机才真正开始执行类中编写的Java程序代码，将主导权移交给应用程序。

进行准备阶段时，变量已经赋过一次系统要求的初始零值，而在初始化阶段，则会根据程序员通过程序编码制定的主观计划去初始化类变量和其他资源。我们也可以从另外一种更直接的形式来表达：初始化阶段就是执行类构造器`<clinit>()`方法的过程。`<clinit>()`并不是程序员在Java代码中直接编写的方法，它是Javac编译器的自动生成物，但我们非常有必要了解这个方法具体是如何产生的，以及`<clinit>()`方法执行过程中各种可能会影响程序运行行为的细节，这部分比起其他类加载过程更贴近于普通的程序开发人员的实际工作。

`<clinit>()`方法是由编译器自动收集类中的所有类变量的赋值动作和静态语句块，（static{}块）中的语句合并产生的，编译器收集的顺序是由语句在源文件中出现的顺序决定的，静态语句块中只能访问到定义在静态语句块之前的变量，定义在它之后的变量，在前面的静态语句块可以赋值，但是不能访问。
```java
public class Test {
{
  i = 0; // 给变量复制可以正常编译通过
  System.out.print(i); // 这句编译器会提示“非法向前引用”
}
static int i = 1;
}
```

`<clinit>()`方法与类的构造函数（即在虚拟机视角中的实例构造器`<init>()`方法）不同，它不需要显式地调用父类构造器，Java 虚拟机会保证在子类的`<clinit>()`前，父类的`<clinit>()`方法已经执行完毕。因此在 Java 虚拟机中第一个被执行的`<clinit>()`
方法的类型肯定是 java.lang.Object。

由于父类的`<clinit>()`方法先执行，也就意味着父类中定义的静态语句块要优先于子类的变量赋值操作。
```java
static class Parent {
  public static int A = 1;
  static {
  A = 2;
  }
}

static class Sub extends Parent {
  public static int B = A;
}

public static void main(String[] args) {
  System.out.println(Sub.B);
}
```

`<clinit>()`方法对于类或接口来说并不是必需的，如果一个类中没有静态语句块，也没有对变量的赋值操作，那么编译器可以不为这个类生成`<clinit>()`方法`。

接口中不能使用静态语句块，但仍然有变量初始化的赋值操作，因此接口与类一样都会生成`<clinit>()`方法。但接口与类不同的是，执行接口的`<clinit>()`方法不需要先执行父接口的`<clinit>()`方法，因为只有当父接口中定义的变量被使用时，父接口才会被初始化。此外，接口的实现类在初始化时也一样不会执行接口的`<clinit>()`方法。

Java 虚拟机必须保证一个类的`<clinit>()`方法在多线程环境中被正确地加锁同步，如果多个线程同时去初始化一个类，那么只会有其中一个线程去执行这个类的`<clinit>()`方法，其他线程都需要阻塞等待，直到活动线程执行完毕`<clinit>()`方法。如果在一个类的`<clinit>()`方法中有耗时很长的操作，那就可能造成多个进程阻塞，在实际应用中这种阻塞往往是很隐蔽的。如下代码演示了这种场景：
```java
static class DeadLoopClass {
  static {
    // 如果不加上这个 if 语句，编译器将提示“Initializer does not complete normally” 并拒绝编译
    if (true) {
      System.out.println(Thread.currentThread() + "init DeadLoopClass");
      while (true) {
      }
    }
  }
  public static void main(String[] args) {
    Runnable script = new Runnable() {
      public void run() {
        System.out.println(Thread.currentThread() + "start");
        DeadLoopClass dlc = new DeadLoopClass();
        System.out.println(Thread.currentThread() + " run over");
      }
    };
    Thread thread1 = new Thread(script);
    Thread thread2 = new Thread(script);
    thread1.start();
    thread2.start();
  }
}
```
运行结果如下，一条线程在死循环以模拟长时间操作，另外一条线程在阻塞等待：    
```txt
Thread[Thread-0,5,main]start  
Thread[Thread-1,5,main]start  
Thread[Thread-0,5,main]init DeadLoopClass
```

## 类加载器
比较两个类是否“相等”，只有在这两个类是由同一个类加载器加载的前提下才有意义，否则，即使这两个类来源于同一个 Class 文件，被同一个 Java 虚拟
机加载，只要加载它们的类加载器不同，那这两个类就必定不相等

### 启动类加载器
启动类加载器负责加载存放在 `<JAVA_HOME>\lib` 目录，或者被 `-Xbootclasspath` 参数所指定的路径中存放的，而且是 `Java` 虚拟机能够识别的（按照文件名识别，如 `rt.jar`、`tools.jar`，名字不符合的类库即使放在 `lib` 目录中也不会被加载）类库加载到虚拟机的内存中。启动类加载器无法被 `Java` 程序直接引用，用户在编写自定义类加载器时，如果需要把加载请求委派给引导类加载器去处理，那直接使用 `null` 代替即可。

### 扩展类加载器
扩展类加载器是在类 `sun.misc.Launcher$ExtClassLoader` 中以 `Java` 代码的形式实现的。它负责加载 `<JAVA_HOME>\lib\ext` 目录中，或者被 `java.ext.dirs` 系统变量所指定的路径中所有的类库。

### 应用程序类加载器
这个类加载器由 `sun.misc.Launcher$AppClassLoader` 来实现。由于应用程序类加载器是 `ClassLoader` 类中的 `getSystem-ClassLoader()` 方法的返回值，所以有些场合中也称它为“系统类加载器”。它负责加载用户类路径（ClassPath）上所有的类库，开发者同样可以直接在代码中使用这个类加载器。如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。

### 双亲委派模型
从JVM的角度来看，两种不同的类加载器：启动类加载器（Bootstrap ClassLoader），其他所有的类加载器。
从Java开发人员的角度来看，自 JDK 1.2 以来，Java 一直保持着三层类加载器：启动类加载器、扩展类加载器、应用程序类加载器；以及双亲委派的类加载架构。

JDK 9之前的Java应用都是由这三种类加载器互相配合来完成加载的，如果用户认为有必要，还可以加入自定义的类加载器来进行拓展，典型的如增加除了磁盘位置之外的Class文件来源，或者通过类加载器实现类的隔离、重载等功能。这些类加载器之间的协作关系“通常”会如图7-2所示。图7-2中展示的各种类加载器之间的层次关系被称为类加载器的“双亲委派模型（Parents DelegationModel）”。双亲委派模型要求除了顶层的启动类加载器外，其余的类加载器都应有自己的父类加载器。不过这里类加载器之间的父子关系一般不是以继承（Inheritance）的关系来实现的，而是通常使用组合（Composition）关系来复用父加载器的代码。

双亲委派模型的工作过程是：如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成，每一个层次的类加载器都是如此，因此所有的加载请求最终都应该传送到最顶层的启动类加载器中，只有当父加载器反馈自己无法完成这个加载请求（它的搜索范围中没有找到所需的类）时，子加载器才会尝试自己去完成加载。
![双亲委派模型](/know-jvm/part-3/unit-07/parents-delegation.png)
