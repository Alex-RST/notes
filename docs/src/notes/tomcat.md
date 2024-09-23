# Tomcat

## tomcat使用startup.bat启动后，控制台输出乱码解决办法
  1. 打开{tomcat安装目录}/conf/logging.properties文件。
  2. 找到并修改java.util.logging.ConsoleHandler.encoding的值为控制台输出的字符集。
  3. 重新启动tomcat。

## webapp的项目结构
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

## web项目部署在tomcat的方式
1. 将标准的webapp，放入tomcat根目录/webapp中。
2. 
3. 可将目录放在系统的任意路径下，但需要对tomcat进行配置。在“tomcatcat根目录/conf”下新建Catalina目录，新增一个需要部署的项目的配置文件，文件名为xxx.xml。其中"xxx"为需要部署的项目根目录名。文件内容：
    ```xml
    <Context path="" docBase=""/>
    ```
    path中为项目的资源访问路径；docBase为项目所在的系统路径。

## 如何访问tomcat自带的host-manager和manager项目
1. 打开"tomcat根目录/conf/tomcat-users.xml"
2. 配置用户登录信息
   ```xml
   <role rolename="tomcat"/>
   <role rolename="role1"/>
   <user username="tomcat" password="<must-be-changed>" roles="tomcat"/>
   <user username="both" password="<must-be-changed>" roles="tomcat,role1"/>
   <user username="role1" password="<must-be-changed>" roles="role1"/>
   ```
3. 重启tomcatS

## 响应头中的content/type
当tomcat收到一个请求后，获取到请求的资源放入，封装好的Response对象中。根据资源的类型（扩展名），自动的与'tomcat安装目录'/conf/web.xml文件中的配置进行匹配，获取到对于的content/type类型，并写入响应头中。当没有与之匹配的类型时，浏览器将自动的将响应数据作为html文件进行处理并展示。所有，当请求的资源时一个动态资源时（如servlet）,应根据将返回的响应数据，在响应头中设置对应的content/type字段。

## 声明Servlet
声明Servlet有两种方式：
1. 配置web项目中web.xml。
2. 通过java注解的方式（@WebServlet）。

::: tip
1. 以下两种方式只能选择其一；一个Servlet不能同时使用@WebServlet和web.xml进行配置。
2. 在配置路径时，注意路径不能冲突，且路径使用 / 开头。
:::

下面将分别使用两种方式对Servlet的配置项进行展示：
### 名字
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extent HttpServlet {
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

### url路径
::: code-group
```java [@WebServlet]
@WebServlet(value = {"/url1","/url2/*"})  
public class FirstServlet extent HttpServlet {
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

### 加载顺序
::: code-group
```java [@WebServlet]
@WebServlet(
    name = "firstServlet",
    loadOnStartup = -1 // [!code focus]
)  
public class FirstServlet extent HttpServlet {
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

### 初始化参数
::: code-group
```java [@WebServlet]
@WebServlet(
    name = "name"
    initParams = {// [!code focus:4]
        @WebInitParam(name = "param1", value = "value1"),
        @WebInitParam(name = "param2", value = "value2")
    }
) 
public class FirstServlet extent HttpServlet {
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

### 小图标
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extent HttpServlet {
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

### 大图标
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extent HttpServlet {
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

### 异步支持
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extent HttpServlet {
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

### 描述
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extent HttpServlet {
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

### 显示名
::: code-group
```java [@WebServlet]
@WebServlet(name = "firstServlet")  
public class FirstServlet extent HttpServlet {
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

## Servlet生命周期
1. 创建
2. 初始化
3. 服务
4. 销毁

## defaultServlet

## web.xml
