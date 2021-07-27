# 实体

## Overview

在开发的过程中，我们经常要对实体数据进行遍历、操作，由于实体数据结构是一个深层次的树状结构，进行这些操作往往需要编写大量重复代码。为了解决访问、操作实体难的问题，我们在@farris/command-services的EntityService类中进行了封装。为了演示具体的使用方法，我们假设有一个主从结构的业务实体，主对象是员工（Emp），子对象是教育经历(Edu)，在前端他们生成的

实体结构如下：

```ts
class Emp extends Entity {
  @NgField({
    dataField: 'id',
    primary: true
  })
  public id: string;

  @NgField({
    dataField: 'code'
  })
  public code: string;

  @NgField({
    dataField: 'name'
  })
  public name: string;

  @NgField({
    dataField: 'age'
  })
  public age: number;
  @NgObject({
    dataField: 'deptID',
    type: Dept
  })
  public deptID: Dept;
  @NgList({
    dataField: 'edus',
    type: Edu
  })
  edus: EntityList<Edu>;
}

class Dept extends Entity {
  @NgField({
    dataField: 'deptID',
    primary: true
  })
  deptID: string;
  @NgField({
    dataField: 'deptID_Code'
  })
  deptID_Code: string;

  @NgField({
    dataField: 'deptID_Name'
  })
  deptID_Name: string;
}
class Edu extends Entity {
  @NgField({
    dataField: 'id',
    primary: true
  })
  id: string;

  @NgField({
    dataField: 'parentID',
    foreign: true
  })
  parentID: string;

  @NgField({
    dataField: 'school'
  })
  school: string;

  @NgField({
    dataField: 'years'
  })
  years: string;
}
```

我们在一个名叫TestService的类中进行演示，我们要为它注入EntityService
```ts
import { EntityService } from '@farris/command-services';
class TestService {
  constructor(private entityService: EntityService) {
    super();
  }
}
```

## 获取实体数据、实体列表数据

```ts
// 获取各个层级的实体列表数据
const empListData = this.entityService.getEntityListData([]);
const eduListData = this.entityService.getEntityListData(['edus']);
```

```ts
// 获取各个层级的实体数据
const empData  = this.entityService.getEntityData([]);
const deptData = this.entityService.getEntityData(['deptID']),
const eduData  = this.entityService.getEntityData(['edus']);
```

## 获取属性值、设置属性值

```ts
// 设置各个层级的实体属性值
this.entityService.setPropValue(['name'], 'Emp0001');
this.entityService.setPropValue(['deptID', 'deptID'], '1');
this.entityService.setPropValue(['deptID', 'deptID_Code'], 'DCode0001');
this.entityService.setPropValue(['deptID', 'deptID_Name'], 'DName0001');
this.entityService.setPropValue(['edus', 'school'], 'School00010001');
```

```ts
// 获取各个层级实体属性的值
const empName    = this.entityService.getPropValue(['name']);
const deptName   = this.entityService.getPropValue(['deptID', 'deptID_Name']);
const schoolName = this.entityService.getPropValue(['edus', 'school']);
```


## 聚合函数

### 记录数

```ts
const countEmp = this.entityService.count([]);
const countEdu = this.entityService.count(['edus']);
```

### 求和

```ts
const sumEmpAge   = this.entityService.sum(['age']);
const sumDeptCode = this.entityService.sum(['deptID', 'deptID_deptCode']);
const sumEduYear  = this.entityService.sum(['edus', 'years']);
```

### 平均值

```ts
const avgEmpAge   = this.entityService.avg(['age']);
const avgDeptCode = this.entityService.avg(['deptID', 'deptID_deptCode']);
const avgEduYear  = this.entityService.avg(['edus', 'years']);
```

### 最大值

```ts
const maxEmpAge   = this.entityService.max(['age']);
const maxDeptCode = this.entityService.max(['deptID', 'deptID_deptCode']);
const maxEduYear  = this.entityService.max(['edus', 'years']);
```

### 最小值


```ts
const minEmpAge   = this.entityService.min(['age']);
const minDeptCode = this.entityService.min(['deptID', 'deptID_deptCode']);
const minEduYear  = this.entityService.min(['edus', 'years']);
```