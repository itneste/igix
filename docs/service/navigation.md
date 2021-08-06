# 导航服务

打开菜单及应用有两个服务：RouterService、NavigationService。其中RouterService不支持打开多标签页，后续只修改bug，不再增加新特性。开发构件或需要支持多标签页时应使用NavigationService。

## 引入服务

以上两个服务均在`@farris/command-services`包中，通过以下代码引入：

```typescript
import {NavigationService,RouterService} from '@farris/command-services';
```

通过Angular依赖注入注入到构件类中：

```typescript
export class MyService{
    constructor(private navigationService: NavigationService,private routerService:RouterService){
    }
}
```

## NavigationService

NavigationService是RouterService的替换版本，兼容原有功能的同时提供了多标签页的支持，开发时应使用该服务。以下是该服务的方法定义：

### openMenu

```typescript
/**
 * 打开菜单
 * @param tabId 根据TabId决定打开新标签页或定位之前打开的标签页
 * @param funcId 菜单Id
 * @param params 参数
 * @param reload 是否重新刷新
 * @param enableRefresh 启用数据刷新
 * @param tabName tab标题
 */
public openMenu(tabId: string, funcId: string, params: any, reload?: boolean, enableRefresh?: any, tabName?: string)
```

参数定义：

> `tabId`：标签页唯一标识
>
> > `tabId`是标签页的唯一标识，运行框架在打开菜单或应用时首先判断该`tabId`对应的标签页是否已经打开，如果已经打开则切换到对应的标签页。唯一标识应为字符串，且不能包含空格。常用场景如下：
> >
> > 1、新增
> >
> > 打开一个卡片新增数据，此时我们希望每次点新增按钮时都打开一个新的标签页。那么每次都应该传递不同的`tabId`，可以使用`new Date().valueOf().toString()`作为tabId
> >
> > 2、编辑、查看
> >
> > 用户点击编辑或查看数据时如果选中数据之前查看或编辑过，且标签页没有关闭，那么我们希望能够定位到之前的标签页，否则打开一个新标签。这种情况下`tabId`和业务数据有关联，此时可以使用数据Id作为`tabId`
>
> `funcId`：菜单Id
>
> `params`：打开菜单时传递的参数
>
> > 支持JSON字符串或对象
>
> ~~`reload`~~：是否重新加载（已废弃），传递`false`即可
>
> `enableRefresh`：启用数据刷新
>
> > 可选，默认为`true`。启用后列表跳转卡片，再从卡片切换到列表时列表数据会自动刷新。
>
> `tabName`：标签页标题
>
> > 标签页标题，支持多语，多语写法：`{{资源项key}}`

*** 打开菜单或应用时如果需要被打开的菜单关闭或切换到主界面时，主界面刷新，则需要在打开菜单或应用时给navigationService的context属性赋值，该值为frameContext，可以通过注入的方式获取。使用方法如下：***

```typescript
export class MyClass{
    constructor(private frameContext:FrameContext,private navigationService: NavigationService){}
    public openMyMenu(){
        // 不设置上下文会导致切换到主页面或关闭子页面时主界面不刷新
        this.navigationService.context = {frameContext: this.frameContext};
        this.navigationService.openMenu(tabId,funcId,params);
    }
}
```



### openMenu$

```typescript
/**
  * 打开菜单（流）
  * @param tabId 根据TabId决定打开新标签页或定位之前打开的标签页
  * @param funcId 菜单Id
  * @param params 参数
  * @param reload 是否重新刷新
  * @param enableRefresh 启用数据刷新
  */
public openMenu$(tabId: string, funcId: string, params: any, reload?: boolean, enableRefresh?: any, tabName?: string)
```

流的方式打开菜单和打开菜单参数一致，唯一的不同在于使用场景的不同。如果用户希望回跳单据，即列表打开卡片，卡片关闭时希望切换到列表。这时如果使用打开菜单，出现的结果就是没有跳转到列表，卡片关闭了。这种场景下就需要使用流式菜单打开方法，该方法能够保证菜单打开后再执行管道里面的其他操作。常见的使用方法如下：

```typescript
this.navigationService.openMenu$(tabId,funcId,params).pipe(
	tap(()=>{
        this.navigationService.destory();
    })
);
```

### openMenuWithDimension

```typescript
/**
  * 打开菜单(带维度)
  * @param tabId 根据TabId决定打开新标签页或定位之前打开的标签页
  * @param funcId 菜单Id
  * @param params 参数
  * @param reload 是否重新刷新
  * @param enableRefresh 启用数据刷新
  * @param dim1 dim1
  * @param dim2 dim2
  */
  public openMenuWithDimension(tabId: string, funcId: string, params: any, enableRefresh?: any, dim1?: any, dim2?: any, tabName?: string)
```

打开菜单（带维度），运行时定制表单使用。

#### openApp

```typescript
/**
  * 打开应用
  * @param tabId tabId 根据TabId决定打开新标签页或定位之前打开的标签页
  * @param appId 应用Id
  * @param appEntrance 应用入口
  * @param params 参数
  * @param reload 是否重新刷新
  * @param tabName tab标题
  * @param enableRefresh 启用数据刷新
  */
public openApp(tabId: string, appId: string, appEntrance: string, params: any, reload?: boolean, tabName?: string, enableRefresh?: any)
```

### openApp$

```typescript
/**
  * 打开应用(流式)
  * @param tabId tabId 根据TabId决定打开新标签页或定位之前打开的标签页
  * @param appId 应用Id
  * @param appEntrance 应用入口
  * @param params 参数
  * @param reload 是否重新刷新
  * @param tabName tab标题
  * @param enableRefresh 启用数据刷新
  */
public openApp$(tabId: string, appId: string, appEntrance: string, params: any, reload?: boolean, tabName?: string, enableRefresh?: any)
```

### close

```typescript
/**
  * 关闭
  */
public close()
```

关闭菜单或应用，带关闭前提示。

### destory

```typescript
/**
  * 强制关闭
  */
public destory() 
```

不带关闭前的保存提示，直接关闭。

### addEventListener

```typescript
/**
  * 注册事件监听器
  * @param eventType 事件类型 onTabClosed
  * @param handler 处理器
  * @returns string 返回事件标识
  */
public addEventListener(eventType: string, handler: (options: AppOptions) => any): string
```

监听导航事件，监听成功后返回监听器唯一标识。

> eventType可选值：
>
> ```typescript
> export const TAB_EVENT = {
>  /**
>      * Tab关闭后
>      */
>     onTabClosed: 'FuncClosed',
>     /**
>      * Tab关闭前
>      */
>     onTabClosing: 'beforeFuncCloseEvent',
>     /**
>      * Tab切换
>      */
>     onTabSwitched: 'funcSwitchEvent'
> };
> ```

### removeEventListener

```typescript
/**
  * 移除事件监听器
  * @param eventType 事件类型 onTabClosed | onTabCloseing
  * @param key 事件标识
  */
public removeEventListener(eventType: string, key: string)
```

移除事件监听器，key为事件监听器唯一标识。

### navigate

```typescript
/**
   * 子路由导航
   * @param commands commands
   * @param options options
   * @description options:{ relativeTo: this.activatedRoute, queryParams:{a:1,b:2},etc:...}
   */
public navigate(commands: any[], options?: any): Promise<boolean>
```

类似angular中的navigate，不同之处在于不需要手动传递公共路由参数。