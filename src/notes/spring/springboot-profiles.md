# Spring Boot 配置文件

## 添加活动配置文件

### `spring.profiles.active`
- 可以指定多个活动配置文件，使用 `,` 分隔。
- 当指定多个活动文件，越靠后优先级越高。
- 也可以在命令行中使用以下开关来指定它： `--spring.profiles.active=dev,hsqldb`。
```yml
spring: 
  profiles: 
    active: "prod, mysqldb" //同一属性，mysqldb中的优先级更高，所以会使用mysqldb中的值
```

### `spring.profiles.default`
- 当没有使用 `spring.profiles.active` 指定活动文件时，使用默认文件
```yml
spring: 
  profiles: 
    default: prod
```

### `spring.profiles.include`
```yml
spring: 
  profiles: 
    include: ["dev", "mysqldb"]
```

## 单文件多文档
```yml
spring:
  profiles: 
    active: prod
---
spring: 
  config:  
    activate: 
      on-profile: prod
//其他配置项
---
spring: 
  config:  
    activate: 
      on-profile: test
//其他配置项
---
```

## 配置文件组
- 概要文件组允许您为相关的概要文件组定义一个逻辑名称。
- 可以使用 `--spring.profiles.active=production` 来启动 `production`
```yml
spring:
  profiles:
    group:
      production:
      - "proddb"
      - "prodmq"
```
  
:::tip
- `spring.profiles.active`, `spring.profiles.default`, `spring.profiles.include`, `spring.profiles.group`不能包含在配置文件特定的文件或由 `spring.config.activate.on-profile` 激活的文档中
- 当使用 `spring.profiles.group` 配置的组名与已有的 `profile` 相同，将使用组内的配置。
- 优先加载 `spring.profiles.include` 指定的活动文件，再加载 `spring.profiles.active`。当 `spring.profiles.active` 中重复指定了相同文件，则此文件不再重复加载。
:::

## 以编程方式设置配置文件
您可以通过在应用程序运行之前调用 `SpringApplication.setAdditionalProfiles(…​)` 以编程方式设置活动配置文件。也可以通过使用Spring的 ConfigurableEnvironment 接口来激活概要文件。

## 参考资料
- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/reference/features/profiles.html)