# Repository

Repository负责与后台接口交互并将接口返回的数据转换为Entity集合进行保存。因此Repository有两个重要的职责：后端交互、数据存储。
Repository中存储的数据是Entity类型，可以通过API对数据进行修改或删除。由于Repository和BindingData相互监听，对数据仓库的操作最终会通过BindingData更新到界面上。

## 实体操作
实体操作仅对Repository本地已经存在的数据进行操作，不会发送请求。

- 通过主键获取实体

  ```javascript
   this.repository.entityCollection.getEntityById("id");
  ```

- 删除实体数据

  ```javascript
  this.repository.entityCollection.removeEntityById("id")
  ```

- 清空所有实体

  ```javascript
  this.repository.entityCollection.clear();
  ```

- 将实体数据转换为json格式

  ```javascript
  this.repository.entityCollection.toJSON();
  ```

- 添加实体

  ```javascript
  this.repository.entityCollection.addEntity(entity:T);
  ```
- 添加子表实体

  ```javascript
  const befRepository = this.repository as BefRepository<any>;
  const entityManager = befRepository.entityManager;
  entityManager.appendEntityByPath("/主实体Id/子表名s",{子表JSON数据});
  ```
- 批量添加实体

  ```javascript
  this.repository.entityCollection.addEntities(entities:T[])
  ```
  
- 批量添加子表实体

  ```javascript
  const befRepository = this.repository as BefRepository<any>;
  const entityManager = befRepository.entityManager;
  const childrenEntities = entityManager.createEntitiesByPath(["主实体Id","子表名s"], entityListData: any[])
  entityManager.appendEntitiesByPath(["主实体Id","子表名s"],childrenEntities);
  ```

- 批量加载实体

  ```javascript
  this.repository.entityCollection.loadEntities(entities:T[]);
  ```

  > 加载实体会将本地仓库数据置为加载的实体。

- 创建实体

  ```javascript
  this.repository.buildEntity(JSON数据);
  ```

- 批量创建实体

  ```javascript
  this.repository.buildEntities(JSON数据);
  ```

- 获取子表数据

  ```javascript
  const befRepository = this.repository as BefRepository<any>;
  const entityManager = befRepository.entityManager;
  entityManager.getEntityByPath(["主实体Id","子表名","子表id"]);
  ```

  !> **注意** entityManager属性仅存在于BefRepository类，因此在使用EntityManager时应先将Repository转换为BefRepository

- 获取所有子表数据

  ```javascript
  const befRepository = this.repository as BefRepository<any>;
  const entityManager = befRepository.entityManager;
  entityManager.getEntitiesByPath(["主实体Id","子表名"]);
  ```

  > EntityManager不仅可以获取子表数据，同样可以获取主表数据。
  >
  > ```javascript
  > entityManager.getEntitiesByPath(["主实体Id"]);
  > ```
  
- 获取实体属性值

  ```javascript
  const entity = this.repository.entityCollection.getEntityById("id");
  cosnt name = entity['name'];
  // 或者
  const entity: any = this.repository.entityCollection.getEntityById("id");
  cosnt name = entity.name;
  ```

## 后端交互

​	通过接口操作后端数据，会直接对数据产生影响。

- 更新实体数据

  ```javascript
  this.repository.updateById('id');
  ```

- 删除实体

  ```javascript
  this.repository.removeById("id");
  ```

- 批量删除实体

  ```javascript
  this.repository.removeByIds(ids:string[])
  ```

- 删除下级表数据

  ```javascript
  this.repository.removeByPath(['主表Id','子表名','子表Id'])
  ```

- 新增主实体

  ```javascript
  this.repository.append();
  ```

- 新增子实体

  ```javascript
  this.repository.appendByPath(['主表id','子表名']);
  ```

- 加载实体数据

  ```javascript
  this.repository.getById('id');
  ```

- 获取主表数据

  ```javascript
  this.repository.getEntities(filter: any[], sorts: any[], pageSize: number | null, pageIndex: number | null)
  
  ```

  > pageSize、pageIndex可以不传。

- 获取主表数据（POST方法）

  ```javascript
  this.repository.filter(filter: any[], sorts: any[], pageSize: number | null, pageIndex: number | null)
  ```

- 提交指定实体变更到后端

  ```javascript
  this.repository.updateChangesById("id");
  ```

- 提交所有变更

  ```javascript
  this.repository.updateAllChanges();
  ```

- 应用变更（保存）

  ```javascript
  this.repository.applyChanges();
  ```

- 取消变更

  ```javascript
  this.repository.cancelChanges();
  ```

- 清除Repository所有变更

  ```javascript
  const befRepository = this.repository as BefRepository<any>;
  befRepository.entityManager.clearAllEntityChanges();
  ```
  
- 批量新增子表数据
  ```javascript
  this.repository.batchAppendByPath(path: string, defaultValues: Array<any>);
  ```
  
  > path `string`：/主表id/从表前端nodeCode，如果/1/orders
  >
  > defaultValues `Array<any>`：新增从表时的默认值，数组，元素为对象，key为字段名，value为默认值。
  
- 批量删除子表数据
  
  ```javascript
  this.repository.batchRemoveByPath(path: string, ids: string);
  ```
  
  > path `string`： /主表id/从表前端nodeCode，如果/1/orders
  >
  > ids `string` ：要删除的子表数据id，格式为`id1,id2,id3`