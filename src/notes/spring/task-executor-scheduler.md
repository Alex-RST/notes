# 任务执行与调度

## `@Scheduled` & `@EnableScheduling`
- 在配置类中，使用 `@EnableScheduling`
- 在 `Bean` 对象中，使用 `@Scheduled`
```java
//通常在启动类上标注 @EnableScheduling
@EnableScheduling
@SpringBootApplication
public class SpringBootDemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringBootDemoApplication.class, args);
	}
}

//使用@Scheduled声明调度任务
@Scheduled(fixedRate = 5, 
           timeUnit = TimeUnit.SECONDS)
public void doSomething() {
	// something that should run periodically
}
```

:::tip :warning: 注意 
要调度的方法必须返回 void，并且不得接受任何参数。如果该方法需要与应用程序上下文中的其他对象交互，则通常会通过依赖项注入来提供这些对象。
:::

## 参考资料
- [Task Execution and Scheduling ( Spring 官方文档 )](https://docs.spring.io/spring-framework/reference/integration/scheduling.html#scheduling-task-executor)
- [简单两步，轻松实现 Spring Boot 动态定时任务，爽~](https://mp.weixin.qq.com/s/3s-NCA-en5-k9zLXaxkmWg)