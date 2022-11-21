<template>
    <a-input v-model:value="inputValue"></a-input>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: EnumSelectorName.input,
});
</script>
<script lang="ts" setup>
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import { usePropsProxy } from 'tdp-editor-utils/propsFactory';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();
const inputValue = usePropsProxy(
    _props.state,
    _props.prop.key as string,
    '',
    EnumPropsValueType.string
);
</script>
