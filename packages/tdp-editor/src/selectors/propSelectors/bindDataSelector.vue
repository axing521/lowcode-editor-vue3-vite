<template>
    <div>
        <a-input prefix="{{" suffix="}}" v-model:value="bindData"></a-input>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
export default defineComponent({
    name: EnumSelectorName.bindData,
});
</script>
<script lang="ts" setup>
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import { usePropsProxy } from 'tdp-editor-utils/factory/propsFactory.js';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();
const bindData = usePropsProxy(
    _props.state,
    _props.prop.key as string,
    '',
    EnumPropsValueType.expression
);
</script>
