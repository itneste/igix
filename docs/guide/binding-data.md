# BindingData

BindingData用于直接和界面绑定，它持有一个不可变的数据集合（BindingList），数据集合中是一个不可变的数据对象（BindingObject）。

BindingData结构如下：

 ![image-20210727141931872](./media/image-20210727141931872.png)

![image-20210727142606782](./media/image-20210727142606782.png)

![image-20210727142258720](./media/image-20210727142258720.png)

从上述类图中可以看到BindingData持有一个list，类型是BindingList，BindingList内部通过innerList存放BindingObject。

## 更新界面数据

### 接口定义

```javascript
/**
  * 根据paths设置属性值
  * @param paths 属性路径数组
  * @param value 属性值
  * @param emitEventToView 如果设置为true，则发送事件通知订阅它的组件、指令去更新界面，默认为false。
  * @param emitEventToEntity 如果设置为true，则同步去更新Entity上对应的字段，默认为true。
  */
public setValue(paths: string[], value: any, emitEventToView: boolean = false, emitEventToEntity: boolean = true)
```

### 示例

- 更新主表数据

  ```javascript
  bindingData.setValue(['name'],'ESG');
  ```

- 更新子表数据

  ```javascript
  bindingData.setValue(['soItems','price'],20);
  ```

- 更新业务字段数据

  ```javascript
  bindingData.setValue(['udt','udt_field'],'value');
  ```



## 获取界面数据

### 接口定义

```javascript
/**
  * 获取paths对应的属性值
  * @param  paths 属性路径数组
  * @returns 属性值
  */
public getValue(paths: string[], useInitValue = false)
```

### 示例

- 获取主表数据

  ```javascript
  bindingData.getValue(['name']) //'ESG'
  ```

- 获取从表中字段属性

  ```javascript
  bindingData.getValue(['soItems','price']); // 20
  ```

- 获取业务字段数据

  ```javascript
  bindingData.getValue(['udt','udt_field']); // 'value'
  ```

  

## 获取指定BindingObject

### 接口定义

```javascript
/**
  * 通过主键获取对应的bindingObject
  */
bindingData.list.findById(id: string): BindingObject;
```

### 示例

- 获取某个主实体

  ```javascript
  bindingData.list.findById("id");
  ```

- 获取某个实体下子表的所有数据

  ```javascript
  // 获取主实体
  const bindingObject = bindingData.list.findById("id") as BindingObject;
  // 获取该实体下的某个子表数据
  const bindingList = bindingObject.getValue("soItems") as BindingList;
  ```

- 获取子表某一行数据

  ```javascript
  // 获取主实体
  const bindingObject = bindingData.list.findById("id") as BindingObject;
  // 获取该实体下的某个子表数据
  const bindingList = bindingObject.getValue("soItems") as BindingList;
  // 子表行数据
  const childrenBindingObject = bindingList.findById('子表数据id');
  const name = childrenBindingObject.getValue("name"); // 或者childrenBindingObject['name']
  ```

## 常见问题

1. 赋值或取值时为何不用指定主键？

   示例中取值或赋值时并没有指定主键值，这是由于BindingData赋值或取值时都是对当前行就行操作的，所以不需要指定主键。所以在计算&行切换场景下会导致取值或赋值错误，如本来想给第一行的某个字段赋值，结果由于行切换导致把值赋给了其他行。

   如果遇到赋值错误的情况可以通过BindingObject赋值或取值。
