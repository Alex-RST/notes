# 跨域问题

## 解决方案
### `@CrossOrigin` 注解
```java
@RestController
@RequestMapping("test")
public class Test {
  @CrossOrigin
  @RequestMapping("crossOrigin")
  public String crossOrigin() {
    return "success";
  }
}
```

### `CorsFilter`
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*"); //允许哪些域访问
        corsConfiguration.addAllowedHeader("*"); //允许哪些头字段
        corsConfiguration.addAllowedMethod("*"); //允许哪些请求方式
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }
}
```

### 实现 `WebMvcConfigurer`
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 参考资料
- [禹神：一小时彻底搞懂跨域&解决方案](https://www.bilibili.com/video/BV1pT421k7yz?spm_id_from=333.788.recommend_more_video.-1&vd_source=82c8936823dd2e33632d42e87e1732ba)
- [跨域问题梳理](https://www.yuque.com/tianyu-coder/openshare/aksmvpbebgw7savk)