# Spring Cloud Gateway

## 自定义断言工厂
```java
package org.alexrst.clouddemo.predicate;

import lombok.Data;
import org.springframework.cloud.gateway.handler.predicate.AbstractRoutePredicateFactory;
import org.springframework.cloud.gateway.handler.predicate.GatewayPredicate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;
import java.util.function.Predicate;

@Component
public class VipRoutePredicateFactory extends AbstractRoutePredicateFactory<VipRoutePredicateFactory.Config> {
    public VipRoutePredicateFactory() {
        super(Config.class);
    }
    @Override
    public Predicate<ServerWebExchange> apply(Config config) {
        return (GatewayPredicate) serverWebExchange -> {
            ServerHttpRequest request = serverWebExchange.getRequest();
            String first = request.getQueryParams().getFirst(config.param);
            return StringUtils.hasText(first) && first.equals(config.value);
        };
    }
    @Override
    public List<String> shortcutFieldOrder() {
        return List.of("param", "value");
    }

    @Data
    public static class Config {
        private String param;
        private String value;
    }
}
```

## 自定义过滤器工程
```java
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractNameValueGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class OnceTokenGatewayFilterFactory extends AbstractNameValueGatewayFilterFactory {

    @Override
    public GatewayFilter apply(NameValueConfig config) {
        return (exchange, chain) -> {
            //每次响应前添加一个一次性令牌，支持uuid、jwt等格式
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                ServerHttpResponse response = exchange.getResponse();
                HttpHeaders headers = response.getHeaders();
                String value = config.getValue();
                if("uuid".equals(value)) {
                    value = UUID.randomUUID().toString();
                } else if("jwt".equals(value)) {
                    value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImlhdCI6MTY4MTczNjA0MCwiZXhwIjoxNjgxNzM5NjQwfQ.7q1C8l7Z2nJ3k7vLtY9zVcG1wLd3e4vM5bN6cXoYjZk";
                }
                headers.add(config.getName(), value);
            }));
        };
    }
}
```

## 参考资料
- [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/reference/)