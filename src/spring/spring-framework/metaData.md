# `Spring` 是如何处理派生的注解信息的？

> Spring 的组件扫描有一个值得关注的点，那就是在自定义一个注解类型上标注@Component注解，那么这个自定义注解同样具有声明一个 > > Bean的作用。但是我们知道在Java中注解类型是不支持派生的（不同于@Inherit注解）。这是如何做到的呢？

```java
CachingMetadataReaderFactory factory = new CachingMetadataReaderFactory();
Resource[] resources = new PathMatchingResourcePatternResolver().getResources(path);
AnnotationBeanNameGenerator generator = new AnnotationBeanNameGenerator();
for (Resource resource : resources) {
    // System.out.println(resource);
    MetadataReader reader = factory.getMetadataReader(resource);
    // System.out.println("类名:" + reader.getClassMetadata().getClassName());
    AnnotationMetadata annotationMetadata = reader.getAnnotationMetadata();
    // System.out.println("是否加了 @Component:" + annotationMetadata.hasAnnotation(Component.class.getName()));
    // System.out.println("是否加了 @Component 派生:" + annotationMetadata.hasMetaAnnotation(Component.class.getName()));
    if (annotationMetadata.hasAnnotation(Component.class.getName())
        || annotationMetadata.hasMetaAnnotation(Component.class.getName())) {
        AbstractBeanDefinition bd = BeanDefinitionBuilder
                .genericBeanDefinition(reader.getClassMetadata().getClassName())
                .getBeanDefinition();
        String name = generator.generateBeanName(bd, beanFactory);
        beanFactory.registerBeanDefinition(name, bd);
}
```
