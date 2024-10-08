# Spring AOP 

## 切点表达式
- execution
- this
- within
- target
- args
- bean
- @annotation
- @within
- @target
- @args

## 通知执行顺序
- 目标方法正常执行并返回：  
  `Around（start）` -> `Before` -> `target method（目标方法）` -> `AfterReturning` -> `After`  -> `Around（end）`
- 目标方法抛出异常：  
  `Around（start）` -> `Before` -> `target method（目标方法）` -> `AfterThrowing` -> `After`

统一切点有不同切面进行通知时，可使用`@Order`进行顺序控制，数字越小优先级越高，且优先级高的切面会先执行完“同时期”的所有方法，例如：

![多切面下通知顺序](/img/spring-aop-seq.png)

如图所示，会优先执行完Aspect1中的Around和Before通知，再执行Aspect2中的Around和Before通知。其他通知也同样类似，不再赘述。

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
- https://shouce.jb51.net/spring/aop.html#aop-ataspectj-advice-params