<template>
    <a-input v-model:value="inputValue"></a-input>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: EnumSelectorName.input,
});
</script>
<script lang="ts" setup>
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';
import { getPropValue, setPropValue } from 'tdp-editor-common/src/factory/propsFactory';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/src/enum/components';
const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();
const inputValue = computed<string>({
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
