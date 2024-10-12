# 正则表达式

> 正则表达式（Regular Expression），一种用于字符串匹配的表达式。

## 工具
- 正则表达式速查、速记网站：https://regexr.com 或 https://regexr-cn.com（中文站）
- 正则表达式可视化：https://regex-vis.com

## Java中使用Regex
```java
private String parseLuggage(String input) {
    //确定一个正则表达式。
    String regex = "(托运行李：免费携带)(.*?)(以内)";
    //使用表达式创建匹配模式对象
    Pattern pattern = Pattern.compile(regex);
    //使用匹配模式对象生成正则表达式与需要输入串的匹配器
    Matcher matcher = pattern.matcher(luggage);
    //使用匹配器判断匹配结果
    if (matcher.find()) {
        return matcher.group(2);
    } else {
        return "OKG";
    }
}
```

## 参考文献
1. https://www.bilibili.com/video/BV1oc4TezEjT/?spm_id_from=333.1007.0.0