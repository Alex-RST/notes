## tomcat使用startup.bat启动后，控制台输出乱码解决办法
  1. 打开{tomcat安装目录}/conf/logging.properties文件。
  2. 找到并修改java.util.logging.ConsoleHandler.encoding的值为控制台输出的字符集。
  3. 重新启动tomcat。

## webapp的项目结构
webapp
&ensp;&ensp;├─static
&ensp;&ensp;└─WEB-INF
    &ensp;&ensp;&ensp;&ensp;│  web.xml
    &ensp;&ensp;&ensp;&ensp;│  
    &ensp;&ensp;&ensp;&ensp;├─classes
    &ensp;&ensp;&ensp;&ensp;└─lib

- WEB-INF：不可以被直接访问的资源
- static：可直接访问的静态资源（html，css，js，img等。也可以直接放在项目根目录下，如此处的webapp目录）

## web项目部署在tomcat的方式
1. 将标准的webapp，放入tomcat根目录/webapp中。
2. 
3. 可将目录放在系统的任意路径下，但需要对tomcat进行配置。在“tomcatcat根目录/conf”下新建Catalina目录，新增一个需要部署的项目的配置文件，文件名为xxx.xml。其中"xxx"为需要部署的项目根目录名。文件内容：
    ```
    <Context path="" docBase=""/>
    ```
    path中为项目的资源访问路径；docBase为项目所在的系统路径。

## 如何访问tomcat自带的host-manager和manager项目
1. 打开"tomcat根目录/conf/tomcat-users.xml"
2. 配置用户登录信息
   ```
   <role rolename="tomcat"/>
   <role rolename="role1"/>
   <user username="tomcat" password="<must-be-changed>" roles="tomcat"/>
   <user username="both" password="<must-be-changed>" roles="tomcat,role1"/>
   <user username="role1" password="<must-be-changed>" roles="role1"/>
   ```
3. 重启tomcatS
