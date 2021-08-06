

## 表达式分类

表达式支持计算表达式、只读表达式、依赖表达式、相关表达式、帮助前表达式、校验表达式、必填表达式；

- 计算表达式

  字段的值通过其他字段或VO变量经过一系列计算得到。如：

  ```typescript
  订单金额=单价*订单数量
  ```

- 只读表达式

  根据实体字段值或VO变量动态控制卡片和表格字段的只读状态，当表达式返回`真`时字段只读。如：

  ```typescript
  if(主实体.订单金额>5000){return true;}
  ```

- 依赖表达式

  依赖表达式又称清空表达式，即当表达式返回`真`时，清空当前字段的值。

- 相关表达式

  相关表达式又称显隐表达式，即当表达式返回`真`时，控件可见，否则隐藏控件或表格列。

- 帮助前表达式

  帮助前表达式类似用户开发的帮助前，当表达式返回`真`时允许弹出帮助，否则弹出开发人员设置的提示并阻止帮助的弹出。

- 校验表达式

  校验表达式类似前端校验，不过校验规则为表达式。当表达式返回`真`时校验通过（如果无返回值则认为`假`），否则校验失败并在控件下方展示开发人员配置的错误信息。

- 必填表达式

  校验表达式的一种场景。使用方法同校验表达式。

## 表达式编写

表达式引擎基于匿名函数实现，用户编写的表达式最终会放到一个匿名函数中执行。因此在控制台或脚本中执行报错的脚本在表达式中均可执行，如：

```typescript
var x=1;
var y =2;
if(x>y){
    return true;
}else{
    return false;
}
```

通过以上封装，可以简化用户表达式编写过程。

**注意：**

如果在表达式中使用了类似**判断、分支、函数**等`带返回的语句`或`有多行代码但没有return`，如果希望整个表达式有返回值，则应显式`return`，否则表达式计算结果为`undefined`。如果计算结果为`undefined`，则不会有任何作用。鉴于此，如果需要返回类似空字符串、null时，应显式`return`。

```javascript
function sum(x,y){
    return x+y;
}
return sum(x,y);// 必须显式return

-----------------------------------------
var s1= Entity.s1;
var s2=Entity.s2;
return null;//必须显式return
```

如果表达式中只有一条语句，则可以只写表达式，无需显式`return`（支持显式）：

```javascript
DefaultFunction.Sum([1,2,3])
```

### 返回常量

```javascript
2+3*4
```

### 判断

```javascript
var x=1;
var y =2;
if(x>y){
    return true;
}
```

### 自定义方法

```javascript
function plus(x,y){
    return x+y;
}
function test(){
    return new Date().valueOf();
}
return plus(1,2) + test();
```

### 获取UIState

```javascript
DefaultFunction.GetContextParameter("userId")
```



## 表达式内置函数

表达式支持表达式设计器中所有方法，可参考表达式设计器方法列表。

## 表达式引擎上下文

表达式引擎上下文是指用户在编写表达式、解析运行表达式时可以使用的上下文，目前表达式支持以下上下文：

- 大数（BigNumber）
- FrameContext
- BindingData
- 内置函数
- 表单实体
- 表单状态（UIState、VO变量）
- Repository

### 控制器上下文

FrameContext、BindingData、Repository为当前表单的上下文，使用时在Web构建中使用一致，对应的是每个类型的实例，分别为：`frameContext`、`bindingData`、`repository`。基于此，在表达式中可以编写如下表达式：

```typescript
var userId = frameContext.viewModel.uiState["userId"];
var version = bindingData.getValue(["version"]);
```

### 大数（BigNumber）

为方便开发者通过表达式进行大数运算，表达式引擎中引入了大数上下文，`BigNumber`在上下文中为类型。使用时和`BigNumber`原生API一致。如下：

```typescript
var x = new BigNumber(0.1)
var y = x.plus(0.2) // '0.3'
BigNumber.isBigNumber(x)// true
```

### 内置函数

内置函数和表达式设计器中函数定义一致，但表达式设计器中函数变动时需表达式引擎做对应的修改。

## 依赖解析

表达式引擎加载表达式时会解析每个表达式的依赖，如果依赖解析出现问题会导致表达式运行时机不对。因此如果发现表达式引擎解析器解析依赖错误时可以通过手动修复的方式指定依赖。

表达式依赖目前支持实体属性、UIState。依赖最终为字符串数组，每一个元素代表一个依赖。实体属性依赖以`ENTITY~`开头，状态依赖以`STATE~`开头。基于此，如果某个表达式依赖了实体的price和UIState的total属性，则依赖数组为:

```typescript
[
    "ENTITY~/price",
    "STATE~/total"
]
```

如果表达式依赖解析错误，则可以在编写表达式的时候在表达式中指定依赖，以上依赖编写为：

```javascript
/*__define__({deps:["ENTITY~/price","STATE~/total"]})*/
```

将以上注释放到表达式中即可。

## 表达式引擎

表达式计算时依赖了表达式引擎，目前表达式引擎为独立模块，可以单独使用。

使用前需安装该模块`@farris/expression-engine`

```typescript
import { ExpressionEngine } from '@farris/expression-engine';
```

使用方法

### 1、算术表达式

```javascript
// 实例化表达式引擎
var engine = new ExpressionEngine();
// 计算表达式
var result = engine.eval("2+3*4");
```

### 2、变量表达式

```typescript
// 实例化表达式引擎
const engine = new ExpressionEngine();
// 获取表达式上下文
const context = expressionEngine.getContext();
// 添加表达式上下文
context.set("x",1);
context.set("y",2);
// 计算表达式
engine.eval("x + y");
```

### 3、访问对象属性

```javascript
// 实例化表达式
const expression = new Expression("var f1= FormEE1.f1; var i1=FormEE1.i1;if(i1>10 && f1>10){var plus = new BigNumber(i1).plus(f1).toFixed(); return  plus;}else{return \"\";}");
// 实例化上下文
const context = new ExpressionContext();
// 设置上下文
context.set("FormEE1",{f1:10,i1:12});
// 计算表达式
expression.eval(context);
```

### 4、数组及可遍历对象

```javascript
const engine = new ExpressionEngine();
const context = engine.getContext();
context.set("Record", { items: [{ score: 100 }, { score: 99 }, { score: 1 }, { score: 88 }, { score: 12 },{ score: 1 }] });
engine.eval("DefaultFunction.AvgByProp(\"Record.items\",\"score\")");
```

### 5、调用JavaScript方法

```javascript
const engine = new ExpressionEngine();
engine.eval("console.log(\"hello world!\")");
```

### 6、大数值计算

```typescript
const engine = new ExpressionEngine();
engine.eval("var x = new BigNumber(0.1);var y = x.plus(0.2);BigNumber.isBigNumber(x)");
```

### 7、添加自定义函数

```typescript
const engine = new ExpressionEngine();
const context = service.getContext();
engine.addFun("sum", (x, y) => { return x + y + x * y; });
context.set("x", 5);
context.set("y", 4);
engine.eval("sum(x,y)");
```

