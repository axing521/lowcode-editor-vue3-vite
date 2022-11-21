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
import { usePropsProxy } from 'tdp-editor-utils/propsFactory';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';

const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
    options?: ISelectorSelectOptions;
}>();

const selectData = usePropsProxy(
    _props.element,
    _props.prop.key as string,
    '',
    EnumPropsValueType.string
);
const items = computed(() => {
    return _props.options?.items || [];
});
</script>
