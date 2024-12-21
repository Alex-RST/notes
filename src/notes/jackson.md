# Jackson使用指南

## 一、简介
* Jackson库的核心功能是将Java对象转换为json字符串（序列化）以及将json字符串转换为Java对象（反序列化）
* SpringMVC默认json解析器便是Jackson
>与其他Java的json的框架相比
* Jackson 解析大的json文件速度比较快
* Jackson 运行时占用内存比较低，性能比较好
* Jackson 有灵活的API，可以很容易进行扩展和定制
>核心模块由三部分组成
* jackson-core，核心包，提供基于"流模式"解析的相关API(JsonPaser和JsonGenerator)，生成和解析json
* jackson-annotations，注解包，提供标准注解功能
* jackson-databind ，数据绑定包，提供基于"对象绑定"解析的相关API(ObjectMapper)和"树模型解析的相关API(JsonNode)
>**使用前说明:**
>* ObjectMapper是Jackson序列化和反序列化的核心类，提供了许多用于定制序列化和反序列化的方法和配置选项。
>* 默认情况下，ObjectMapper在序列化对象时，将实体所有的字段一一序列化，无论这些>字段是否有值，是否为null。
>* 注意：如果实体的某个字段没有提供getter方法，则该字段不会被序列化。
>* ObjectMapper主要用于对Java对象（比如 POJO、List、Set、Map等等）进行序列化与反序列化。

## 二、序列化与反序列化
### 2.1 序列化
**测试：**
```java
 @Test
 public void test1() throws JsonProcessingException {
     ObjectMapper objectMapper = new ObjectMapper();
     User user = new User();
     user.setAge(20);
     user.setBirthday(new Date());
     user.setName("张三");
     user.setAddress(null);
     // 序列化
     String jsonString = objectMapper.writeValueAsString(user);
     System.out.println("序列化字符串：" + jsonString);
     // 反序列化
     User userFromJson = objectMapper.readValue(jsonString, User.class);
     System.out.println("反序列化结果：" + userFromJson);
 }
```
**输出：**
```java
序列化字符串：{"age":20,"name":"张三","birthday":1721266913536,"address":null}
反序列化结果：User(age=20, name=张三, birthday=Thu Jul 18 09:41:53 CST 2024, address=null)
```
**常用API：**
* String writeValueAsString(Object value)**（最常用）**
  * 将任何Java对象（）如 POJO、List、Set、Map等）序列化为json字符串
  * 如果对象中某个属性的值为null，则默认也会序列化为null
  * 如果value为null，返回序列化的结果也返回null
* byte[] writeValueAsBytes(Object value)
  * 将Java对象序列化为字节数组
* writeValue(File resultFile, Object value)
  * 将Java对象序列化并输出指定文件中
* writeValue(OutputStream out, Object value)
  * 将Java对象序列化并输出到指定字节输出流中
  
### 2.2 反序列化
* T readValue(String content, Class valueType)**（最常用）**
  * 从给定的json字符串反序列化为Java对象
  * valueType表示反序列化的任何Class对象（如 POJO、List、Set、Map等）
  * content为空或者为null，都会报错
* T readValue(byte[] src, Class valueType)
  * 将json内容的字节数组反序列化为Java对象
* T readValue(File src, Class valueType)
  * 将本地json内容的文件反序列化为Java对象
* T readValue(InputStream src, Class valueType)
  * 将json内容的字节输入流反序列化为Java对象
* T readValue(Reader src, Class valueType)
  * 将json内容的字符输入流反序列化为Java对象
* T readValue(URL src, Class valueType)
   * 通过网络url地址将json内容反序列化为Java对象

### 2.3 常用配置
```java
private static final ObjectMapper objectMapper;
static {
    // 创建ObjectMapper对象
    objectMapper = new ObjectMapper();
    // configure方法 配置一些需要的参数
    // 转换为格式化的json 显示出来的格式美化
    objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    // 序列化的时候序列对象的那些属性
    // JsonInclude.Include.NON_DEFAULT 属性为默认值不序列化
    // JsonInclude.Include.ALWAYS      所有属性
    // JsonInclude.Include.NON_EMPTY   属性为 空（“”） 或者为 NULL 都不序列化
    // JsonInclude.Include.NON_NULL    属性为NULL 不序列化
    objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
    // 反序列化时,遇到未知属性会不会报错
    // true - 遇到没有的属性就报错
    // false - 没有的属性不会管，不会报错
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    // 如果是空对象的时候,不抛异常
    objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    // 忽略 transient 修饰的属性
    objectMapper.configure(MapperFeature.PROPAGATE_TRANSIENT_MARKER, true);
    // 去除默认时间戳格式
    objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    // 设置为中国北京时区
    objectMapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));
    // 序列化日期格式 Date类型格式化
    objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
    // 处理java8不同时间类型
    JavaTimeModule module = new JavaTimeModule();
    module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    module.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
    module.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(("HH:mm:ss"))));
    module.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    module.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
    module.addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern("HH:mm:ss")));
    // 序列换成json时,将所有的long变成string（因为js中得数字类型不能包含所有的java long值）
    module.addSerializer(Long.TYPE, ToStringSerializer.instance);
    module.addSerializer(Long.class, ToStringSerializer.instance);
    objectMapper.registerModule(module);
}

@Test
public void testObjectMapper() throws JsonProcessingException {
    User user = new User();
    user.setId(1770376103094779915L);
    user.setAge(20);
    user.setBirthday(new Date());
    user.setName("张三");
    user.setAddress(null);
    user.setLocalDateTime(LocalDateTime.now());
    // 序列化
    String jsonString = objectMapper.writeValueAsString(user);
    System.out.println("序列化字符串：" + jsonString);
    // 注意这里添加不存在的属性hobby，反序列化不会报错
    jsonString = "{\"id\":1770376103094779915,\"age\":20,\"name\":\"张三\",\"birthday\":\"2024-07-19 11:02:19\",\"hobby\":\"打篮球\"}";
    // 反序列化
    User userFromJson = objectMapper.readValue(jsonString, User.class);
    System.out.println("反序列化结果：" + userFromJson);
}
@Data
public class User {
    private Long id;
    private Integer age;
    private String name;
    private Date birthday;
    private String address;
    private LocalDateTime localDateTime;
}
```
**输出结果：**
```java
序列化字符串：{
  "id" : "1770376103094779915",
  "age" : 20,
  "name" : "张三",
  "birthday" : "2024-07-19 14:27:48",
  "localDateTime" : "2024-07-19 14:27:48"
}
反序列化结果：User(id=1770376103094779915, age=20, name=张三, birthday=Fri Jul 19 11:02:19 CST 2024, address=null, localDateTime=null)
```

## 三、常用注解
* @JsonProperty 
* @JsonAlias
* @JsonIgnore
* @JsonIgnoreProperties
* @JsonFormat
* @JsonPropertyOrder

## 四、高级特性
### 4.1处理泛型
#### 4.1.1 反序列化List泛型
**测试：**
```java
@Test
public void test7() throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    CollectionType javaType = mapper.getTypeFactory().constructCollectionType(List.class, User.class);
    // 造数据
    List<User> list = new ArrayList<>();
    for (int i = 0; i < 3; i++) {
        User user = new User();
        user.setId((long) i);
        user.setName("张三" + i);
        list.add(user);
    }
    System.out.println("序列化");
    String jsonInString = mapper.writeValueAsString(list);
    System.out.println(jsonInString);

    System.out.println("反序列化：使用 javaType");
    List<User> userList1 = mapper.readValue(jsonInString, javaType);
    System.out.println(userList1);

    System.out.println("反序列化：使用 TypeReference");
    List<User> userList2 = mapper.readValue(jsonInString, new TypeReference<List<User>>() {});
    System.out.println(userList2);
}
@Data
public class User {
    private Long id;
    private String name;
}
```
**输出：**
```java
序列化
[{"id":0,"name":"张三0"},{"id":1,"name":"张三1"},{"id":2,"name":"张三2"}]
反序列化：使用 javaType
[User(id=0, name=张三0), User(id=1, name=张三1), User(id=2, name=张三2)]
反序列化：使用 TypeReference
[User(id=0, name=张三0), User(id=1, name=张三1), User(id=2, name=张三2)]
```
#### 4.1.2 反序列化Map泛型
>可以使用MapType类型反序列化，也可以构造TypeReference反序列化

**测试：**
```java
@Test
public void test8() throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    //第二参数是 map 的 key 的类型，第三参数是 map 的 value 的类型
    MapType javaType = mapper.getTypeFactory().constructMapType(HashMap.class, String.class, User.class);
    // 造数据
    Map<String, User> map = new HashMap<>();
    for (int i = 0; i < 3; i++) {
        User user = new User();
        user.setId((long) i);
        user.setName("张三" + i);
        map.put("key" + i, user);
    }
    System.out.println("序列化");
    String jsonInString = mapper.writeValueAsString(map);
    System.out.println(jsonInString);

    System.out.println("反序列化: 使用 javaType");
    Map<String, User> userMap1 = mapper.readValue(jsonInString, javaType);
    System.out.println(userMap1);

    System.out.println("反序列化: 使用 TypeReference");
    Map<String, User> userMap2 = mapper.readValue(jsonInString, new TypeReference<Map<String, User>>() {});
    System.out.println(userMap2);
}
```
**输出**
```java
序列化
{"key1":{"id":1,"name":"张三1"},"key2":{"id":2,"name":"张三2"},"key0":{"id":0,"name":"张三0"}}
反序列化: 使用 javaType
{key1=User(id=1, name=张三1), key2=User(id=2, name=张三2), key0=User(id=0, name=张三0)}
反序列化: 使用 TypeReference
{key1=User(id=1, name=张三1), key2=User(id=2, name=张三2), key0=User(id=0, name=张三0)}
```

### 4.2 自定义序列化和反序列化
>* 序列化类继承抽象类JsonSerializer，需要的字段或类上使用@JsonSerialize注解
>* 反序列化类继承抽象类JsonDeserializer，需要的字段或类上使用@JsonDeserialize注解
```java
public class LongSerializer extends JsonSerializer<Long> {
    @Override
    public void serialize(Long value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeString(value.toString());
    }
}

@Data
public class User {
    @JsonSerialize(using = LongSerializer.class)
    private Long id;
    private String name;
}
```

## 参考文献
- 原文链接：https://blog.csdn.net/qq_35512802/article/details/140511651