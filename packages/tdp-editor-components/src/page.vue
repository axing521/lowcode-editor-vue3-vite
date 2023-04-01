<template>
    <div v-if="json" class="template-page" :id="json.key" :style="json.css" data-app>
        <fd-layout :state="json" parentId=""></fd-layout>
    </div>
</template>

<style lang="less">
@import url('./styles/var/index.less');

@prefixName: ~'@{prefix-className}';
.@{prefixName}-renderer {
    position: relative;
}
</style>

<script lang="ts" setup>
import { reactive, provide } from 'vue';
import type { PropType, ComponentPublicInstance } from 'vue';
import type {
    IComponentCommonProps,
    IComponentState,
} from 'tdp-editor-types/interface/app/components';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import {
    addComponent,
    removeComponent,
    getAppMode,
    getComponentByKey,
    getComponentsMap,
} from 'tdp-editor-types/constant/injectKeys';
import { EnumAppMode } from 'tdp-editor-types/enum';
import moment from 'moment';

const props = defineProps({
    json: {
        required: true,
        type: Object as PropType<IComponentState>,
    },
    appMode: {
        required: true,
        type: String as PropType<EnumAppMode>,
        default: () => EnumAppMode.runtime,
    },
});
// 当前页面所有组件的实例集合
const componentsMap = reactive<Map<string, ComponentPublicInstance<IComponentCommonProps>>>(
    new Map()
);

provide(getAppMode, () => {
    return props.appMode;
});
provide(addComponent, (key, componentInstance) => {
    componentsMap.set(key, componentInstance as any);
});
provide(removeComponent, key => {
    componentsMap.delete(key);
});
provide(getComponentByKey, key => {
    return componentsMap.get(key);
});
provide(getComponentsMap, () => {
    return componentsMap;
});

// 清空form组件的值
const resetFormFields = () => {
    componentsMap.forEach(component => {
        // 将form组件的value设置为空
        if (component.state && component.state.group === EnumComponentGroup.form) {
            component.props.value = null;
        }
    });
};
// 根据给定的defaultData默认值，初始化表单数据
const initFormFields = (defaultData: Record<string, any>) => {
    componentsMap.forEach(component => {
        // 将form组件的value设置为空
        if (component.state.group === EnumComponentGroup.form) {
            const value = defaultData[component.state.key || ''] || null;
            if (component.state.type === EnumComponentType.datePicker) {
                if (value) {
                    component.props.value = moment(value);
                } else {
                    component.props.value = null;
                }
            } else {
                component.props.value = value;
            }
        }
    });
};

provide('resetFormFields', resetFormFields);
provide('initFormFields', initFormFields);
</script>
<script lang="ts">
import { EnumComponentType } from 'tdp-editor-types/enum/components';

export default {
    name: EnumComponentType.page,
};
</script>
