# Rest Clients

## RestClient
配置一个`RestClient`类型的`Bean`
```java
@Configuration
public class RestClientConfig {
    @Bean
    public RestClient customRestClient(CozeProperties cozeProperties) {
        RestClient customClient = RestClient.builder()
                .requestFactory(new HttpComponentsClientHttpRequestFactory())
                .messageConverters(converters -> converters.add(new MyCustomMessageConverter()))
                .baseUrl("https://example.com")
                .defaultUriVariables(Map.of("variable", "foo"))
                .defaultHeader("My-Header", "Foo")
                .defaultCookie("My-Cookie", "Bar")
                .requestInterceptor(myCustomInterceptor)
                .requestInitializer(myCustomInitializer)
                .build();
    }
}
```

使用`RestClient`
```java

```

## WebClient

## RestTemplate

## Http Interface

## 参考资料
- [REST Clients](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-http-interface)
- [WebClient](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)