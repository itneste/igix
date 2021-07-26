# 基本概念

## 实体（Entity）

实体用来描述业务数据的结构。实体可以是嵌套的，每个实体有唯一的标识符。

## 实体仓库（Repository）

**Repository负责与后台接口交互并将接口返回的数据转换为<u>Entity</u>集合进行保存**。Repository封装了实体常用的增、删、改、列表等操作。如果已封装的接口不能满足用户的需求则可以通过继承Repository来实现个性化的业务。例如针对BE框架，我们实现了BefRepository，用户只需要配置实体和BE路径就可以与后台交互。  

## 绑定数据（BindingData）

BindingData直接用于和组件、指令、表单做绑定，它是Reposotiry内的Entity集合的映射。为了提高Angular的渲染性能，在BindingData内部将Entity集合转换成了Immutable List，将Entity转换成了Immutable Map。同时它提供了更好的数据访问API和变更通信机制，使得和UI层做双向绑定更加简单。BindingData位于Repository和UI层之间，当Repository内的实体发生变化后，会将变化应用到BindingData上，BindingData通过变更流通知订阅它的组件、指令、表单，进而去更新界面。反过来，当界面发生变化时，变化会映射到BindingData上，进而去更新实体的值。

## 表单（Form）

Devkit封装了一套声明式的表单构建方法，通过 Devkit的Form我们可以像定义实体类一样定义一个嵌套的表单。Form和BindingData做了集成，通过简单的声明可以与BindingData中的数据实现双向通信。

## 状态机（StateMachine）

在Devkit的状态机中，有三个重要的概念：

- 页面状态（State）：页面的整体状态，比如查看状态、编辑状态；
- 控件状态（RenderState）：和具体控件做绑定的状态，它的值时根据页面状态运算而来；
- 迁移动作（Action）：动作绑定一个页面状态，当动作发生时，将页面切换到指定的状态。从而达到整体控制控件状态的目的。

## 变量（UIState）

UIState用于存放组件要使用但实体字段中又不存在的数据。例如控制元素的显示与隐藏、控件的默认值等。这些数据不存在于实体中，只是组件用于控制界面而使用的临时数据。

## 命令（CommandBus）

Devkit提供了一套命令的注册、派发机制，通过这套机制将命令发送与执行解耦，这使得我们可以在不改变程序结构的前提下，替换命令的执行过程。对于命令的执行过程，我们提供给了一套扩展机制，可以在不同的开发层次，不同的执行阶段对命令的执行过程进行扩展。Devkit的命令体系中有以下几个重要的概念：

- 命令（Command）：完成某项功能所需要的操作或步骤的统称。一个命令包括命令名称、参数及一组操作步骤。
- 命令处理器（CommandHandler）：内部包含了一个任务编排器，执行一个命令的时候，按照编排依次执行内部的任务队列；
- 命令处理扩展（CommandHandlerExtender）：对命令处理内部的任务进行扩展、替换，形成新的任务队列；
- 命令总线（CommandBus）：负责将命令派发给命令处理。

## 视图模型（ViewModel）

视图模型关联了Repository和组件，它持有BindingData、UIState、Form等数据源，同时也持有对这些数据源进行操作的方法。数据通过ViewModel流向组件，组件状态的变化又通过ViewModel同步到模型。
视图模型支持嵌套组合，通过ViewModel的划分，可以将复杂的界面拆分为不同的区域，分而治之，降低代码的复杂度和维护的难度。

## FrameComponent

FrameComponent是所有组件的基类。它负责将Repository、ViewModel、命令处理器等注入到组件并初始化devkit框架和各个服务。