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

## `spring.config.import`
`spring.config.import` 是 Spring Boot 2.4 引入的一个新特性，用于在 `application.yml` 或 `application.properties` 中动态导入其他配置文件。它提供了一种灵活的方式来组合多个配置文件，使得配置管理更加模块化和可扩展。

---

### **1. `spring.config.import` 的作用**
- 用于在 Spring Boot 应用中导入额外的配置文件。
- 支持导入本地文件、类路径文件、远程配置（如 Config Server）等。
- 可以在 `application.yml` 或 `application.properties` 中直接使用，无需额外的代码。

---

### **2. 使用方式**
在 `application.yml` 或 `application.properties` 中，通过 `spring.config.import` 属性指定需要导入的配置文件路径。

#### **示例 1：导入类路径下的配置文件**
```yaml
spring:
  config:
    import:
      - classpath:custom-config.yml
      - classpath:another-config.yml
```

#### **示例 2：导入文件系统中的配置文件**
```yaml
spring:
  config:
    import:
      - file:/path/to/external-config.yml
```

#### **示例 3：导入远程配置（如 Spring Cloud Config Server）**
```yaml
spring:
  config:
    import:
      - configserver:http://config-server-url
```

#### **示例 4：混合导入**
```yaml
spring:
  config:
    import:
      - classpath:custom-config.yml
      - file:/path/to/external-config.yml
      - configserver:http://config-server-url
```

---

### **3. 导入顺序**
- Spring Boot 会按照 `spring.config.import` 中定义的顺序加载配置文件。
- 后加载的配置会覆盖先加载的配置（如果存在相同的属性）。

例如：
```yaml
spring:
  config:
    import:
      - classpath:config1.yml
      - classpath:config2.yml
```
- 如果 `config1.yml` 和 `config2.yml` 中都有 `server.port` 属性，则 `config2.yml` 中的值会覆盖 `config1.yml` 中的值。

---

### **4. 支持的文件类型**
`spring.config.import` 支持导入以下类型的配置文件：
- **类路径文件**：`classpath:filename.yml`
- **文件系统文件**：`file:/path/to/filename.yml`
- **目录**：`file:/path/to/directory/`（会加载目录下的所有配置文件）
- **远程配置**：`configserver:http://config-server-url`（需要 Spring Cloud Config 支持）
- **可选导入**：`optional:classpath:filename.yml`（如果文件不存在，不会报错）

---

### **5. 可选导入**
如果导入的配置文件可能不存在，可以使用 `optional:` 前缀来避免因文件缺失而导致的启动失败。

#### **示例**
```yaml
spring:
  config:
    import:
      - optional:classpath:custom-config.yml
```
- 如果 `custom-config.yml` 不存在，Spring Boot 会忽略它并继续启动。

---

### **6. 与 `spring.config.additional-location` 的区别**
- `spring.config.additional-location` 是 Spring Boot 2.4 之前用于指定额外配置文件路径的属性。
- `spring.config.import` 是更灵活的方式，支持动态导入，且可以与 `spring.config.additional-location` 一起使用。

#### **示例**
```yaml
spring:
  config:
    additional-location: classpath:custom-config.yml
    import:
      - classpath:another-config.yml
```

---

### **7. 实际应用场景**
#### **场景 1：模块化配置**
将不同模块的配置拆分到不同的文件中，通过 `spring.config.import` 动态加载。

```yaml
spring:
  config:
    import:
      - classpath:database-config.yml
      - classpath:redis-config.yml
      - classpath:security-config.yml
```

#### **场景 2：环境隔离**
为不同环境加载不同的配置文件。

```yaml
spring:
  profiles:
    active: dev
  config:
    import:
      - classpath:application-dev.yml
      - classpath:application-common.yml
```

#### **场景 3：远程配置**
结合 Spring Cloud Config Server，动态加载远程配置。

```yaml
spring:
  config:
    import:
      - configserver:http://config-server-url
```

---

### **8. 注意事项**
1. **文件格式**：导入的文件可以是 `.yml` 或 `.properties` 格式。
2. **覆盖规则**：后加载的配置会覆盖先加载的配置。
3. **文件不存在**：如果导入的文件不存在且未使用 `optional:` 前缀，Spring Boot 会启动失败。
4. **顺序问题**：`spring.config.import` 的加载顺序会影响配置的优先级。

---

### **9. 完整示例**
以下是一个完整的 `application.yml` 示例，展示了如何使用 `spring.config.import` 导入多个配置文件：

```yaml
spring:
  application:
    name: my-app
  config:
    import:
      - classpath:database-config.yml
      - classpath:redis-config.yml
      - optional:classpath:optional-config.yml
      - file:/path/to/external-config.yml
      - configserver:http://config-server-url
```

---

### **总结**
`spring.config.import` 是 Spring Boot 2.4 引入的一个强大特性，能够灵活地导入和管理配置文件。它支持类路径文件、文件系统文件、远程配置等多种方式，并且可以通过 `optional:` 前缀避免因文件缺失导致的启动失败。在实际项目中，合理使用 `spring.config.import` 可以让配置管理更加模块化和清晰。

## 参考资料
- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/reference/features/profiles.html)