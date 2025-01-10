# jar包的结构

## windown下杀死进程
```cmd
taskkill /F /PID ${PID}
```

## jar命令打包后的结构
```text
example.jar
 |
 +-META-INF
 |  +-MANIFEST.MF
 +-com
 |  +-example
 |    +- Main.class
```

## 使用 `jar` 命令打包

### 带有启动类的打包
- `-c`  创建一个jar包
- `-t` 显示jar中的内容列表
- `-x` 解压jar包
- `-u` 添加文件到jar包中
- `-i`  为指定的jar文件创建索引文件
- `-f` 指定jar包的文件名
- `-v`  生成详细的报造，并输出至标准设备
- `-m` 指定manifest.mf文件.(manifest.mf文件中可以对jar包及其中的内容作一些一设置)
- `-0` 产生jar包时不对其中的内容进行压缩处理
- `-M` 不产生所有文件的清单文件(Manifest.mf)。这个参数与忽略掉-m参数的设置
- `-P`  保留文件名中的前导'/'（绝对路径）和“..”（父目录）组件
- `-e` 为独立应用程序指定应用程序入口点捆绑到可执行jar文件中
- `-C` 表示转到相应的目录下执行jar命令,相当于cd到那个目录，然后不带-C执行jar命令
```shell
jar -cvfe ${package-name} ${Main-Class} ${Path}
```

### 打包依赖

## 参考资料
- [jar 命令使用 ---西阳~ 活成自己喜欢的样子~](https://www.cnblogs.com/kingsonfu/p/11461162.html)
