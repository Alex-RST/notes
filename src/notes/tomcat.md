# Tomcat

## Tomcat架构
![tomcat架构](/notes/tomcat/tomcat-framework.drawio.png "tomcat架构")

## Tomcat类加载器结构
一个健全的Web服务器通常需要解决以下问题：
- 部署在同一个服务器上的两个Web应用程序所使用的Java类库可以实现相互隔离。
- 部署在同一个服务器上的两个Web应用程序所使用的Java类库可以相互共享。（与前一条相反）
- 服务器需要尽可能的保证自身的安全不受部署的Web应用程序影响。
- 支持JSP应用的Web服务器，十有八九都需要支持HotSwap（热替换）功能。

为了解决上述问题，Tomcat设计了三组目录，与webapp内部的`WEB-INF`组成了四个不同区域，可笼统的划分为`服务器域`和`WebApp域`，但默认不一定开放，可能只存在`/lib/`目录：
- `/common`：可以被Tomcat和所有WebApp共同使用。
- `/server`：可以被Tomcat使用，对所有WebApp不可见。
- `/shared`：对所有WebApp共同使用，对Tomcat不可见。
- `/WebApp/WEB-INF`：仅仅对当前WebApp可可使用，对Tomcat和其他WebApp不可见。

为了支持上述目录结构，Tomcat自定义了多个类加载器，并按照经典的双亲委派机制模型进行实现：
<div align=center>
    <img src="/notes/tomcat/tomcat-classloader-framework.drawio.png" />
</div>

三个灰色的是JDK默认提供的类加载器，剩下的由Tomcat自定义的类加载器。其中WebApp类加载器和JSP类加载器还会存在多个实例，每一个WebApp对应一个WebApp类加载器，每一个JSP文件对应一个JasperLoader类加载器。

::: tip
- JDK9之后，因加入了模块化机制，Extension ClassLoader由Platform ClassLoader替代。
- 上述类加载结构，在Tomcat6以前是默认结构。在Tomcat6及之后，简化了此结构，将`/common`、`/server`、`/shared`默认合并到一起变成`/lib`目录。
:::

## WebApp目录结构
一个正常的Web服务器是从外部加载这些组件的，根据Servlet规范，Web App开发者完成了`Servlet`、`Filter`和`Listener`等组件后，需要按规范把它们打包成`.war`文件。`.war`文件本质上就是一个`jar`包，但它的目录组织如下<sup><a href="#ref1">1</a></sup>：

```text
hello-webapp
├── WEB-INF
│   ├── classes
│   │   └── com
│   │       └── example
│   │           ├── filter
│   │           │   └── LogFilter.class
│   │           ├── listener
│   │           │   ├── HelloHttpSessionListener.class
│   │           │   └── HelloServletContextAttributeListener.class
│   │           ├── servlet
│   │           │   ├── HelloServlet.class
│   │           │   └── IndexServlet.class
│   │           └── util
│   │               └── DateUtil.class
│   └── lib
│       ├── logback-classic-1.4.6.jar
│       ├── logback-core-1.4.6.jar
│       └── slf4j-api-2.0.4.jar
├── contact.html
└── favicon.ico
```
Servlet规范规定，一个`.war`包解压后，目录`/WEB-INF/classes`存放所有编译后的.class文件，目录`/WEB-INF/lib`存放所有依赖的第三方jar包，其他文件可按任意目录存放。  

Web服务器通常会提供一个用于访问文件的`Servlet`，对于以`/WEB-INF/`开头的路径，Web服务器会拒绝访问，其他路径则按正常文件访问，因此，路径`/contact.html`可以被访问到，而路径`/WEB-INF/contact.html`则不能被访问到。注意这个限制是针对浏览器发出的请求的路径限制，如果在Servlet内部读写`/WEB-INF/`目录下的文件则没有任何限制。利用这个限制，很多`MVC`框架的模版页通常会存放在`/WEB-INF/templates`目录下。

## Servlet
### Servlet声明与配置
声明Servlet有两种方式：
- 配置web项目中`web.xml`。
- 通过java注解的方式，`@WebServlet`。

::: tip
- 以下两种方式只能选择其一；一个Servlet不能同时使用`@WebServlet`和`web.xml`进行配置。
- 在配置路径时，注意路径不能冲突，且路径使用 `/` 开头。
:::

#### 名字
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml]
<servlet>
    <servlet-name>servlet名字</servlet-name>
    <servlet-class>servlet对应的java全类名</servlet-class>
</servlet>
```
:::

#### url路径
::: code-group
```java [@WebServlet]
@WebServlet(value = {"/url1","/url2/*"})  
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml]
<servlet>
    <servlet-name>servlet名字</servlet-name>
    <servlet-class>servlet对应的java全类名</servlet-class>
</servlet>
<servlet-mapping>// [!code focus:4]
    <servlet-name>在上方servlet标签中配置的名字</servlet-name>
    <url-pattern>此servlet所匹配的url路径</url-pattern>
</servlet-mapping>
```
:::

#### 加载顺序
- 类型：`int`
- 说明：小于0，容器启动时不会实例化；大于0，启动时实例化，数字越大，顺序越靠后。数字相同时根据Servlet名字的自然顺序进行实例化。
::: code-group
```java [@WebServlet]
@WebServlet(
    name = "firstServlet",
    loadOnStartup = -1 // [!code focus]
)  
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml]
<servlet>
    <servlet-name>servlet名字</servlet-name>
    <servlet-class>servlet对应的java全类名</servlet-class>
    <load-on-startup>1</load-on-startup> // [!code focus]
</servlet>
```
:::

#### 初始化参数
- 类型：`@WebInitParam`
- 说明：Servlet在初始化阶段（`init`）可获取的参数
::: code-group
```java [@WebServlet]
@WebServlet(
    name = "name"
    initParams = {// [!code focus:4]
        @WebInitParam(name = "param1", value = "value1"),
        @WebInitParam(name = "param2", value = "value2")
    }
) 
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml] 
<servlet> 
    <servlet-name>servlet名字</servlet-name>
    <init-param>// [!code focus:8]
        <param-name>param1</param-name>
        <param-value>value1</param-value>
    </init-param>
    <init-param>
        <param-name>param2</param-name>
        <param-value>value2</param-value>
    </init-param>
</servlet>
```
:::

#### 异步支持
::: code-group
```java [@WebServlet]
@WebServlet(asyncSupported = true)  // [!code focus]
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml]
<servlet>
    <servlet-name>servlet名字</servlet-name>
    <servlet-class>servlet对应的java全类名</servlet-class>
    <async-supported>false</async-supported>// [!code focus]
</servlet>
```
:::

#### 描述
::: code-group
```java [@WebServlet]
@WebServlet(description = "description")  // [!code focus]
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml]
<servlet>
    <servlet-name>servlet名字</servlet-name>
    <servlet-class>servlet对应的java全类名</servlet-class>
    <description>false</description>// [!code focus]
</servlet>
```
:::

#### 显示名
::: code-group
```java [@WebServlet]
@WebServlet(displayName = "displayName")  // [!code focus]
public class FirstServlet extends HttpServlet {
    //...
}
```
```xml [web.xml]
<servlet>
    <servlet-name>servlet名字</servlet-name>
    <servlet-class>servlet对应的java全类名</servlet-class>
    <display-name>false</display-name>// [!code focus]
</servlet>
```
:::

#### 小图标
::: code-group
```java [@WebServlet]
@WebServlet(smallIcon = "smallIcon")  // [!code focus]
public class FirstServlet extends HttpServlet {
    //...
}
```
:::

#### 大图标
::: code-group
```java [@WebServlet]
@WebServlet(largeIcon = "largeIcon")  // [!code focus]
public class FirstServlet extends HttpServlet {
    //...
}
```
:::


### Servlet生命周期
1. 创建
2. 初始化
3. 服务
4. 销毁

### web.xml
1. 全局范围的web.xml：`${tomcat_root}/conf/web.xml`。
2. 项目范围的：`${product_root}/web.xml`。
全局范围的web.xml存在许多默认配置，所有 webapp 都可访问。例如：当根据访问的资源，确定响应头中`content/type`的值。

### DefaultServlet
在`${tomcat_root}/conf/web.xml`中声明了服务器默认的Servlet除了*.jsp资源外，所有无法匹配到Servlet的资源，都交由 `DefaultServlet` 处理。

### ServletConfig
在@WebServlet中或web.xml中配置的初始化参数，会生成一个 ServletConfig对象并在 Servlet 初始化阶段，传给声明了这些参数的 Servlet。
常用方法：
```java
public class DemoServlet extends HttpServlet {
    public void service() { 
        //获取当前Servlet的ServletConfig对象
        ServletConfig servletConfig = getServletConfig();
        //根据key获取声明的初始化参数
        servletConfig.getInitParameter("key");
    }
}
```

### ServletContext
应用域对象。在一个web应用中只有一个此对象。在项目的 web.xml 中可以配置 context-param ，项目启动时，会创建一个servletContext对象，并根据 context-param注入指定参数。web.xml配置如下：
```xml
<context-param>
    <param-name>参数名</param-name>
    <param-value>参数值</param-value>
</context-param>
```
获取ServletContext以及ServletContext常用方法
```java
public class DemoServlet extends HttpServlet {
    public void service() {
        ServletConfig servletConfig = getServletConfig();
        //获取当前应用的servletContext
        ServletContext servletContext = servletConfig.getServletContext();
        //获取应用域参数
        Object param = servletContext.getAttribute("key");
        //设置应用域参数
        servletContext.setAttribute("key", "value");
        //移除应用域参数
        servletContext.removeAttribute("key");

        //获得一个指向项目部署位置下的某个文件/目录的磁盘真实路径的API
        String path = servletContext.getRealPath("path");
        //获取项目部署的上下文路径 项目的访问路径
        String contextPath = servletContext.getContextPath();
    }
}
```

## Filter（过滤器）
Filter（过滤器），是J2EE提供的一种机制。用于对请求和响应进行特定处理，并决定是否继续执行。通过过滤器可以对请求进行拦截处理并执行统一操作，或对请求的特定资源进行预处理。也可以对响应结果进行同样操作。

要实现一个过滤器，必须要实现Filter接口，并通过`@WebFilter`或`web.xml`对此过滤器进行声明。Filter接口提供了三个待实现方法：
```java
public interface Filter {
    //初始化
    default void init(FilterConfig filterConfig) throws ServletException {}
    //执行过滤
    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;
    //销毁
    default void destroy() {}
}
```

### Filter声明与配置
过滤器的声明有两种方式，两种方式只能选其一：
1. `web.xml`中配置。
2. 使用`@WebListener`注解。
::: code-group
```java [@WebFilter]
@WebFilter("/*") // [!code focus]
public MyFilter interface Filter {
    //...
}
```
```xml [web.xml]
<filter>
    <filter-name>myFilter</filter-name>
    <filter-class>${Fully Qualified Name}</filter-class>
</filter>
```
:::


若无特殊要求（例如资源释放等），通常只需实现`doFilter`方法，通常可以分为三个部分：
- 第一部分代码会对游览器请求进行第一次过滤，然后继续执行。
- 第二部分代码就是将浏览器请求放行，如果还有过滤器，那么就继续交给下一个过滤器。  
   可以根据第一部分的执行结果，判断是否需要继续执行过滤器链执行的过滤方法。当确定需要继续交给之后的过滤器之后，需要自行调用`FilterChain#doFilter`方法。当此过滤器已经是最后一个过滤器时，`FilterChain#doFilter`方法将调用目标资源方法（Servlet则调用Service；静态资源则直接访问该资源）。
- 第三部分代码就是对返回的Web资源再次进行过滤处理。

#### urlPatterns/vaule
url路径匹配，匹配到的url会交由此过滤器
::: code-group
```java [@WebFilter]
@WebFilter({"/a/c", "/a/b", "/b/p/*"}) // [!code focus]
public MyFilter interface Filter {
    //...
}
```
```xml [web.xml]
<filter-mapping>
    <filter-name>${filter-ame}</filter-name>
    <url-pattern>/*</url-pattern> // [!code focus]
</filter-mapping>
```
:::

#### filterName
::: code-group
```java [@WebFilter]
@WebFilter(filterName = ${filterName}) // [!code focus]
public MyFilter interface Filter {
    //...
}
```
```xml [web.xml]
<filter>
    <filter-name>${filter-name}</filter-name> // [!code focus]
    <filter-class>${Fully Qualified Name}</filter-class>
</filter>
```
:::

#### initParams
Filter初始化参数，容器启动时生成一个FilterConfig对象，传给此过滤器的`Filter#init(FilterConfig config)`方法。
::: code-group
```java [@WebFilter]
@WebFilter(initParams = { // [!code focus:4]
        @WebInitParam(name = "param1", value = "value1"),
        @WebInitParam(name = "param2", value = "value2")
    }) 
public MyFilter interface Filter {
    //...
}
```
```xml [web.xml]
<filter>
    <filter-name>${name}</filter-name>
    <init-param> // [!code focus:8]
        <param-name>param1</param-name>
        <param-value>value1</param-value>
    </init-param>
    <init-param>
        <param-name>param2</param-name>
        <param-value>value2</param-value>
    </init-param>
</filter>
```
:::

#### servletNames
此 Filter 应用到的 Servlet 名称数组
::: code-group
```java [@WebFilter]
@WebFilter(servletNames = {"servlet1", "servlet2"}) // [!code focus]
public MyFilter interface Filter {
    //...
}
```
```xml [web.xml]
<filter-mapping>
    <filter-name>MyFilter</filter-name>
    <servlet-name>${servlet-name}</servlet-name>// [!code focus]
</filter-mapping>
```
:::

#### dispatcherTypes
此 Filter 应用到的 DispatcherTypes 数组  

类型：DispatcherType，定义如下
```java
public enum DispatcherType {
    /**
     * {@link RequestDispatcher#forward(ServletRequest, ServletResponse)}
     */
    FORWARD,

    /**
     * {@link RequestDispatcher#include(ServletRequest, ServletResponse)}
     */
    INCLUDE,

    /**
     * Normal (non-dispatched) requests.
     */
    REQUEST,

    /**
     * {@link AsyncContext#dispatch()}, {@link AsyncContext#dispatch(String)} and
     * {@link AsyncContext#addListener(AsyncListener, ServletRequest, ServletResponse)}
     */
    ASYNC,

    /**
     * When the container has passed processing to the error handler mechanism such as a defined error page.
     */
    ERROR
}
```
::: code-group
```java [@WebFilter]
@WebFilter(dispatcherTypes = DispatcherType.REQUEST) // [!code focus]
public MyFilter interface Filter {
    //...
}
```
```xml [web.xml]
<filter-mapping>
    <filter-name>MyFilter</filter-name>
    <dispatcher>REQUEST</dispatcher> // [!code focus]
</filter-mapping>
```
:::

### 实现一个简单过滤器
```java
@WebFilter("/*")
public MyFilter interface Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        //第一部分
        //...
        //第二部分调用过滤器链下一个过滤方法
        chain.doFilter(request, response);
        //第三部分
        //...
    }
}
```

## Listener（监听器）
Listener（监听器），是 J2EE 提供的一种机制，用于监听以及响应事件。

监听器可以类比于观察者模式。监听器充当观察者，在观察者模式中，一个对象（观察者）注册对另一个对象（被观察者）的事件感兴趣，并在被观察者触发相应事件时得到通知并执行相应操作。

### 常用的监听器
- ServletContextListener：  
  监听ServletContext对象的创建和销毁事件，当Web应用程序启动和关闭时触发。 
- ServletContextAttributeListener：  
  监听ServletContext中属性的添加、修改和删除事件。
- HttpSessionListener：  
  监听HttpSession对象的创建和销毁事件，当用户与Web应用程序建立和关闭会话时触发。
- HttpSessionAttributeListener：  
  监听HttpSession中属性的添加、修改和删除事件。
- ServletRequestListener：  
  监听ServletRequest对象的创建和销毁事件，在每次客户端请求到达服务器时触发。
- ServletRequestAttributeListener：  
  监听ServletRequest中属性的添加、修改和删除事件。
- HttpSessionBindingListener  
  监听当前监听器在Session中的增加与移除。 它的使用方式完全不同。在需要使用此监听器时，先实例化一个此监听器实力，再通过 `HttpSession#addAttribute` 方法绑定到session对象，此时立即出发此监听器的 `HttpSessionBindingListener#valueBound` 方法。当从session中移除或session失效时，触法其 `HttpSessionBindingListener#valueUnbound` 方法。
- HttpSessionActivationListener：  
  监听HttpSession对象的钝化（passivation）和活化（activation）事件，与分布式会话（Di:stributed Session）有关。使用方法与 `HttpSessionBindingListener` 类似，但需要进行额外配置。  
  > 如何配置钝化与活化?
  1. 在 web 目录下，添加 META-INF 目录，并创建 `Context.txt`
  	```text
  	web
  	  ├─static
  	  ├─WEB-INF
  	  └─META-INF
  	      └─Context.xml
  	```
  2. 在Context.xml中，配置钝化
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <Context>
        <Manager className="${Fully Qualified Name}" maxIdleSwap="1">
            <Store className="${Fully Qualified Name}" directory="${save-path（序列化保存路径）}"></Store>
        </Manager>
    </Context>
    ```

### Listener声明
监听器的声明有两种方式，两种方式只能选其一：
- `web.xml`中配置。
- 使用`@WebListener`注解。

::: code-group
```java [@WebListener]
@WebListener("${description}")
public class DemoListener implements ServletContextListener {
    //...
}
```
```xml [web.xml]
<listener>
    <listener-class>${listener-class}</listener-class>
</listener>
```
:::

## 常见问题
### 控制台输出乱码解决办法
1. 打开`{tomcat安装目录}/conf/logging.properties`文件。
2. 找到并修改`java.util.logging.ConsoleHandler.encoding`的值为控制台输出的字符集。
3. 重新启动tomcat。

### webapp的项目结构
```text
webapp
  ├─static
  └─WEB-INF
      ├─web.xml
      ├─classes
      └─lib
```
- WEB-INF：不可以被直接访问的资源
- static：可直接访问的静态资源（html，css，js，img等。也可以直接放在项目根目录下，例如此处的webapp目录）

### web项目部署
- 将标准的webapp，放入tomcat根目录/webapp中。
- 可将目录放在系统的任意路径下，但需要对tomcat进行配置。在`tomcatcat根目录/conf`下新建Catalina目录，新增一个需要部署的项目的配置文件，文件名为`xxx.xml`，其中`xxx`为需要部署的项目根目录名。文件内容：
  ```xml
  <Context path="" docBase=""/>
  ```
  path中为项目的资源访问路径；docBase为项目所在的系统路径。

### host-manager和manager
1. 打开`tomcat根目录/conf/tomcat-users.xml`
2. 配置用户登录信息
	```xml
	<role rolename="tomcat"/>
	<role rolename="role1"/>
	<user username="tomcat" password="<must-be-changed>" roles="tomcat"/>
	<user username="both" password="<must-be-changed>" roles="tomcat,role1"/>
	<user username="role1" password="<must-be-changed>" roles="role1"/>
	```
3. 重启tomcatS

### 响应头中的content/type
当tomcat收到一个请求后，获取到请求的资源放入，封装好的Response对象中。根据资源的类型（扩展名），自动的与'tomcat安装目录'/conf/web.xml文件中的配置进行匹配，获取到对于的content/type类型，并写入响应头中。当没有与之匹配的类型时，浏览器将自动的将响应数据作为html文件进行处理并展示。所有，当请求的资源时一个动态资源时（如servlet）,应根据将返回的响应数据，在响应头中设置对应的content/type字段。

### 路径问题
- 相对路径：相对路径以 `./` 开头或直接写资源路径。
- 绝对路径：以 `/` 开头。
- 请求转发需要不需要上下文路径作为开头；重定向需要上下文路径作为开头。
- 因以客户角度（浏览器视角）考虑访问的资源路径问题。例如：当访问资源为`http://localhost:80/a/b/servlet`，并且在响应中存在一个 `<img src="static/index.img" />`时，当浏览器获得到响应时，发现需要`static/index.html`资源，会再次发送请求，路径为`http://localhost:80/a/b/static/index.img`。原因是：浏览器会以 `http://localhost:80/a/b/servlet` 中的 `http://localhost:80/a/b` 开始，拼接`src`属性中的相对路径 `static/index.img`。

## 参考文献
1. [手写Tomcat](https://liaoxuefeng.com/books/jerrymouse/servlet-spec/index.html)
2. [Tomcat 源码仓库地址](https://github.com/apache/tomcat)
3. [Tomcat 主页地址](https://tomcat.apache.org/)
4. [Java面试——Tomcat](https://blog.csdn.net/m0_74825541/article/details/145589026?spm=1000.2115.3001.6382&utm_medium=distribute.pc_feed_v2.none-task-blog-personrec_tag-18-145589026-null-null.329^v9^%E4%B8%AA%E6%8E%A8pc%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E2%80%94%E6%A1%B62&depth_1-utm_source=distribute.pc_feed_v2.none-task-blog-personrec_tag-18-145589026-null-null.329^v9^%E4%B8%AA%E6%8E%A8pc%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E2%80%94%E6%A1%B62)
5. [最详细的Tomcat架构解析！深入理解Tomcat的架构原理以及Tomcat组件分析](https://juejin.cn/post/7055306172265414663?searchId=202504091617576FAEC077AE48A8C99A56)
