# Spring Boot 配置文件

## 活跃配置文件
- 可以指定多个活跃配置文件，使用 `,` 分隔。
- 当指定多个活跃文件，越靠后优先级越高。
```yml
spring: 
  profiles: 
    active: "prod, mysqldb" //同一属性，mysqldb中的优先级更高，所以会使用mysqldb中的值
```
- 也可以在命令行中使用以下开关来指定它： `--spring.profiles.active=dev,hsqldb`。

## 默认配置文件
- 当没有使用 `spring.profiles.active=dev` 指定活跃文件时，使用默认文件
```yml
spring: 
  profiles: 
    default: prod
```

## 单文件多配置
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

## 参考资料
- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/reference/features/profiles.html)
