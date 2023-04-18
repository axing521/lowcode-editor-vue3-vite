## 如何开发属性选择器

### propSelector [属性选择器]

#### 1. 创建枚举值
tdp-editor-types/src/enum/designer 下的 EnumSelectorName枚举添加一个新值，以 "Selector" 结尾
#### 2. 在当前目录下创建一个与枚举值相同的vue组件
#### 3. vue组件的name以EnumSelectorName枚举值命名
#### 4. 开发selector组件的逻辑
所有选择器的共有props有4个：state、prop、options、label

state: 为组件的所有原始状态
prop: 为当前用户选中的属性
options: 为传入给selector的选项，每个选择器有不同的选项
label: 属性设计面板中对应的属性名
```
例如sliderSelector，选项中有max值和min值
// propSelectors/sliderSelector.vue
const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
    options?: ISelectorSliderOptions;
}>();
```
如果选择器有选项，需要定义选项的interface, interface目录为 tdp-editor-types/src/interface/designer/selector.ts

#### 5. 完成上述开发后，属性选择器即可生效
