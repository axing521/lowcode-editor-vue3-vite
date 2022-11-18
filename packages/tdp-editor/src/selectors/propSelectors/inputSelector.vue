<template>
    <a-input v-model:value="_value"></a-input>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: EnumSelectorName.input,
});
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { propsFactory } from 'tdp-editor-utils';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';

const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
}>();

const _value = computed<string>({
    get(): string {
        return propsFactory.getPropsValue(_props.element, _props.prop.key);
    },
    set(value: string) {
        propsFactory.setPropsValue(
            _props.element,
            _props.prop.key,
            value || '',
            EnumPropsValueType.string
        );
    },
});
const name = EnumSelectorName.input;
defineExpose({
    name,
});
</script>
