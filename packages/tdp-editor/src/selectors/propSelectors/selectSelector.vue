<template>
    <a-select v-model:value="selectData">
        <a-select-option v-for="option in items" :key="option.key" :value="option.key">
            {{ option.label }}
        </a-select-option>
    </a-select>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: EnumSelectorName.select,
});
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import type { ISelectorSelectOptions } from 'tdp-editor-types/interface/designer/selector';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import { getPropValue, setPropValue } from 'tdp-editor-utils/factory/propsFactory';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
    options?: ISelectorSelectOptions;
}>();

const items = computed(() => {
    return _props.options?.items || [];
});
const selectData = computed<string>({
    get() {
        const propValue = getPropValue(_props.state, _props.prop.key);
        if (propValue !== undefined) {
            return propValue;
        } else {
            return '';
        }
    },
    set(value) {
        setPropValue(_props.state, _props.prop.key, value, EnumPropsValueType.string);
    },
});
</script>
