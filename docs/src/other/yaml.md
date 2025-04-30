# `YAML` 文件格式

## 格式要求
- 低版本 `yaml` 要求缩进只能使用空格，高版本无要求。
- 同一层级的数据要求左对齐。
- 冒号后需要跟一个空格。
- 大小写敏感

## 支持的数据类型
### 字符串
```yaml
app:
  name: demo
```

### 整数
```yaml
app:
  version: 12
```

### 浮点数
```yaml
app:
  version: 12.2
```

### 布尔
```yaml
app:
  param1: false
  param1: true
```

### 日期
```yaml
app:
  date: 1970-01-01 #格式：ISO 8601。即：yyyy-MM-dd
```

### 时间
```yaml
app:
  time: 1970-01-01T00:00:00+08:00 #格式：ISO 8601。日期与实践用T分隔，+代表时区
```

### Null
- `~` 表示 Null
```yaml
app:
  version: ~
```

### 数组
```yaml
app:
  list: 
    - param1: demo11
      param2: demo12
    - param1: demo21
      param2: demo22
```

### 对象
```yaml
app:
  name: application
  version: 12
```

## 单文件多文档
- 在同一个 `yaml` 文件中可以使用 `---` 分割为多份文档
```yaml
app:
  name: application
  version: 12
---
app:
  name: application
  version: 12
---
app:
  name: application
  version: 12
```
