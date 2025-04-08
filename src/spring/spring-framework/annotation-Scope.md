# `@Scope` 注解

## `Scope` 的属性
### `scopeName`
表示实例的范围，有五种：
- **`singleton`**：单例（默认）。
- **`prototype`**：多例。
- **`request`**：同一**请求域**内只会有一个实例。
- **`session`**：同一**会话域**只会有一个实例。
- **`application`**：同一**应用域**只会有一个实例。

其中 `request`、`session`、`application` 三种范围，与 web 应用密切相关，`application` 是指的同一个 `servletContext` 级别。 

### `proxyMode`
指定是否应将组件配置为范围代理，如果是，则代理应基于接口还是基于子类。
- `ScopedProxyMode.DEFAULT`：默认。
- `ScopedProxyMode.NO`：不进行代理。
- `ScopedProxyMode.INTERFACES`：基于接口（JDK 代理）
- `ScopedProxyMode.TARGET_CLASS`：基于类（cglib 代理）

## `@Scope` 失效的解决方案
当在一个单例 `Bean` 需要注入一个其他实例范围（即除开 `singleton` 范围）的 `Bean` 时，`scope` 可能会失效。是因为在一个单例 `Bean` 的创建以后，只会执行一次依赖注入，所以当没有特殊处理的情况下，直接使用 `@Autowired` 注解注入一个其他 `scope` 的 `Bean` 作为依赖属性，那该属性永远都不会变，与原本因该多例的 `Bean` 相违背。

解决方案有如下几种：
- 使用 `@Lazy` 注解
  在需要依赖注入的单例 `Bean` 的属性上加上 `@Lazy` 注解。原理见：[Autowired - 注入底层原理 - 解析注解](/spring/spring-framework/annotation-Autowired#解析注解)
- 指定 `proxyMode` 属性  
  在注入的目标 `Bean` 上，在 `@Scope` 注解中添加 `proxyMode=ScopedProxyMode.TARGET_CLASS`
- 使用 `ObjectFactory` 包装  
  使用 `ObjectFactory` 包装依赖属性。
- 通过 `ApplicationContext` 获取依赖  
  注入 `ApplicationContext` 属性，通过其 `getBean` 等方法获取。

## 参考资料
- [Spring 源码解析 50 讲](/spring/spring-50)
- [黑马程序员Spring视频教程，深度讲解spring5底层原理](https://www.bilibili.com/video/BV1P44y1N7QG?spm_id_from=333.788.videopod.episodes&vd_source=82c8936823dd2e33632d42e87e1732ba&p=29)