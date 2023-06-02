<template>
    <div v-if="json" class="fd-page editor-designer-box" :id="json.key" :style="json.css">
        <ComponentWrapper
            v-for="(child, index) in json.list"
            :key="child.key + '_wrapper'"
            :state="child"
            :parentId="json.key"
            :data-index="index"
        ></ComponentWrapper>
    </div>
</template>

<style lang="less">
@import url('../../styles/var/index.less');

@prefixName: ~'@{prefix-className}';
.@{prefixName}-page {
    position: relative;
}
</style>

<script lang="ts" setup>
import { provide } from 'vue';
import type { IPageState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumAppMode } from 'tdp-editor-types/src/enum';
import ComponentWrapper from '../componentWrapper.vue';

import {
    addComponent,
    removeComponent,
    getAppMode,
    getComponentByKey,
} from 'tdp-editor-types/src/constant/injectKeys';
import { usePageControler } from 'tdp-editor-common/src/controller';

const pageController = usePageControler();
const props = defineProps<{
    json?: IPageState;
    appMode: EnumAppMode;
}>();

provide(getAppMode, () => {
    return props.appMode;
});
provide(addComponent, (key, componentInstance) => {
    pageController.addComponent(key, componentInstance);
});
provide(removeComponent, key => {
    pageController.deleteComponent(key);
});
provide(getComponentByKey, key => {
    return pageController.getComponentByKey(key);
});
// provide(getComponentsMap, () => {
//     return pageController.getComponentsMap();
// });

// // 清空form组件的值
// const resetFormFields = () => {
//     pageController.getComponentsMap().forEach(component => {
//         // 将form组件的value设置为空
//         if (component.state && component.state.group === EnumComponentGroup.form) {
//             component.props.value = null;
//         }
//     });
// };
// // 根据给定的defaultData默认值，初始化表单数据
// const initFormFields = (defaultData: Record<string, any>) => {
//     pageController.getComponentsMap().forEach(component => {
//         // 将form组件的value设置为空
//         if (component.state.group === EnumComponentGroup.form) {
//             const value = defaultData[component.state.key || ''] || null;
//             if (component.state.type === EnumComponentType.datePicker) {
//                 if (value) {
//                     component.props.value = moment(value);
//                 } else {
//                     component.props.value = null;
//                 }
//             } else {
//                 component.props.value = value;
//             }
//         }
//     });
// };

// provide('resetFormFields', resetFormFields);
// provide('initFormFields', initFormFields);
</script>
<script lang="ts">
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';

export default {
    name: EnumComponentType.page,
};
</script>
