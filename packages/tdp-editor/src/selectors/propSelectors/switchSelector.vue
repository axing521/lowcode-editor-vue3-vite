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
import { usePropsProxy } from 'tdp-editor-utils/factory/propsFactory.js';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();

const switchValue = usePropsProxy(
    _props.state,
    _props.prop.key as string,
    false,
    EnumPropsValueType.boolean
);
</script>
