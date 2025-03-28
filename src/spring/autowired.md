# `Autowired` 注入底层原理

## `DependencyDescriptor` 对象
`DependencyDescriptor` ，依赖描述器，该类的实例可以用于描述一个 `Bean` 的依赖（包括使用`@Autowired`标注的**类的属性依赖**以及**方法的参数依赖**等），`Spring` 对其类型的声明如下：
```java
/**
 * Descriptor for a specific dependency that is about to be injected.
 * Wraps a constructor parameter, a method parameter or a field,
 * allowing unified access to their metadata.
 *
 * @author Juergen Hoeller
 * @since 2.5
 */
public class DependencyDescriptor extends InjectionPoint implements Serializable {
    //...
}
```
该类的构造方法主要有如下几个：
```java
/**
 * Create a new descriptor for a method or constructor parameter.
 * 创建一个方法或者构造器参数的依赖描述器
 * 
 * @param methodParameter the MethodParameter to wrap
 * @param required whether the dependency is required
 * @param eager whether this dependency is 'eager' in the sense of
 * eagerly resolving potential target beans for type matching
 */
public DependencyDescriptor(MethodParameter methodParameter, boolean required, boolean eager);

/**
 * Create a new descriptor for a field.
 * 创建一个属性的依赖描述器
 * 
 * @param field the field to wrap
 * @param required whether the dependency is required
 * @param eager whether this dependency is 'eager' in the sense of
 * eagerly resolving potential target beans for type matching
 */
public DependencyDescriptor(Field field, boolean required, boolean eager)
```

## 支持注入的类型
- `Optional`、`ObjectFactory`、`ObjectProvider` 包装的类型
- 数组类型
- `List` 类型
- `ApplicationContext` 类型
- 泛型类型
- ...

## 注入原理
**注入的流程大致可分为两步**：
1. 获取需要注入的依赖的描述器对象（`DependencyDescriptor`）。
2. 调用 `DefaultListableBeanFactory` 的 `doResolveDependency` 方法，获取最终依赖的 `Bean`。

**测试环境准备**
```java
@Configuration
public class TestAutowired {
    public static void main(String[] args) throws NoSuchFieldException, NoSuchMethodException {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(TestAutowired.class);
        DefaultListableBeanFactory beanFactory = context.getDefaultListableBeanFactory();
        /*
            学到了什么
                1. Optional 及 ObjectFactory 对于内嵌类型的处理, 源码参考 ResolvableType
                2. ObjectFactory 懒惰的思想
                3. @Lazy 懒惰的思想
            下一节, 继续学习 doResolveDependency 内部处理
         */
    }

    @Component("bean2")
    static class Bean1 {
        @Autowired @Lazy private Bean2 bean2;
        @Autowired public void setBean2(Bean2 bean2) {this.bean2 = bean2;}
        @Autowired private Optional<Bean2> bean3;
        @Autowired private ObjectFactory<Bean2> bean4;
    }

    @Component("bean2")
    static class Bean2 {
        /*@Override
        public String toString() {
            return super.toString();
        }*/
    }

    @Component
    public static class Target {
        @Autowired private Service[] serviceArray;
        @Autowired private List<Service> serviceList;
        @Autowired private ConfigurableApplicationContext applicationContext;
        @Autowired private Dao<Teacher> dao;
        @Autowired @Qualifier("service2") private Service service;
    }

    @Component("dao1") 
    public static class Dao1 implements Dao<Student> {}

    @Component("dao2") 
    public static class Dao2 implements Dao<Teacher> {}

    @Component("service1")
    static class Service1 implements Service {}

    @Component("service2")
    static class Service2 implements Service {}

    @Component("service3")
    static class Service3 implements Service {}

    public interface Dao<T> {}

    static class Student {}

    static class Teacher {}

    interface Service {}
}
```
### 成员变量注入
```java
public static void testField(DefaultListableBeanFactory beanFactory) {
    // 根据成员变量的类型注入
    DependencyDescriptor dd1 = new DependencyDescriptor(Bean1.class.getDeclaredField("bean2"), false);
    System.out.println(beanFactory.doResolveDependency(dd1, "bean1", null, null));
}
```

### 方法参数注入
```java
public static void testMethodParameter(DefaultListableBeanFactory beanFactory) {
    //根据参数的类型注入
    Method setBean2 = Bean1.class.getDeclaredMethod("setBean2", Bean2.class);
    DependencyDescriptor dd2 = new DependencyDescriptor(new MethodParameter(setBean2, 0), false);
    System.out.println(beanFactory.doResolveDependency(dd2, "bean1", null, null));
}
```

### `Optional` 类型注入
```java
public static void testOptional(DefaultListableBeanFactory beanFactory) {
    // 3. 结果包装为 Optional<Bean2>
    DependencyDescriptor dd3 = new DependencyDescriptor(Bean1.class.getDeclaredField("bean3"), false);
    if (dd3.getDependencyType() == Optional.class) {
        dd3.increaseNestingLevel();
        Object result = beanFactory.doResolveDependency(dd3, "bean1", null, null);
        System.out.println(Optional.ofNullable(result));
    }
}
```

### `ObjectProvider`、`ObjectFactory`
```java
// 4. 结果包装为 ObjectProvider,ObjectFactory
public static void testObjectPrividerAndObjectFactory(DefaultListableBeanFactory beanFactory) {
    DependencyDescriptor dd4 = new DependencyDescriptor(Bean1.class.getDeclaredField("bean4"), false);
    if (dd4.getDependencyType() == ObjectFactory.class) {
        dd4.increaseNestingLevel();
        ObjectFactory objectFactory = new ObjectFactory() {
            @Override
            public Object getObject() throws BeansException {
                return beanFactory.doResolveDependency(dd4, "bean1", null, null);
            }
        };
        System.out.println(objectFactory.getObject());
    }
}
```

### Generic 
```java
public static void testGeneric(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException {
    DependencyDescriptor dd4 = new DependencyDescriptor(Target.class.getDeclaredField("dao"), true);
    Class<?> type = dd4.getDependencyType();
    ContextAnnotationAutowireCandidateResolver resolver = new ContextAnnotationAutowireCandidateResolver();
    resolver.setBeanFactory(beanFactory);
    for (String name : BeanFactoryUtils.beanNamesForTypeIncludingAncestors(beanFactory, type)) {
        BeanDefinition bd = beanFactory.getMergedBeanDefinition(name);
        // 对比 BeanDefinition 与 DependencyDescriptor 的泛型是否匹配
        if (resolver.isAutowireCandidate(new BeanDefinitionHolder(bd,name), dd4)) {
            System.out.println(name);
            System.out.println(dd4.resolveCandidate(name, type, beanFactory));
        }
    }
}
```

### `ApplicationContext` 
```java
public static void testApplicationContext(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException, IllegalAccessException {
    DependencyDescriptor dd3 = new DependencyDescriptor(Target.class.getDeclaredField("applicationContext"), true);
    Field resolvableDependencies = DefaultListableBeanFactory.class.getDeclaredField("resolvableDependencies");
    resolvableDependencies.setAccessible(true);
    Map<Class<?>, Object> dependencies = (Map<Class<?>, Object>) resolvableDependencies.get(beanFactory);
//        dependencies.forEach((k, v) -> {
//            System.out.println("key:" + k + " value: " + v);
//        });
    for (Map.Entry<Class<?>, Object> entry : dependencies.entrySet()) {
        // 左边类型                      右边类型
        if (entry.getKey().isAssignableFrom(dd3.getDependencyType())) {
            System.out.println(entry.getValue());
            break;
        }
    }
}
```

`Spring IOC` 中的所有的单例 `Bean` 都将放在 `DefaultListableBeanFactory` 类中。`DeaultListableBeanFactory` 又是通过继承 `DefaultSingletonBeanRegistry`类，由此父类维护一个名为 `singletonObjects` 的 `Map<String, Object>`集合，所有的单例 `Bean` 都将放在此集合中。
![singletonObjects](/spring/DefaultSingletonBeanRegistry-singletonFactories.png)

而一些特殊的 `Bean`，例如：`ApplicationContext`，都是放在了 `DefaultListableBeanFactory` 的一个名为 `resolvableDependencies` 的集合中。
![resolvableDependencies](/spring/DefaultListableApplicationContext-resolvableDependencies.png)

在何时将这些特殊的 `Bean` 放入此集合？答案是在 `IOC容器` 启动阶段的`refresh`方法中，调用了一个名为 `prepareBeanFactory` 的方法，在该方法中，将这些 特殊的 `Bean` 放入了集合。
![prepareBeanFactory](/spring/AbstractBeanFactory-prepareBeanFactory.png)

### `List` 类型
```java
public static void testList(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException {
    DependencyDescriptor dd2 = new DependencyDescriptor(Target.class.getDeclaredField("serviceList"), true);
    if (dd2.getDependencyType() == List.class) {
        Class<?> resolve = dd2.getResolvableType().getGeneric().resolve();
        System.out.println(resolve);
        List<Object> list = new ArrayList<>();
        String[] names = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(beanFactory, resolve);
        for (String name : names) {
            Object bean = dd2.resolveCandidate(name, resolve, beanFactory);
            list.add(bean);
        }
        System.out.println(list);
    }
}
```

### 数组类型
```java
public static void testArray(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException {
    DependencyDescriptor dd1 = new DependencyDescriptor(Target.class.getDeclaredField("serviceArray"), true);
    if (dd1.getDependencyType().isArray()) {
        Class<?> componentType = dd1.getDependencyType().getComponentType();
        System.out.println(componentType);
        String[] names = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(beanFactory, componentType);
        List<Object> beans = new ArrayList<>();
        for (String name : names) {
            System.out.println(name);
            Object bean = dd1.resolveCandidate(name, componentType, beanFactory);
            beans.add(bean);
        }
        Object array = beanFactory.getTypeConverter().convertIfNecessary(beans, dd1.getDependencyType());
        System.out.println(array);
    }
}
``` 

## 解析注解
### `@Lazy` 
```java
public static void testLazyAnnotation(DefaultListableBeanFactory beanFactory) {
    // 5. 对 @Lazy 的处理
    DependencyDescriptor dd5 = new DependencyDescriptor(Bean1.class.getDeclaredField("bean2"), false);
    ContextAnnotationAutowireCandidateResolver resolver = new ContextAnnotationAutowireCandidateResolver();
    resolver.setBeanFactory(beanFactory);
    Object proxy = resolver.getLazyResolutionProxyIfNecessary(dd5, "bean1");
    System.out.println(proxy);
    System.out.println(proxy.getClass());
}
``` 

### `@Qualifier`
```java
private static void testQualifier(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException {
    DependencyDescriptor dd5 = new DependencyDescriptor(Target.class.getDeclaredField("service"), true);
    Class<?> type = dd5.getDependencyType();
    ContextAnnotationAutowireCandidateResolver resolver = new ContextAnnotationAutowireCandidateResolver();
    resolver.setBeanFactory(beanFactory);
    for (String name : BeanFactoryUtils.beanNamesForTypeIncludingAncestors(beanFactory, type)) {
        BeanDefinition bd = beanFactory.getMergedBeanDefinition(name);
        //                                                             @Qualifier("service2")
        if (resolver.isAutowireCandidate(new BeanDefinitionHolder(bd,name), dd5)) {
            System.out.println(name);
            System.out.println(dd5.resolveCandidate(name, type, beanFactory));
        }
    }
}
```

### `@Primary`
```java
private static void testPrimary(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException {
    DependencyDescriptor dd = new DependencyDescriptor(Target1.class.getDeclaredField("service"), false);
    Class<?> type = dd.getDependencyType();
    for (String name : BeanFactoryUtils.beanNamesForTypeIncludingAncestors(beanFactory, type)) {
        if (beanFactory.getMergedBeanDefinition(name).isPrimary()) {
            System.out.println(name);
        }
    }
}
```

### 最后判断 `beanName`
```java
private static void testDefault(DefaultListableBeanFactory beanFactory) throws NoSuchFieldException {
    DependencyDescriptor dd = new DependencyDescriptor(Target2.class.getDeclaredField("service3"), false);
    Class<?> type = dd.getDependencyType();
    for (String name : BeanFactoryUtils.beanNamesForTypeIncludingAncestors(beanFactory, type)) {
        if(name.equals(dd.getDependencyName())) {
            System.out.println(name);
        }
    }
}
```

## 参考资料
- [代码.rar](/spring/code.rar)
- [文档.rar](/spring/doc.rar)