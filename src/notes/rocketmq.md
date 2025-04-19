# RocketMQ

Apache RocketMQ 中消息的生命周期主要分为**消息生产**、**消息存储**、**消息消费**这三部分。

## RocketMQ架构

### 架构图  
<div align=center>
    <img src="/notes/rocketmq/rocketmq-architecture-diagram.png" />
</div>

### 四大组件
- `NameServer`
- `Broker`
- `Proxy`
- `Producer`
- `Comsumer`

## 消息种类
- 普通消息
- 顺序消息
- 事务消息
- 延迟消息

## 消息发送方式
- 同步发送
- 异步发送
- 单向发送

## 同步/异步刷盘

## 同步/异步复制

## 参考资料
- [RocketMq详解](https://blog.csdn.net/zhiyikeji/article/details/138286088?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522e166c5367231c8019afc2d6019a095ec%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=e166c5367231c8019afc2d6019a095ec&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-2-138286088-null-null.142^v101^control&utm_term=rocketmq&spm=1018.2226.3001.4187)