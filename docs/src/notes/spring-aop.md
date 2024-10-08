# Spring AOP 

## 切点表达式
- execution
- this
- target
- args
- @annotation
- @within
- @target
- @args

## 通知执行顺序
1. Around
2. Before
3. target method（目标方法）
4. AfterReturning/AfterThrowing
5. After
6. Around

统一切点有不同切面进行通知时，可使用`@Order`进行顺序控制。

## 使用源码进行代理
```java
public class Main {
    public static void main(String[] args) {
        Service1 target = new Service1();
        //创建代理工厂
        AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
        //添加目标对象
        proxyFactory.setTarget(target);
        // 添加切面
        proxyFactory.addAspect(CommonAspect.class);
        //获取代理对象
        Service1 proxy = proxyFactory.getProxy();
    }
}
```

## 参考文献
- [Spring AOP 通知与顺序详解](https://www.cnblogs.com/kongbubihai/p/16034321.html)