# CSS选择器

## 基础选择器
### 通配符选择器
```css
* {
    background-color: blue
}
```

### 元素选择器
```css
元素名 {
    background-color: blue
}
```

### 类选择器
```css 
.类名 {
    background-color: blue
}
```

### ID选择器
```css 
#ID {
    background-color: blue
}
```

## 复合选择器
### 交集选择器
- `语法`：选择器直接相连，例如：
```css
p.demo {
    background-color: blue
}

span#id {
    background-color: blue
}
```

### 并集选择器
 `语法`：选择器用逗号分隔，例如
```css
p,demo {
    background-color: blue
}
```

### 后代选择器
```css
p #class-name {
    background-color: blue
}
```

### 子代选择器
- `作用`：选择元素的子元素
- `语法`：选择器1`>`选择器2
```css
p>#class-name {
    background-color: blue
}
```

### 兄弟选择器
- `语法`：
  - 选择器1`+`选择器2（相邻兄弟选择器）
  - 选择器1`~`选择器2（通用兄弟选择器）
```css
li+li {
    background-color: blue
}

li~li {
    background-color: blue
}
```
:::tip
兄弟选择器只向下查找兄弟
:::

### 属性选择器
- `作用`：选择属性值符合一定要求的元素  
- `语法`：
  - [属性名]：选择具有某个属性的元素。
  - [属性名="值"]：选择具有某个属性，并且属性值`等于`指定值的元素。
  - [属性名^="值"]：选择具有某个属性，并且属性值`以指定值开头`的元素。
  - [属性名$="值"]：选择具有某个属性，并且属性值`以指定值结尾`的元素。
  - [属性名*="值"]：选择具有某个属性，并且属性值`包含`指定值的元素。
```css
[title="demo"] {
    background-color: blue
}
```

### 伪类选择器
伪类不是类，是元素特殊状态的一种描述

**动态伪类**：
- :live
- :visited
- :hover
- :actived

**结构伪类**：
- :first-child
- :last-child
- :nth-child(an+b)
- :first-of-type
- :last-of-type
- :nth-of-type(an+b)
- :nth-last-child(an+b)
- :nth-last-of-type(an+b)
- :nth-only-child
- :nth-only-of-type
- :root（选中根元素，前面不用写元素）
- :empty

**否定伪类**
- :not(选择器)

**UI伪类选择器**
- :disable
- :enable
- :checked