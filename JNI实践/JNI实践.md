# JNI实践

## 一、创建 Java 类
首先，在**windows平台下**，我们需要创建一个 Java 类，声明一个 native 方法。假设这个类叫做 NativeExample。
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

**注意事项**：
- 库名称：使用 System.loadLibrary("libraryName") 来加载本地库时，libraryName 是库的基本名称，不包括扩展名，如 .dll 或 .so。

- 库路径: 确保动态库文件（如 nativeexample.dll）在 Java 的库路径中，或者在系统的 PATH 环境变量中。

## 二、生成头文件
使用 javac 编译 Java 类，并使用 javah 生成 C 头文件。在 JDK 9 及更高版本中，你可以使用 javac -h 生成头文件。
```sh
javac NativeExample.java
javac -h . NativeExample.java
```
这将生成一个名为 NativeExample.h 的头文件。

**注意事项**：
- 头文件生成: 使用 javac -h 命令生成的头文件中会包含 JNI 语法定义，确保你遵循这些定义来实现 C 函数。
```sh
JNIEXPORT jstring JNICALL Java_NativeExample_getNativeMessage(JNIEnv *, jobject);
```
- 参数:
  - JNIEnv *env: 指向 JNI 接口的指针，用于调用 JNI 函数。
  - jobject obj: 对象实例（如果方法是实例方法）。
- 返回值的类型需要与 Java 方法的返回类型匹配，例如，返回 jstring 对应于 Java 中的 String 类型。

## 三、编写 C 代码
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

**注意事项**：
- 方法名
Java 中声明的 native 方法的名称必须与 C 中的实现函数名称完全一致。C 中的函数名是由 Java 方法名、类名和方法参数组成的。
- 命名规则
  Java方法名需要映射到 C 函数名。在 C 代码中，函数的命名规则是 Java_ + 类名_ + 方法名。类名和方法名都用下划线 _ 替换 Java 中的点 . 和其他字符。
  例如，Java中的 NativeExample.getNativeMessage() 方法在 C 中实现时的函数名应该是 Java_NativeExample_getNativeMessage。
- Java 数据类型与 JNI 类型的映射:
  - int 映射到 jint
  - float 映射到 jfloat
  - double 映射到 jdouble
  - boolean 映射到 jboolean
  - String 映射到 jstring
  - Object 映射到 jobject
- 字符串处理: 使用 (\*env)->NewStringUTF(env, "string") 来创建 Java 字符串对象，并使用 (\*env)->GetStringUTFChars 和 (\*env)->ReleaseStringUTFChars 来处理 Java 字符串。
- 检查 JNI 调用: 你应该检查 JNI 调用是否成功，以防止异常情况。例如，检查 (\*env)->ExceptionCheck(env) 以检测是否有异常发生。
- 内存管理: 确保在使用 JNI 提供的内存时，避免内存泄漏，并在不再需要时释放资源。

## 四、编译 C 代码生成动态库
在 Windows 上，你可以使用 gcc（来自 MinGW 或其他工具）来编译 C 代码并生成动态库（.dll 文件）。假设你已经安装了 MinGW 并将其路径添加到系统环境变量中。
```sh
gcc -shared -o nativeexample.dll -I"%JAVA_HOME%\include" -I"%JAVA_HOME%\include\win32" NativeExample.c
```
这里 "%JAVA_HOME%" 是你的 JDK 安装目录。

## 五、运行Java 程序
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

注意事项：
- 一致性：确保 Java 方法名与 C 函数名一致。
- 参数和返回值：正确处理 JNI 数据类型和方法参数。
- 错误处理和内存管理：处理 JNI 错误和管理内存。
- 库加载：确保动态库可以被正确加载。