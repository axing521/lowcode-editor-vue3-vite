<template>
    <a-row>
        <a-col :span="12">
            <a-slider v-model:value="_value" :min="min" :max="max" />
        </a-col>
        <a-col :span="6">
            <a-input-number v-model:value="_value" :min="min" :max="max" style="marginleft: 5px" />
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: EnumSelectorName.slider,
});
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import type { ISelectorSliderOptions } from 'tdp-editor-types/interface/designer/selector';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { propsFactory } from 'tdp-editor-utils';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';

const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
    options?: ISelectorSliderOptions;
}>();

const min = computed(() => {
    return _props.options?.min || 1;
});
const max = computed(() => {
    return _props.options?.max || 20;
});

const _value = computed({
    get(): number {
        return propsFactory.getPropsValue(_props.element, _props.prop.key) || max.value;
    },
    set(value: string | number) {
        propsFactory.setPropsValue(
            _props.element,
            _props.prop.key,
            Number(value || max.value),
            EnumPropsValueType.number
        );
    },
});
</script>
