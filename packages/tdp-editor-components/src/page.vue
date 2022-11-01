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
import { reactive, provide, ref } from 'vue';
import type { PropType } from 'vue';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import {
    addComponent,
    removeComponent,
    getAppMode,
    getComponentByKey,
    pageData,
    pageMethods,
} from 'tdp-editor-types/constant/injectKeys';
import { EnumAppMode } from 'tdp-editor-types/enum';
import type { IPageState } from 'tdp-editor-types/interface/components/page';
import type { IPageStoreState } from 'tdp-editor-types/interface/designer';
import FdComponent from './component';
import moment from 'moment';

const props = defineProps({
    json: {
        required: false,
        type: Object as PropType<IPageState | IPageStoreState>,
    },
    appMode: {
        required: true,
        type: String as PropType<EnumAppMode>,
        default: () => EnumAppMode.runtime,
    },
});

// 当前页面所有组件的实例集合
const components = reactive<Map<string, FdComponent>>(new Map());
// 当前页面所有的页面级变量
const __pageData = reactive<Record<string, any>>(props.json!.props!.pageData.value);
// 当前页面所有的方法
const methods = props.json!.props!.pageMethods.value;
const _methods: any = {};
for (const key in methods) {
    _methods[key] = new Function(methods[key]).bind(this);
}
const __pageMethods = ref(reactive<Record<string, any>>(_methods));

provide(pageData, __pageData);
provide(pageMethods, __pageMethods);
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
