# JNI实践

## 一、 创建 Java 类
首先，我们需要创建一个 Java 类，声明一个 native 方法。假设这个类叫做 NativeExample。
```java
// NativeExample.java
public class NativeExample {
    // 声明一个 native 方法
    public native String getNativeMessage();

    // 加载本地库
    static {
        System.loadLibrary("nativeexample"); // 这里的 "nativeexample" 是库的名称
    }

    public static void main(String[] args) {
        NativeExample example = new NativeExample();
        // 调用 native 方法
        String message = example.getNativeMessage();
        System.out.println(message);
    }
}
```
## 二、 生成头文件
使用 javac 编译 Java 类，并使用 javah 生成 C 头文件。在 JDK 9 及更高版本中，你可以使用 javac -h 生成头文件。
```
javac NativeExample.java
javac -h . NativeExample.java
```
这将生成一个名为 NativeExample.h 的头文件。

## 三、 编写 C 代码
然后，创建一个 C 文件来实现 native 方法。假设这个文件叫做 NativeExample.c。
```c
// NativeExample.c
#include <jni.h>
#include <stdio.h>
#include "NativeExample.h"

// 实现 native 方法
JNIEXPORT jstring JNICALL Java_NativeExample_getNativeMessage(JNIEnv *env, jobject obj) {
    return (*env)->NewStringUTF(env, "Hello from native code");
}
```

## 四、 编译 C 代码生成动态库
在 Windows 上，你可以使用 gcc（来自 MinGW 或其他工具）来编译 C 代码并生成动态库（.dll 文件）。假设你已经安装了 MinGW 并将其路径添加到系统环境变量中。
```sh
gcc -shared -o nativeexample.dll -I"%JAVA_HOME%\include" -I"%JAVA_HOME%\include\win32" NativeExample.c
```
这里 "%JAVA_HOME%" 是你的 JDK 安装目录。

## 五、 运行Java 程序
确保 nativeexample.dll 在你的 java 程序的运行路径中，或者在系统的 PATH 环境变量中。然后运行你的 Java 程序：
```sh
java NativeExample
```
你应该会看到输出：
```
Hello from native code
```
## 六、总结
1. Java 类: 声明 native 方法并加载本地库。
2. 头文件: 使用 javac -h 生成。
3. C 实现: 实现 native 方法。
4. 编译 C 代码: 生成动态库（.dll 文件）。
5. 运行 Java 程序: 验证 native 方法是否正常工作。