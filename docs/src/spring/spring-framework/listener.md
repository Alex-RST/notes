# 事件监听器

## 定义事件类
- 事件类需要继承 `ApplicationEvent` 类
```java
public class MyApplicationEvent extends ApplicationEvent {
    public MyApplicationEvent(Object source) {
        super(source);
    }
    public MyApplicationEvent(Object source, Clock clock) {
        super(source, clock);
    }
}
```

## 发布事件
```java
@Component
public class Demo {
    @Autowired
    private ApplicationEventPublisher publisher;
    public void publishEvent() {
        publisher.publishEvent(new MyApplicationEvent("发布事件"));
    }
}
```

## 监听事件
**常用的监听事件的方式有两种：**
1. **定义一个监听器类，并实现 `ApplicationListener` 接口**
   - 监听器类需要声明为 `Bean`。
   - `ApplicationEvent` 的泛型参数即为所监听的事件类型。
   ```java
   @Component
   public static class MyApplicationEventListener implements ApplicationListener<MyApplicationEvent> {
       @Override
       public void onApplicationEvent(MyApplicationEvent event) {
          //接收到事件并处理
       }
   }
   ```
2. **声明监听方法**
   - `@EventListener` 声明一个监听方法。
   - 监听方法必须声明在一个 `Bean` 内。
   ```java
   @EventListener
   public void listener(MyApplicationEvent event) {
      //接收到事件并处理
   }
   ```

## 异步发送与处理
事件发布器的底层是通过 `SimpleApplicationEventMulticaster` 接口发送事件的。`SimpleApplicationEventMulticaster` 内部有一个 `Executor` 属性，设置此属性来实现异步发送的线程池。
```java
@Configuration
public class ListenerConfig {
    @Bean
    public Executor executor() {
        return new ThreadPoolExecutor(5, 10, 
                1, TimeUnit.MINUTES, 
                new ArrayBlockingQueue<>(20), 
                Executors.defaultThreadFactory(), 
                new ThreadPoolExecutor.CallerRunsPolicy());
    }

    /**
     * 注意此方法名称需要与默认的SimpleApplicationEventMulticaster类型的Bean的名字相同才能覆盖默认的bean，不同springboot版本，这个bean名字可能不同
     */
    @Bean
    public SimpleApplicationEventMulticaster simpleApplicationEventMulticaster(@Qualifier("executor") Executor executor) {
        SimpleApplicationEventMulticaster simpleApplicationEventMulticaster = new SimpleApplicationEventMulticaster();
        simpleApplicationEventMulticaster.setTaskExecutor(executor);
        return simpleApplicationEventMulticaster;
    }
}
```

## 事件发布器原理
`Spring` 的事件发布实际是交给一个 `ApplicationEventMulticaster`。自定义一个 `ApplicationEventMuticaster` 类型的 `Bean`（`Bean` 的名字需要个默认的该类型的Bean保持一致），模拟事件发布的实际主要执行流程（ `Spring` 的流程更加复杂）。
```java
@SuppressWarnings({"rawtypes", "unchecked"})
@Component("applicationEventMulticaster")
public class CustomApplicationEventMulticaster implements ApplicationEventMulticaster {

    final private List<GenericApplicationListener> listeners = new ArrayList<>();
    final private ApplicationContext applicationContext;
    final private Executor executor;
    public CustomApplicationEventMulticaster(ApplicationContext applicationContext, Executor executor) {
        this.applicationContext = applicationContext;
        this.executor = executor;
    }

    @Override
    public void addApplicationListenerBean(String listenerBeanName) {
        ApplicationListener listener = applicationContext.getBean(listenerBeanName, ApplicationListener.class);
        ResolvableType[] interfaces = ResolvableType.forInstance(listener).getInterfaces();
        ResolvableType resolvableType = Arrays.stream(interfaces)
                .filter(t -> t.isAssignableFrom(listener.getClass()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Listener " + listenerBeanName + " not registered"))
                .getGeneric(0);
        GenericApplicationListener genericApplicationListener = new GenericApplicationListener() {
            @Override
            public boolean supportsEventType(ResolvableType eventType) {
                return resolvableType.isAssignableFrom(eventType);
            }

            @Override
            public void onApplicationEvent(ApplicationEvent event) {
                listener.onApplicationEvent(event);
            }
        };
        listeners.add(genericApplicationListener);
    }

    @Override
    public void multicastEvent(ApplicationEvent event, ResolvableType eventType) {
        for (GenericApplicationListener listener : listeners) {
            if (listener.supportsEventType(ResolvableType.forInstance(event))) {
                executor.execute(() -> listener.onApplicationEvent(event));
            }
        }
    }
    
    //其他需要实现的方法...
}
```

## 参考资料
- [黑马程序员Spring视频教程，深度讲解spring5底层原理 (事件监听器)](https://www.bilibili.com/video/BV1P44y1N7QG?spm_id_from=333.788.videopod.episodes&vd_source=82c8936823dd2e33632d42e87e1732ba&p=168)