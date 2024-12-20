# DynamicTp 快速上手指南

::: tip
- 本文核心内容在于快速的在`SpringBoot`项目中集成`DynamicTp`框架，并实现对线程池资源的实时监控与参数的动态配置。
- 本案列使用nacos作为配置中心。也可以使用zookeeper等，详见[DynamicTp 官方文档](#参考资料)。
- 本文大部分内容均来自`DynamicTp`官方文档，文档地址详见[DynamicTp 官方文档](#参考资料)。
- 相关环境说明：
  - `SpringBoot` 3.1.x
  - `jdk17` 或 以上
  - `Grafana`
  - `Prometheus`
:::

::: warning :warning:警告
- `SpringBoot 3.2.x` 与 `Nacos 0.2.12` 及之前的版本不兼容。
:::

## 环境搭建
- 安装 `Prometheus`
- 安装 `Grafana`

## 引入依赖
- `DynamicTp`相关依赖。使用其他的配置中心，请引入对应的依赖。
  ```xml
  <dependency>
	  <groupId>org.dromara.dynamictp</groupId>
	  <artifactId>dynamic-tp-spring-boot-starter-nacos</artifactId>
	  <version>${dynamic-tp.version}</version>
  </dependency>
  ```
- `Prometheus`相关依赖
  ```xml
  <dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
  </dependency>
  ```
- `Nacos`配置中心依赖
  ```xml
	<dependency>
		<groupId>com.alibaba.boot</groupId>
		<artifactId>nacos-config-spring-boot-starter</artifactId>
		<version>${nacos-config-spring-boot-starter.version}</version>
	</dependency>
  ```

## 配置信息
- `application.yml`
  ```yaml
  nacos:
  config:
    server-addr: ${server-addr}
    namespace: ${namespace}
    type: yaml
    data-ids: ${data-id} //多个id用,分隔
    auto-refresh: true
    group: DEFAULT_GROUP
    bootstrap:
      enable: true
      log-enable: true
  ```
- `DynamicTp` 此配置放在配置中心，并在 `application.yml` 中指定
  ```yml
  spring:
  dynamic:
    tp:
      enabled: true                               # 是否启用 dynamictp，默认true
      enabledCollect: true                        # 是否开启监控指标采集，默认true
      collectorTypes: micrometer,logging          # 监控数据采集器类型（logging | micrometer | internal_logging | JMX），默认micrometer
      logPath: /home/logs/dynamictp/user-center/  # 监控日志数据路径，默认 ${user.home}/logs，采集类型非logging不用配置
      monitorInterval: 5                          # 监控时间间隔（报警检测、指标采集），默认5s
      platforms:                                  # 通知报警平台配置
        - platform: wechat
          platformId: 1                            # 平台id，自定义
          urlKey: 3a700-127-4bd-a798-c53d8b69c     # webhook 中的 key
          receivers: test1,test2                   # 接受人企微账号
          
        - platform: ding
          platformId: 2                            # 平台id，自定义
          urlKey: f80dad441fcd655438f4a08dcd6a     # webhook 中的 access_token
          secret: SECb5441fa6f375d5b9d21           # 安全设置在验签模式下才的秘钥，非验签模式没有此值
          receivers: 18888888888                   # 钉钉账号手机号
          
        - platform: lark
          platformId: 3
          urlKey: 0d944ae7-b24a-40                 # webhook 中的 token
          secret: 3a750012874bdac5c3d8b69c         # 安全设置在签名校验模式下才的秘钥，非验签模式没有此值
          receivers: test1,test2                   # 接受人username / openid
          
        - platform: email
          platformId: 4
          receivers: 123456@qq.com,789789@qq.com   # 收件人邮箱，多个用逗号隔开
          
      executors:                               # 动态线程池配置，都有默认值，采用默认值的可以不配置该项，减少配置量
        - threadPoolName: dtpExecutor1         # 线程池名称，必填
          threadPoolAliasName: 测试线程池        # 线程池别名，可选
          executorType: common                 # 线程池类型 common、eager、ordered、scheduled、priority，默认 common
          corePoolSize: 6                      # 核心线程数，默认1
          maximumPoolSize: 8                   # 最大线程数，默认cpu核数
          queueCapacity: 2000                  # 队列容量，默认1024
          queueType: VariableLinkedBlockingQueue         # 任务队列，查看源码QueueTypeEnum枚举类，默认VariableLinkedBlockingQueue
          rejectedHandlerType: CallerRunsPolicy          # 拒绝策略，查看RejectedTypeEnum枚举类，默认AbortPolicy
          keepAliveTime: 60                              # 空闲线程等待超时时间，默认60
          threadNamePrefix: test                         # 线程名前缀，默认dtp
          allowCoreThreadTimeOut: false                  # 是否允许核心线程池超时，默认false
          waitForTasksToCompleteOnShutdown: true         # 参考spring线程池设计，优雅关闭线程池，默认true
          awaitTerminationSeconds: 5                     # 优雅关闭线程池时，阻塞等待线程池中任务执行时间，默认3，单位（s）
          preStartAllCoreThreads: false                  # 是否预热所有核心线程，默认false
          runTimeout: 200                                # 任务执行超时阈值，单位（ms），默认0（不统计）
          queueTimeout: 100                              # 任务在队列等待超时阈值，单位（ms），默认0（不统计）
          taskWrapperNames: ["ttl", "mdc"]               # 任务包装器名称，继承TaskWrapper接口
          notifyEnabled: true                            # 是否开启报警，默认true
          platformIds: [1,2]                             # 报警平台id，不配置默认拿上层platforms配置的所有平台
          notifyItems:                     # 报警项，不配置自动会按默认值（查看源码NotifyItem类）配置（变更通知、容量报警、活性报警、拒绝报警、任务超时报警）
            - type: change
              enabled: true
            
            - type: capacity               # 队列容量使用率，报警项类型，查看源码 NotifyTypeEnum枚举类
              enabled: true
              threshold: 80                # 报警阈值，默认70，意思是队列使用率达到70%告警
              platformIds: [2]             # 可选配置，本配置优先级 > 所属线程池platformIds > 全局配置platforms
              interval: 120                # 报警间隔（单位：s），默认120
           
            - type: liveness               # 线程池活性
              enabled: true
              threshold: 80                # 报警阈值，默认 70，意思是活性达到70%告警
           
            - type: reject                 # 触发任务拒绝告警
              enabled: true
              threshold: 100               # 默认阈值10
          
            - type: run_timeout            # 任务执行超时告警
              enabled: true
              threshold: 100               # 默认阈值10
          
            - type: queue_timeout          # 任务排队超时告警
              enabled: true
              threshold: 100               # 默认阈值10

  ```

## 参考资料
- [DynamicTp 官方文档](https://dynamictp.cn/guide/introduction/background.html)