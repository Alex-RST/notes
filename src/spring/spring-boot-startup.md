# SpringBoot启动流程
1. 创建`SpringApplication`对象
2. 执行`SpringApplication` 的 `run`方法

## 创建`SpringApplication`对象
1. 获取 `Bean Definition` 源
2. 推断应用类型
3. `ApplicationContext` 初始化器
4. 监听器与事件
5. 主类推断

### 获取 `Bean Definition` 源

### 推断应用类型
- **`SpringBoot` 支持三种应用类型：**  
  - 基于 `Servlet` 的 `Web` 应用程序
  - 基于 `Reactive` 的 `Web` 应用程序
  - 非 `Web` 的应用程序

- **如何推断当前应用类型？**  
判断类路径中是否存在某些特殊类。  
在 `WebApplication` 枚举类中存在一个 `deduceFromClasspath` 方法：
```java
public enum WebApplicationType {
    NONE,
    SERVLET,
    REACTIVE;

    //...
    static WebApplicationType deduceFromClasspath() {
        if (ClassUtils.isPresent("org.springframework.web.reactive.DispatcherHandler", (ClassLoader)null) && !ClassUtils.isPresent("org.springframework.web.servlet.DispatcherServlet", (ClassLoader)null) && !ClassUtils.isPresent("org.glassfish.jersey.servlet.ServletContainer", (ClassLoader)null)) {
            return REACTIVE;
        } else {
            for(String className : SERVLET_INDICATOR_CLASSES) {
                if (!ClassUtils.isPresent(className, (ClassLoader)null)) {
                    return NONE;
                }
            }
            return SERVLET;
        }
    }
    //...
}
```

### `ApplicationContext` 初始化器
提供一种在 `ApplicationContext` 的 `refresh` 方法调用之前，对 `ApplicationContext` 进行扩展的方式

### 监听器与事件

### 主类推断

## 执行`SpringApplication` 的 `run` 方法
1. **创建事件发布器**  
    - 事件发布器接口：`SpringApplicationRunListener`  
    - 实现类：`EnventPublishingRunListener`。   
    - 在 `spring.factories`指定实现类，在启动时加载：
      ![SpringApplicationRunListener](/spring/SpringApplicationRunListener.png "SpringApplicationRunListener")
    - `SpringFactoriesLoader` 中 `load`方法可以加载 `spring.factories` 中的键值对：
      ![SpringFactoriesLoader](/spring/SpringFactoriesLoader_load.png "SpringFactoriesLoader")
      ```java
      //只需传入键所对应的class对象：
      List<String> runListeners = SpringFactoriesLoader.loadFactoryNames(SpringApplicationRunListener.class);
      ```
    - `SpringApplicationRunListener` 发布各种事件 
      ```java
      public interface SpringApplicationRunListener {
        //开始启动（ApplicationStartingEvent事件）
	    default void starting(ConfigurableBootstrapContext bootstrapContext) {}
        //关键信息开始准备（ApplicationEnvironmentPreparedEvent事件）
	    default void environmentPrepared(ConfigurableBootstrapContext bootstrapContext, ConfigurableEnvironment environment) {}
        //在spring容器创建，并调用初始化器之后，发送此事件（ApplicationContextInitializedEvent事件）
	    default void contextPrepared(ConfigurableApplicationContext context) {}
	    //在所有 bean definition 加载完毕（ApplicationPreparedEvent事件）
	    default void contextLoaded(ConfigurableApplicationContext context) {}
	    //spring容器初始化完成（refresh方法调用完毕）（ApplicationStartedEvent事件）
	    default void started(ConfigurableApplicationContext context, Duration timeTaken) {}
	    //springboot启动完毕（ApplicationReadyEvent事件）
	    default void ready(ConfigurableApplicationContext context, Duration timeTaken) {}
	    //springboot启动报错（ApplicationFailedEvent事件）
	    default void failed(ConfigurableApplicationContext context, Throwable exception) {}
      }
      ```
2. **封装 `main` 方法的参数**
3. **创建一个 `env` 对象**
   ```java
   //创建 ApplicationEnvironment 对象
   ApplicationEnvironment applicationEnvironment = new ApplicationEnvironment();
   //获取属性源列表
   List<MutablePropertySources> propertySources = applicationEnvironment.getPropertySources;
   //添加属性源
   propertySources.addLast(/*传入一个属性源对象*/);//将添加至列表末尾，优先级最低
   propertySources.addFirst(/*传入一个属性源对象*/);//将添加至列表开头，优先级最高
   //获取属性，传入一个属性名，例如server.port
   String serverPort = propertySources.getProperty("server.port");
   //...
   ```
4. **统一键的命名规范**
5. **发布 `env` 已准备好的事件，执行`EnvironmentPostProcessor`**
   ```java
   //获取spring.factories中EnvironmentPostProcessor对应值
   SpringFactoriesLoader.load(Class<?> clazz);
   //SpringApplicationRunListener发布contextPrepared
   //此处省略
   ```
6. **将 `env` 中以 `spring.main` 开头的配置信息，绑定到 `SpringApplication` 中的属性上**
   ```java
   public class Binder {
    //...
    public static Binder get(Environment environment) {
        return get(environment, (BindHandler)null);
    }
    //创建一个对象实例并绑定属性
    public <T> BindResult<T> bind(String name, Class<T> target) {
        return this.bind(name, Bindable.of(target));
    }
    //绑定到已有对象上
    public <T> BindResult<T> bind(String name, Bindable<T> target) {
        return this.bind((ConfigurationPropertyName)ConfigurationPropertyName.of(name), target, (BindHandler)null);
    }
    //...
   }
   //Binder类提供键值信息和对象属性进行绑定
   User user = Binder.get(env).bind("user", User.class);
   ```
7. **打印 `Banner`**
8. **创建 `Spring` 容器**  
   根据以创建的 `SpringApplication`对象的 `WebApplicationType` 类型创建容器
9.  **执行 `ApplicationContext` 初始化器**
10. **获取各种来源，加载 `BeanDefinition`**
    - `AnnotatedBeanDefinitionReader`：加载由 `@Bean` 注解定义的 `Bean`
    - `XmlBeanDefinitionReader`：加载由 `xml` 文件定义的 `Bean`
    - `ClassPathBeanDefinitionReader`：扫描类路径下的 `Bean`
11. **调用 `ApplicationContext` 的 `refresh` 方法，初始化单例**
12. **调用所有实现了 `ApplicationRunner`、`CommandLineRunner` 接口的 `Bean`**
    - `ApplicationRunner`  
      ![ApplicationRunner](/spring/ApplicationRunner.png "ApplicationRunner")
      `ApplicationRunner`接口的`run`方法的参数是`ApplicationArguments`类型，该类型提供了两种获取参数的方法：
      - `getOptionNames()`与`getOptionValues(String name)`
      - `getNonOptionArgs()` 
    - `CommandLineRunner`
      ![CommandLineRunner](/spring/CommandLineRunner.png "CommandLineRunner")

## 参考资料
- [黑马程序员Spring视频教程，深度讲解spring5底层原理](https://www.bilibili.com/video/BV1P44y1N7QG?spm_id_from=333.788.videopod.episodes&vd_source=82c8936823dd2e33632d42e87e1732ba&p=124)