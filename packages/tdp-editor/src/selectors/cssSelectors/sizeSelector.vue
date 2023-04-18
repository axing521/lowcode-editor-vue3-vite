<template>
    <a-input-group compact>
        <a-input v-model:value="computed_cssValue" style="width: 100px"></a-input>
        <a-select :value="valueUnit" @change="valueUnitChange" style="width: 70px">
            <a-select-option v-for="item in valueTypeList" :key="item.key" :value="item.key">
                {{ item.label }}
            </a-select-option>
        </a-select>
    </a-input-group>
</template>
<script setup lang="ts">
import { defineComponent, ref, reactive, watch, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { cssFactory } from 'tdp-editor-common/src';

const props = defineProps<{
    element?: IDesignerComponent;
    propertyName: TCssStyleName;
}>();
const cssValue = ref('');
const valueUnit = ref('px');
const valueTypeList = reactive([
    { key: 'px', label: 'px' },
    { key: '%', label: '%' },
    { key: 'em', label: 'em' },
    { key: 'rem', label: 'rem' },
]);
const computed_cssValue = computed({
    get(): string {
        const value = cssFactory.getCssValue(props.element!, props.propertyName);
        if (value) {
            return value.replace(valueUnit.value, '');
        } else {
            return '';
        }
    },
    set(value: string): void {
        cssValue.value = value;
        if (value) {
            cssFactory.setCssValue(props.element!, props.propertyName, value + valueUnit.value);
        } else {
            cssFactory.setCssValue(props.element!, props.propertyName, undefined);
        }
    },
});
const valueUnitChange = (type: string) => {
    valueUnit.value = type;
    if (cssValue.value) {
        computed_cssValue.value = cssValue.value;
    }
};

watch(
    () => props.element,
    (newElement, oldElement) => {
        if (newElement && newElement !== oldElement) {
            const css = newElement.css;
            if (css && css[props.propertyName]) {
                const __value = css[props.propertyName] as string;
                if (__value.indexOf('px') > -1) {
                    valueUnit.value = 'px';
                } else if (__value.indexOf('%') > -1) {
                    valueUnit.value = '%';
                } else if (__value.indexOf('rem') > -1) {
                    valueUnit.value = 'rem';
                } else if (__value.indexOf('em') > -1) {
                    valueUnit.value = 'em';
                }
                cssValue.value = computed_cssValue.value;
            }
        }
    }
);
</script>
<script lang="ts">
export default defineComponent({
    name: 'css-size-selector',
});
</script>
