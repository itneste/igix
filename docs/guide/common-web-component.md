# 公共Web构件

在开发过程中有时多个表单会涉及到公共的业务逻辑，比如地图服务中将地址转换为经纬度。此时我们可以将这些公共的逻辑抽象为公共构件。

抽象为公共构件后开发人员可以直接将构件内置的命令挂载到表单，开发人员不必为每个表单开发单独且重复的构件，并且如果公共构件中存在问题，只需要修改公共构件，表单不需要做处理。从而大大提供开发效率。

## Overview

开发公共构件和平时开发web构件基本类似，共需要三个步骤：

1、编写公共类库

2、描述类库

3、编译打包

下面就这三个步骤进行详细说明。

## 编写公共类库

既然要在不同表单甚至工程中复用代码，那么首先需要将复用的代码抽离成一个单独的类库。已angular为例，首先创建`工作区域`及`工程`。

下面我们以中国移动地图应用为例讲解公共类库开发过程。

### 创建工作区

```shell
ng new cmcc --create-application=false  --skip-tests=true  --skip-git=true
```

### 创建地图工程

```shell
# cmcc目录下执行
# cd cmcc
ng g lib cmcc-map --skip-tests=true
```

### 调整构件代码

删除`cmcc\projects\map\src\lib`目录下除`map.module.ts`以外的所有文件。

删除`cmcc\projects\map\src\public-api.ts`文件中除`export * from './lib/map.module';`外的所有代码。

```typescript
/*
 * Public API Surface of cmcc-map
 */

export * from './lib/map.module';

```

[可选]修改`package.json`，将`name`修改为`@cmcc/map`

```json
{
  "name": "@cmcc/map",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^7.2.0",
    "@angular/core": "^7.2.0"
  }
}
```

[可选]修改`ng-package.json``dest`路径：

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/@cmcc/map",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

### 编写构件

在lib目录新建`geocoderService.ts`文件，编写地址转换服务，和普通的web构件开发模式一致。

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class GeoCoderService {
  private static ak = 'E4805d16520de693a3fe707cdc962045';
  constructor(private httpClient: HttpClient) { }
  /**
   * 获取指定地址的经纬度
   * @param address 地址
   * @param output 格式
   * @returns 
   */
  public geoCoder(address: string, output: string = 'json') {
    const url = `http://api.map.baidu.com/geocoder/v2/?address=${address}&output=${output}&ak=${GeoCoderService.ak}`;
    return this.httpClient.get(url).pipe(
      map((result: any) => {
        return { lng: result.location.lng, lat: result.location.lat };
      })
    );
  }
}
```

如果需要用到第三方类库，如`@farris/devkit`，则应该在package.json中添加依赖，并安装，使用方式和Web构件类似。

### 导出服务

修改`public-api.ts`

```typescript
/*
 * Public API Surface of cmcc-map
 */
import { GeoCoderService } from './lib/geocoderService';
import { MapModule } from './lib/map.module';
export {
  GeoCoderService,
  MapModule
}
```

### provider

服务创建完成后需要为服务设置provider，可以设置为模块级provider，也可以设置为组件级。如果设置为组件级则需要修改生成后的表单代码。本文以模块级注入为例讲解。

在`src`目录新建`providers.ts`。

```typescript
import { Provider } from '@angular/core';
import { GeoCoderService } from './geocoderService';

const CMCC_MAP_PROVIDERS: Provider[] = [
  GeoCoderService
];

export { CMCC_MAP_PROVIDERS };
```

修改`public-api.ts`

```typescript
/*
 * Public API Surface of cmcc-map
 */
import { GeoCoderService } from './lib/geocoderService';
import { MapModule } from './lib/map.module';
import { CMCC_MAP_PROVIDERS } from './lib/providers';

export {
  GeoCoderService,
  MapModule,
  CMCC_MAP_PROVIDERS
}

```

修改`map.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CMCC_MAP_PROVIDERS } from './providers';

@NgModule({
  providers: CMCC_MAP_PROVIDERS,
  declarations: [],
  imports: [
  ],
  exports: []
})
export class MapModule { }

```

至此构件就开发完成了，如果需要更多的服务，可以按照类似的方法继续添加。

## 描述类库

使用Web构件描述服务，使用Web命令描述命令。

打开WebIde新建`集成工程`，工程名为``