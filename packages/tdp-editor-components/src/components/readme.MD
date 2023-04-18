## 如何开发组件

### 1. 添加组件类型枚举
在 tdp-editor-types/src/enum/components 目录中的 EnumComponentType 枚举下，添加新组件的枚举值

### 2. 在当前目录下创建以组件命名的文件夹

### 3. 在组件文件夹下创建interface.ts定义组件相关的interface
定义完整的组件属性interface，可开启ts类型校验
可参考button/interface.ts
### 4. 在组件文件夹下创建vue文件，实现交互逻辑
#### 4.1 每个组件有4个公共属性：
state: 为组件的所有原始状态
parentId: 为父组件的id
props: 为当前组件所有的属性(讲过处理后的属性，可直接用于渲染或逻辑处理)
css: 为当前组件的整体css样式对象

#### 4.2 组件的逻辑封装(composables)
可用的composable：
```
import { useBaseEvents, useBaseLifecycle, useBaseInject } from '../../composables/base';

// 接收prop
const allProps = defineProps<{
    state: IComponentState<IButtonProps>;
    parentId: string;
    props: IButtonProps;
    css: Record<string, any>;
}>();

// 使组件可以处理自定义事件( 可选 )
const eventRaw = useBaseEvents(allProps);

// 注册组件统一的生命周期事件( 必须 )
useBaseLifecycle(allProps);

// 使用inject方法( 可选 )
const { getAppMode } = useBaseInject();
// 获取当前运行状态
$log(getAppMode()) // 打印 当前的运行状态;
```

### 4.3 组件用禁止的行为

1. 禁止在组件中直接操作Pinia中的数据 -- 应使用controller中封装的方法和属性
   

### 5. 在组件文件夹下创建index.tsx，将组件的vue文件、组件的配置项等export出去

### 6. 完成以上开发后，组件即可自动添加到组件列表中
```
import DynamicRenderer from "../renderer/dynamicRenderer";
import data from "./demo1.data";
render(): VNode {
  return (
    <div id="cms_demo1">
      <dynamic-renderer json={data}></dynamic-renderer>
    </div>
  );
}
```


