<template>
    <a-switch v-model:checked="switchValue" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: EnumSelectorName.switch,
});
</script>
<script lang="ts" setup>
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import { usePropsProxy } from 'tdp-editor-utils/propsFactory';

const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
}>();

const switchValue = usePropsProxy(
    _props.element,
    _props.prop.key as string,
    false,
    EnumPropsValueType.boolean
);
</script>
