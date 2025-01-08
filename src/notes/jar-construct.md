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
- `e`: 指定启动类
```shell
jar -cvfe ${package-name} ${Main-Class} ${Path}
```

### 打包依赖

## 参考资料
- [jar 命令使用 ---西阳~ 活成自己喜欢的样子~](https://www.cnblogs.com/kingsonfu/p/11461162.html)
