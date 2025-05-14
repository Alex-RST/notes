# `ApplicationRunner` 接口

## 接口定义源码
```java
/**
 * Interface used to indicate that a bean should <em>run</em> when it is contained within
 * a {@link SpringApplication}. Multiple {@link ApplicationRunner} beans can be defined
 * within the same application context and can be ordered using the {@link Ordered}
 * interface or {@link Order @Order} annotation.
 *
 * @author Phillip Webb
 * @since 1.3.0
 * @see CommandLineRunner
 */
@FunctionalInterface
public interface ApplicationRunner extends Runner {

	/**
	 * Callback used to run the bean.
	 * @param args incoming application arguments
	 * @throws Exception on error
	 */
	void run(ApplicationArguments args) throws Exception;

}
```

## `ApplicationArguments` 使用方法
假设传递给应用的参数为："--server.port=8080 degub"。其中以`--`开头的称为选项式参数（option），其他的为非选项式参数(non-option) 。
ApplicationArguments类提供了四种常用与获取参数相关的方法：
- `String[] getSourceArgs();`
- `Set<String> getOptionNames();`
- `List<String> getOptionValues(String name);`
- `boolean containsOption(String name);`
- `List<String> getNonOptionArgs();`