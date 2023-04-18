<template>
    <div class="item">
        <div class="label">{{ props.label }}</div>
        <div class="value">
            <a-select v-model:value="computed_cssValue">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="flex">flex</a-select-option>
                <a-select-option value="block">块元素</a-select-option>
                <a-select-option value="inline-block"> 行内块元素 </a-select-option>
                <a-select-option value="inline">行内元素</a-select-option>
            </a-select>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { getCss, setCss } from 'tdp-editor-common/src/factory/cssFactory';

const props = defineProps<{
    state?: IDesignerComponent;
    cssStyleName: TCssStyleName;
    label: string;
}>();
const computed_cssValue = computed({
    get(): string {
        return getCss(props.state!, props.cssStyleName) || '';
    },
    set(value: any): void {
        setCss(props.state!, props.cssStyleName, value);
    },
});
</script>
<script lang="ts">
export default defineComponent({
    name: 'css-display-selector',
});
</script>
