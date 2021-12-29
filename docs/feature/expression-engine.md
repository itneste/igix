# 表达式引擎

## 介绍

表达式计算时依赖了表达式引擎，目前表达式引擎为独立模块，可以单独使用。

使用前需安装该模块`@farris/expression-engine`并导入。

```javascript
import { ExpressionEngine } from '@farris/expression-engine';
```
!> **重要** 表达式引擎基于TypeScript开发，是一个Javascript模块，因此使用时无需注入，直接实例化即可。
## 如何使用

### 算术表达式

```javascript
// 实例化表达式引擎
var engine = new ExpressionEngine();
// 计算表达式
var result = engine.eval("2+3*4");
```

### 变量表达式

```javascript
// 实例化表达式引擎
const engine = new ExpressionEngine();
// 获取表达式上下文
const context = engine.getContext();
// 添加表达式上下文
context.set("x",1);
context.set("y",2);
// 计算表达式
engine.eval("x + y");
```

### 访问对象属性

```javascript
// 实例化表达式
const expression = new Expression("var f1= FormEE1.f1; var i1=FormEE1.i1;if(i1>10 && f1>10){var plus = new BigNumber(i1).plus(f1).toFixed(); return  plus;}else{return \"\";}");
// 实例化上下文
const context = new ExpressionContext();
// 设置上下文
context.set("FormEE1",{f1:10,i1:12});
// var FormEE1 = {f1:10,i1:12};
// FormEE1.f1
// 计算表达式
expression.eval(context);
```

### 数组及可遍历对象

```javascript
const engine = new ExpressionEngine();
const context = engine.getContext();
context.set("Record", { items: [{ score: 100 }, { score: 99 }, { score: 1 }, { score: 88 }, { score: 12 },{ score: 1 }] });
var result = engine.eval("DefaultFunction.AvgByProp(\"Record.items\",\"score\")");
```

### 调用JavaScript方法

```javascript
const engine = new ExpressionEngine();
var result = engine.eval("console.log(\"hello world!\")");
```

### 大数值计算

```javascript
const engine = new ExpressionEngine();
var result = engine.eval("var x = new BigNumber(0.1);var y = x.plus(0.2);BigNumber.isBigNumber(x)");
```

### 添加自定义函数

```javascript
const engine = new ExpressionEngine();
const context = service.getContext();
engine.addFun("sum", (x, y) => { return x + y + x * y; });
context.set("x", 5);
context.set("y", 4);
var result = engine.eval("sum(x,y)");
```

### 编译运行

与eval不同，编译运行会缓存执行的代码，从而提高运行效率。

```javascript
// 实例化表达式
const expression = new Expression("DefaultFunction.Contains(fullString,targetString)");
// 实例化上下文
const context = new ExpressionContext();
// 设置上下文
context.set("fullString","hello world!");
context.set("targetString","world");
// 计算表达式
var result = expression.compile(context).eval();
```

