# 获取FarrisDataGrid或TreeGrid实例

为了方便开发人员使用FarrisDataGrid的API和新特性，现增加获取FarrisDataGrid实例的功能，拿到Grid实例后开发人员可以获取Grid的属性、调用Grid提供的API。

FarrisDataGrid实例由AppContext的componentManager管理。获取Grid实例时需要传递Grid所在组件的FrameId及Grid标识，具体使用方法请参考下面代码：

```typescript
const datagrid = this.frameContext.appContext.componentManager.get(['Grid所在组件的FrameId','dataGrid标识']);
// 拿到实例后可以调用Grid的API
datagrid.selectRow('id');
```

