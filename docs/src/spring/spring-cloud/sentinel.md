# Spring Cloud Alibaba Sentinel

## 异常处理

### 处理Web接口异常
自定义一个BlockExceptionHandler

## 规则

### 流控规则
#### 流控模式
- 直接。只对资源进行直接控制
- 关联。
- 链路。

#### 流控效果
- 快速失败
- Warm up
- 匀速排队

### 熔断规则
**熔断策略**：慢调用比例、异常比例、异常数

### 热点规则