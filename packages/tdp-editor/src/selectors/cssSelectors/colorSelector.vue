<template>
    <div class="item">
        <div class="label">{{ label }}</div>
        <div class="value">
            <div class="css-color-selector">
                <a-popover placement="left" v-model:visible="showPS" trigger="click">
                    <template #content>
                        <div style="width: 200; height: 200">
                            <Photoshop
                                v-model="computed_color"
                                acceptLabel="确定"
                                cancelLabel="取消"
                                @ok="ok"
                                @cancel="cancel"
                            />
                        </div>
                    </template>
                    <div
                        @click="showPS = !showPS"
                        class="button-show"
                        :style="{ backgroundColor: computed_color, width: '80%' }"
                    >
                        &nbsp;
                    </div>
                </a-popover>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Photoshop } from '@ckpack/vue-color';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { getCss, setCss } from 'tdp-editor-common/src/factory/cssFactory';

const props = defineProps<{
    state?: IDesignerComponent;
    cssStyleName: TCssStyleName;
    label: string;
}>();
const showPS = ref(false);
const color = ref('');
const computed_color = computed({
    get() {
        return getCss(props.state!, props.cssStyleName) || '#ffffff';
    },
    set(value: any) {
        color.value = value.hex;
    },
});
const ok = () => {
    showPS.value = false;
    if (props.state) {
        setCss(props.state, props.cssStyleName, color.value);
    }
};
const cancel = () => {
    color.value = '';
    showPS.value = false;
};
</script>
<script lang="ts">
export default defineComponent({
    name: 'css-color-selector',
});
</script>
<style lang="less">
.css-color-selector {
    .button-show {
        width: 100% !important;
        height: 10px;
        border: 1px solid #7a94b5;
        cursor: pointer;
    }
}
</style>
