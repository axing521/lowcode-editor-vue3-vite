<template>
    <div class="item">
        <div class="label">{{ label }}</div>
        <div class="value">
            <a-input-group compact>
                <a-input v-model:value="computed_cssValue" style="width: 147px"></a-input>
                <a-select :value="valueUnit" @change="valueUnitChange" style="width: 70px">
                    <a-select-option
                        v-for="item in valueTypeList"
                        :key="item.key"
                        :value="item.key"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-input-group>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, reactive, watch, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { getCss, setCss } from 'tdp-editor-common/src/factory/cssFactory';

const props = defineProps<{
    state?: IDesignerComponent;
    cssStyleName: TCssStyleName;
    label: string;
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
        const value = getCss(props.state!, props.cssStyleName);
        if (value) {
            return value.replace(valueUnit.value, '');
        } else {
            return '';
        }
    },
    set(value: string): void {
        cssValue.value = value;
        if (value) {
            setCss(props.state!, props.cssStyleName, value + valueUnit.value);
        } else {
            setCss(props.state!, props.cssStyleName, undefined);
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
    () => props.state,
    (newElement, oldElement) => {
        if (newElement && newElement !== oldElement) {
            const css = newElement.css;
            if (css && css[props.cssStyleName]) {
                const __value = css[props.cssStyleName] as string;
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
