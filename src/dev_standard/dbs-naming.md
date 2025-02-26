# 数据库命名规范

## 1. 基本命名规则

### 表1. 基本数据库对象命名

| 数据库对象               | 前缀     |
|--------------------------|----------|
| 表 (Table)               | `tbl_`   |
| 字段 (Column)            | 无       |
| 视图 (View)              | `viw_`   |
| 存储过程 (Stored procedure) | `prd_`   |
| 触发器 (Trigger)         | `trg_`   |
| 索引 (Index)             | `idx_`   |
| 主键 (Primary key)       | `pk_`    |
| 外键 (Foreign key)       | `fk_`    |
| Check 约束 (Check Constraint) | `ck_`    |
| Default 约束 (Default Constraint) | `df_`    |
| 用户定义数据类型 (User-defined data type) | `udt_`   |
| 用户定义函数 (User-defined function) | `fun_`   |

---

## 2. 关于命名的约定

变量（T-SQL 编程中声明的变量）、过程（存储过程或触发器等）、实体（表、字段）应根据其代表的实体意义和进程作用命名。

### 表2. 好的命名和不好的命名范例

| 好的命名               | 不好的命名       |
|------------------------|------------------|
| `@CurrentDate`         | `@D`             |
| `@ActivityCount`       | `@ActNum`        |
| `@EquipmentType`       | `@ET`            |
| `prCalculateTotalPrice` | `@prRunCalc`     |

#### 命名规则：
1. **动宾形式**：动词放前面，名词放后面。  
   例如：`prd_GetProductById`。
2. **避免使用计算机术语**，尽量使用面向公司业务的术语。
3. **采用缩写**：
   - 如果业务描述的过程名过长，可以使用缩写。  
     例如：`prCountTotalAmountOfMonthlyPayments` → `prCountMonthlyPayments`。
   - 如果字典中有标准缩写，优先使用（如 `Mon` 表示 `Monday`，`Dec` 表示 `December`）。
   - 删除单词的元音（词首字母除外）和重复字母来缩写。  
     例如：`Current` → `Crnt`，`Address` → `Adr`。
   - 避免使用有歧义的缩写（如 `b4` 表示 `before`，`xqt` 表示 `execute`）。

---

## 3. 数据库命名
根据项目的实际意义命名。

---

## 4. 表命名
- 格式：`tbl_` + 名称（名称尽量使用英文单词，每个单词的首字母大写）。  
  例如：`tbl_EmployeeInfo`。

---

## 5. 字段命名
- 格式：表名（去掉前缀）缩写 + `_` + 属性名称（每个单词的首字母大写）。
- 缩写规则：
  - 一个单词：取前四个字母。
  - 两个单词：取每个单词的前两个字母。
  - 三个单词：取前两个单词的首字母和第三个单词的前两个字母。
  - 四个或以上单词：取前三个单词的首字母和最后一个单词的首字母。

---

## 6. 主键命名
- 主键是针对表的，而不是字段，因为主键是唯一的，一个表只能有一个主键。
- 命名规则：
  1. 一般主键命名：`pk_TableName`。
  2. 复合主键：`pk_` + 字段名。  
     例如：`Constraint pk_StudentCourse Primary key(Stud_Id, Cour_Id)`。

---

## 7. 外键命名
- 格式：`fk_外键所在的表名_外键引用的表名`。  
  例如：`fk_从表名_主表名`。

---

## 8. Check 约束命名
- 格式：`ck_` + 表名 + `_` + 字段名。  
  例如：`ck_tbl_Company_Comp_Zip`。

---

## 9. Default 约束命名
- 格式：`df_` + 表名 + `_` + 字段名。  
  例如：`df_tbl_News_News_Hit`。

---

## 10. 触发器命名
- 格式：`trg_` + 表名 + 后缀。
  - 前缀：`trg_`，描述数据库对象的类型。
  - 基本部分：描述触发器所加的表。
  - 后缀（`_I`、`_U`、`_D`）：显示修改语句（Insert、Update、Delete）。  
    例如：`trg_Employee_I`。

---

## 11. 存储过程命名
- 命名规则：见名知意。
- 格式：`prd_` + 说明（动宾结构，动词 + 名词）。  
  例如：`prd_GetProductById`。

---

## 12. 存储过程中参数的命名
- 与其对应的字段名相同，第一个单词小写。  
  例如：`@productId`。

---

## 参考资料
- [数据库](https://blog.51cto.com/zhouhongyu1989/1382087)
