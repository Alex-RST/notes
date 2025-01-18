# `Java` 中 `@SuppressWarnings` 抑制警告的类型

## 标准用法
- 一般常用在普通 `JavaSE` 项目中。

| 关键字 | 用途 |
|--------|:---:|
| all                      | to suppress all warnings                                                                   |
| boxing                   | to suppress warnings relative to boxing/unboxing operations                                |
| cast                     | to suppress warnings relative to cast operations                                           |
| dep-ann                  | to suppress warnings relative to deprecated annotation                                     |
| deprecation              | to suppress warnings relative to deprecation                                               |
| fallthrough              | to suppress warnings relative to missing breaks in switch statements                       |
| finally                  | to suppress warnings relative to finally block that don’t return                           |
| hiding                   | to suppress warnings relative to locals that hide variable                                 |
| nls                      | to suppress warnings relative to non-nls string literals                                   |
| null                     | to suppress warnings relative to null analysis                                             |
| rawtypes                 | to suppress warnings relative to un-specific types when using generics on class params     |
| restriction              | to suppress warnings relative to usage of discouraged or forbidden references              |
| serial                   | to suppress warnings relative to missing serialVersionUID field for a serializable class   |
| static-access            | to suppress warnings relative to incorrect static access                                   |
| synthetic-access         | to suppress warnings relative to unoptimized access from inner classes                     |
| unchecked                | to suppress warnings relative to unchecked operations                                      |
| unqualified-field-access | to suppress warnings relative to field access unqualified                                  |
| unused                   | to suppress warnings relative to unused code                                               |

## `IDEA`
- `IDEA` 给普通 `JavaSE` 提供的语法警告。

| 关键字 | 用途 |
|--------|:---:|
| UnnecessaryLocalVariable | Local variable 'userId' is redundant       |
| FieldCanBeLocal          | Field can be converted to a local variable |

## `Spring`
- `IDEA` 在 `Spring` 以及 `SpringBoot` 等 `Spring` 的衍生项目中提供的语法警告。

| 关键字 | 用途 |
|--------|:---:|
| SpringJavaInjectionPointsAutowiringInspection | Could not autowire. No beans of 'XXX' type found.                               |
| SpringJavaAutowiredFieldsWarningInspection    | Field injection is not recommended                                              |
| ConfigurationProperties                       | Not registered via @EnableConfigurationProperties or marked as Spring component |
| ConstantConditions                            | Condition 'xxx != null' is always 'true'                                        |

## 参考资料
- [【持续更新】Java 中使用 @SuppressWarnings 警告压制汇总](https://juejin.cn/post/7141987322584629285)