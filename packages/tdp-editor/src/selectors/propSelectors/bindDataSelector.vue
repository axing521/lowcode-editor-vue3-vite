<template>
    <div>
        <a-input prefix="{{" suffix="}}" v-model:value="bindData"></a-input>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/src/enum/components';
import { getPropValue, setPropValue } from 'tdp-editor-common/src/factory/propsFactory';
export default defineComponent({
    name: EnumSelectorName.bindData,
});
</script>
<script lang="ts" setup>
const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();
const bindData = computed<string>({
    get() {
        const propValue = getPropValue(_props.state, _props.prop.key);
        if (propValue !== undefined) {
            return propValue;
        } else {
            return '';
        }
    },
    set(value) {
        setPropValue(_props.state, _props.prop.key, value, EnumPropsValueType.expression);
    },
});
</script>
