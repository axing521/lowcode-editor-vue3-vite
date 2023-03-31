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
import type { PropType } from 'vue';
import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import {
    addComponent,
    removeComponent,
    getAppMode,
    getComponentByKey,
} from 'tdp-editor-types/constant/injectKeys';
import { EnumAppMode } from 'tdp-editor-types/enum';
import FdComponent from './component';
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
const components = reactive<Map<string, FdComponent>>(new Map());

provide(getAppMode, () => {
    return props.appMode;
});
provide(addComponent, (key, componentInstance) => {
    components.set(key, new FdComponent(key, componentInstance));
});
provide(removeComponent, key => {
    components.delete(key);
});
provide(getComponentByKey, key => {
    return components.get(key);
});

// 清空form组件的值
const resetFormFields = () => {
    components.forEach(component => {
        // 将form组件的value设置为空
        if (component.$state && component.$state.group === EnumComponentGroup.form) {
            component.setProps('value', null);
        }
    });
};
// 根据给定的defaultData默认值，初始化表单数据
const initFormFields = (defaultData: Record<string, any>) => {
    components.forEach(component => {
        // 将form组件的value设置为空
        if (component.$state && component.$state.group === EnumComponentGroup.form) {
            const value = defaultData[component.$key || ''] || null;
            if (component.$state.type === EnumComponentType.datePicker) {
                if (value) {
                    component.setProps('value', moment(value));
                } else {
                    component.setProps('value', null);
                }
            } else {
                component.setProps('value', value);
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
