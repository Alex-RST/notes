# `BeanPostProcessor` 接口

## 介绍
`BeanPostProcessor` 是 `Spring` 定义的一个扩展点，允许自定义修改新 `bean` 实例的工厂钩子。接口中包含两个方法：
```java
public interface BeanPostProcessor {
	@Nullable
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
	@Nullable
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
}
```

## 源码解析
### 何时实例化？
`spring` 应用启动后，`AbstractApplicationContext` 的 `refresh` 属性整个容器，在 `refresh` 方法的内部调用 `registerBeanPostProcessors` 方法负责注册（包含实例化） `BeanPostProcessor` 接口的实现类。
![AbstractApplicationContext-refresh](/spring/AbstractApplicationContext-refresh.png)

具体的注册逻辑，则委托给了 `PostProcessorRegistrationDelegate` 的 `registerBeanPostProcessors` 静态方法。大致可分为如下几个步骤：
1. 获取所有实现了 `BeanPostProcessor` 的 `Bean` 的名字。（此时 `Bean` 还未实例化，但已扫描到所有 `Bean`，并收集了 `BeanDefinition`）。
   ![PostProcessorRegistrationDelegate-registerBeanPostProcessors-1](/spring/PostProcessorRegistrationDelegate-registerBeanPostProcessors-1.png)
2. 调用 `getBean` 方法，通过 `BeanName` 获取实例 `Bean`，并存入 `AbstractBeanFactory` 中的 `beanPostProcessors` 属性内。

### 何时调用？
`AbstractAutowireCapableBeanFactory` 的 `initializeBean` 方法
![AbstractAutowireCapableBeanFactory-initializeBean](/spring/AbstractAutowireCapableBeanFactory-initializeBean.png)

## 子接口
### `InstantiationAwareBeanPostProcessor`
`InstantiationAwareBeanPostProcessor` 是 `BeanPostProcessor` 的一个子接口，它额外定义了三个方法：
```java
public interface InstantiationAwareBeanPostProcessor extends BeanPostProcessor {
	@Nullable
	default Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
		return null;
	}
	default boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
		return true;
	}
	@Nullable
	default PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName)
			throws BeansException {
		return pvs;
	}
}
```
### `SmartInstantiationAwareBeanPostProcessor`
### `DestructionAwareBeanPostProcessor`
### `MergedBeanDefinitionPostProcessor`

## 实现类 
### `AutowiredAnnotationBeanPostProcessor`
用于解析含有 `@Autowired`、`@Value` 注解的依赖属性及方法

### `CommonAnnotationBeanPostProcessor`
用于解析含有 `@Resource`、`@Resource`、`@PostConstruct`、`@PreDestroy` 注解的依赖属性及方法

### `ConfigurationPropertiesBindingPostProcessor`
这是在 `spring boot` 中的一个实现类，用于 `@ConfigurationProperties`标注的 `Bean` 的属性绑定。
```java
//如何创建一个ConfigurationPropertiesBindingPostProcessor对象，register方法需要一个BeanFactory对象作为参数
ConfigurationPropertiesBindingPostProcessor postProcessor = ConfigurationPropertiesBindingPostProcessor.register(context.getDefaultListableBeanFactory());
```
