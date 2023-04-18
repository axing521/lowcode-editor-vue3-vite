<template>
    <div class="css-color-selector">
        <a-popover placement="left" trigger="click">
            <template #content>
                <div style="width: 200; height: 200">
                    <Photoshop v-model="computed_cssValue" @cancel="computed_cssValue = ''" />
                </div>
            </template>
            <a-button
                class="button-show"
                :style="{ backgroundColor: computed_cssValue, width: '80%' }"
            >
                &nbsp;
            </a-button>
        </a-popover>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Photoshop } from 'vue-color';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { cssFactory } from 'tdp-editor-common/src';

const props = defineProps<{
    element?: IDesignerComponent;
    propertyName: TCssStyleName;
}>();
const cssValue = ref('');
const computed_cssValue = computed({
    get(): string {
        const value = cssFactory.getCssValue(props.element!, props.propertyName);
        return value || '';
    },
    set(value: any): void {
        cssValue.value = value.hex;
        if (cssValue.value) {
            cssFactory.setCssValue(props.element!, props.propertyName, cssValue.value);
        } else {
            cssFactory.setCssValue(props.element!, props.propertyName, undefined);
        }
    },
});
</script>
<script lang="ts">
export default defineComponent({
    name: 'css-color-selector',
});
</script>
