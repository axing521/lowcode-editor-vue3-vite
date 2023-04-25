<template>
    <prop-selector-wrapper
        :enable-expression="prop.enableExpression"
        :state="state"
        :prop="prop"
        :defualt-value-type="valueType"
    >
        <!-- 属性选择器实现 -->
        <template #value><a-switch v-model:checked="switchValue" /></template>
    </prop-selector-wrapper>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
export default defineComponent({
    name: EnumSelectorName.switch,
});
</script>
<script lang="ts" setup>
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/src/enum/components';
import { getPropValue, setPropValue } from 'tdp-editor-common/src/factory/propsFactory';
import PropSelectorWrapper from './PropSelectorWrapper.vue';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();
const valueType = EnumPropsValueType.boolean;
const switchValue = computed<boolean>({
    get() {
        const propValue = getPropValue(_props.state, _props.prop.key);
        if (propValue !== undefined) {
            return propValue;
        } else {
            return false;
        }
    },
    set(value) {
        setPropValue(_props.state, _props.prop.key, value, valueType);
    },
});
</script>
