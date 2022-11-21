# selector开发说明

## propSelector [属性选择器]

##### 1. tdp-editor-types/enum/designer 下的 EnumSelectorName枚举添加一个新值
##### 2. 在propSelectors文件夹下创建一个与枚举值相同的vue组件
##### 3. 所有选择器的共有props有3个：state、prop、options
state为组件的所有状态
prop为当前用户选中的属性
options为传入给selector的选项，每个选择器有不同的选项
```
例如sliderSelector，选项中有max值和min值
// propSelectors/sliderSelector.vue
const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
    options?: ISelectorSliderOptions;
}>();
```
如果选择器有选项，需要定义选项的interface, interface目录为 tdp-editor-types/interface/designer/selector.ts
