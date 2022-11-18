<template>
    <a-switch v-model:checked="_value" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: EnumSelectorName.switch,
});
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import propsFactory from 'tdp-editor-utils/propsFactory';

const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
}>();
const _value = computed({
    get(): boolean {
        return propsFactory.getPropsValue(_props.element, _props.prop.key) || false;
    },
    set(checked: boolean) {
        propsFactory.setPropsValue(
            _props.element,
            _props.prop.key,
            checked,
            EnumPropsValueType.boolean
        );
    },
});
</script>
