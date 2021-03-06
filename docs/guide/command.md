# 命令

Devkit提供了一套命令的注册、派发机制，通过这套机制将命令发送与执行解耦，这使得我们可以在不改变程序结构的前提下，替换命令的执行过程。对于命令的执行过程，我们提供给了一套扩展机制，可以在不同的开发层次，不同的执行阶段对命令的执行过程进行扩展。

## Web构件

说到命令就不得不说Web构件，Web构件其实就是一个高内聚的类，类里面定义了一系列相关功能的方法，和`Java`的类是一致的。比如控制器内置的`导航服务`构件中就定义了诸如`打开菜单`、`打开应用`、`关闭`等和导航相关的方法。

### 构件和操作的关系

上面我们说到构件其实就是一个类，而里面的`方法`我们称为`操作`。Web构件和操作完整的描述了一个类。Web构件里面的方法和普通的方法一致，可以手动调用也可以被命令调用。

### 命令和操作的关系

一个命令可以包含多个操作。

一个操作可以被多个命令引用。

## 命令编排

现在我们有了Web构件和操作，能够详细的描述一个类了，但如何使用呢？这就涉及到了命令编排。命令编排是指对操作进行配置，即，第一步干什么，第二步干什么，通过设计器上下移动操作、配置参数，从而打到命令编排的目的。

Web构件是命令编排的基础，有了构件和操作，在编排命令时我们就可以从`构件仓库`中选取需要的操作，对操作进行编排，实现操作的复用。所以在开发构件时每个操作职责要单一，必要时使用参数进行控制。如需要删除一条数据并更新前端界面，则应该将这段业务拆分成两个操作，一个操作是删除数据，一个是更新数据。这样其他同事开发命令时如果需要删除数据的操作就可以直接用你的`删除数据`构件了，从而实现复用。这也是面向对象开发的重要原则：`高内聚，低耦合`。

## 命令执行顺序

一个命令包含多个操作，那他们是怎样执行的呢？

命令在执行时按照从上到下的顺序依次执行，即使操作是异步的，下一个操作也会在上一个异步操作执行完成后再执行。鉴于此，如果操作是异步的，应该返回一个`可观察对象`，即`[Observable](https://rxjs.dev/guide/observable)`。

## 参数

现在我们知道操作其实就是一个方法，既然是方法那可能就有参数。如果一个操作需要参数，那这些参数从哪里来呢？

操作的参数有两个来源：命令、操作返回值。

一个命令引用了带参数的操作，那么就应该在命令上添加对应的参数。这也是常见的场景，如删除数据的时候，删除方法需要知道要删除哪条数据，因此删除操作就需要一个`id`参数。这时候就需要在命令上定义一个参数`id`，构件参数使用命令上的参数：`{COMMAND~/params/id}`，其代表的含义为：操作所需要的`id`参数使用命令上的参数，参数名为`id`。

### 操作参数

操作参数即方法的参数，手工编码调用一个方法时可以直接给其传递参数，在命令中操作如何获取参数呢？操作支持两种类型的参数：命令参数、操作返回参数。

命令参数是指在命令上用户配置的参数。表示方法为`{COMMAND~/params/xxx}`。

### 命令参数



