# Spring IOC

## Bean 生命周期
![bean生命周期](/spring/spring-framework/spring-bean-lifecycle.drawio.png "bean生命周期")

## FactroyBean和BeanFactroy
BeanFacotry是spring中比较原始的Factory。如XMLBeanFactory就是一种典型的BeanFactory。原始的BeanFactory无法支持spring的许多插件，如AOP功能、Web应用等。 

ApplicationContext接口,它由BeanFactory接口派生而来，ApplicationContext包含BeanFactory的所有功能，通常建议比BeanFactory优先

### BeanFactroy
BeanFactroy从名字可以看出，本质是一个工厂。BeanFactory是接口，提供了IOC容器最基本的形式，给具体的IOC容器的实现提供了规范，

### FactoryBean
从名字可以看出，本质是一个Bean，一个特殊的Bean。FactoryBean也是接口，为IOC容器中Bean的实现提供了更加灵活的方式，FactoryBean在IOC容器的基础上给Bean的实现加上了一个简单工厂模式和装饰模式，我们可以在getObject()方法中灵活配置。其实在Spring源码中有很多FactoryBean的实现类。