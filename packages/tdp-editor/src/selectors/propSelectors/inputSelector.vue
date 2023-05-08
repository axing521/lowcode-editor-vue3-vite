<template>
    <prop-selector-wrapper
        :enable-expression="prop.enableExpression"
        :state="state"
        :prop="prop"
        :defualt-value-type="valueType"
    >
        <!-- 属性名显示 ，如果不写这个template那么lable将不显示 -->
        <template #label />
        <!-- 属性选择器实现 -->
        <template #value><a-input v-model:value="inputValue"></a-input></template>
    </prop-selector-wrapper>
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
import PropSelectorWrapper from './PropSelectorWrapper.vue';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();

const valueType = EnumPropsValueType.string;
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
        setPropValue(_props.state, _props.prop.key, value, valueType);
    },
});
</script>
