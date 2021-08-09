# 表单通信方法

表单内的通信可以使用EventBus或变量完成，但无法做到跨表单通信。鉴于此，devkit提供了一套跨表单通信的服务：消息管道服务MessagePipeService。
消息管道服务的基础是管道，开发者使用时应先创建一个管道，有了消息管道后就可以在管道上发送或监听消息，监听者也可以随时取消监听。

## 概念

### 管道

```typescript
class MessagePipe {
    // 管道标识
    public token: string;
    /**
     * 向管道发送消息
     * @param message 消息
     */
    public sendMessage(message: any);
    /**
     * 监听管道消息
     * @param handler 消息处理器
     */
    public listen(handler: (data: any) => void): () => void;
    /**
     * 销毁管道
     */
    public destory();
}
```

## 如何使用

1. 导入服务：

   ```typescript
   import { MessagePipeService,MessagePipe } from '@farris/command-services';
   ```
   
2. 创建管道

   ```typescript
   const pipe:MessagePipe = MessagePipeService.create(topic,useFormContext,pipeType);
   ```
   
   > **参数**：
   >
   > - topic：管道的主题，主要用于调试时区分不同的管道
   >
   > - useFormContext：是否使用表单上下文。
      >
   >   此参数指示如何生成管道的标识，只有知道了管道标识才能操作管道，如发送或监听管道消息。
   >
   >   如果设置为true，则使用表单上下文生成管道的标识，且符合如下规则：
   >
   >   1、在菜单内
   >
   >   如果是在菜单内使用表单上下文创建管道标识，则管道的标识就是菜单的Id，即funcId
   >
   >   2、在应用内
   >
   >   如果是在应用内使用表单上下文创建管道标识，则管道标识为：appId-appEntrance
   >
   >   如果设置为false，将随机生成一个标识
   >
   > - pipeType：可选参数，管道类型，默认使用Subject作为默认管道，如果需要可以设置为BehaviorSubject

      > **返回值**：
   >
   > 创建的管道

3. 获取管道实例

   ```typescript
   const pipe:MessagePipe = MessagePipeService.get('管道标识');
   ```

   > 其他表单在获取管道实例时需要知道管道的标识，建议使用表单上下文创建管道，通过上述的约定即可知道管道标识。
4. 发送消息

   ```typescript
   const message = {messageType:1,prop1:value1,prop2:value2};
   pipe.sendMessage(message);
   ```
5. 监听管道消息

   ```typescript
   const unListen = pipe.listen((message)=>{
   	console.log(message);
   });
   ```

   > 监听管道消息时返回值是一个函数，执行该函数则取消对管道的监听。
6. 取消管道消息监听

   ```typescript
   const unListen = pipe.listen((message)=>{
   	console.log(message);
   });
   unListen(); // 取消监听
   ```
7. 销毁管道

   ```typescript
   pipe.destory();
   ```

   


