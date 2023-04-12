<template>
    <a-row>
        <a-col :span="12">
            <a-slider v-model:value="sliderValue" :min="min" :max="max" />
        </a-col>
        <a-col :span="6">
            <a-input-number
                v-model:value="sliderValue"
                :min="min"
                :max="max"
                style="marginleft: 5px"
            />
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
import { getPropValue, setPropValue } from 'tdp-editor-common/factory/propsFactory';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';

const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
    options?: ISelectorSliderOptions;
}>();

const min = computed(() => {
    return _props.options?.min || 1;
});
const max = computed(() => {
    return _props.options?.max || 20;
});

const sliderValue = computed<string>({
    get() {
        const propValue = getPropValue(_props.state, _props.prop.key);
        if (propValue !== undefined) {
            return propValue;
        } else {
            return max.value;
        }
    },
    set(value) {
        setPropValue(_props.state, _props.prop.key, value, EnumPropsValueType.number);
    },
});
</script>
