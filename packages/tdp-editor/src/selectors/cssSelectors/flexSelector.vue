<template>
    <div class="item">
        <div class="label">{{ label }}</div>
        <div class="value">
            <div class="flex-group">
                <h3>快捷设置</h3>
                <div class="flex-box">
                    <a-button @click="quickSizeChange('default')">清空</a-button>
                    <a-button @click="quickSizeChange('flex')">自动</a-button>
                    <a-button @click="quickSizeChange('fixed')">固定</a-button>
                </div>
                <h3>手动设置</h3>
                <div class="flex-box">
                    <div class="box-label">伸展</div>
                    <div class="box-content">
                        <a-input-number v-model:value="flexGrow" :min="0" :max="10" />
                    </div>
                </div>
                <div class="flex-box">
                    <div class="box-label">收缩</div>
                    <div class="box-content">
                        <a-input-number v-model:value="flexShrink" :min="0" :max="10" />
                    </div>
                </div>
                <div class="flex-box">
                    <div class="box-label">基础尺寸</div>
                    <div class="box-content">
                        <a-input id="inputNumber" v-model:value="flexBasis" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.flex-box {
    display: flex;
    flex-flow: row;
    height: 40px;
    line-height: 40px;
    .box-label {
        width: 80px;
        flex: 0 0 auto;
    }
    .box-content {
        flex: 1;
    }
}
</style>
<script setup lang="ts">
import { defineComponent, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { getCss, setCss } from 'tdp-editor-common/src/factory/cssFactory';

type TQuickSize = 'default' | 'flex' | 'fixed';

const props = defineProps<{
    state?: IDesignerComponent;
    cssStyleName: TCssStyleName;
    label: string;
}>();
const quickSizeChange = (value: TQuickSize) => {
    const css = props.state?.css;
    if (value === 'default') {
        if (css) {
            delete css.flexGrow;
            delete css.flexShrink;
            delete css.flexBasis;
        }
    } else if (value === 'flex') {
        setCss(props.state!, 'flexGrow', '1');
        setCss(props.state!, 'flexShrink', '1');
        setCss(props.state!, 'flexBasis', '0%');
    } else if (value === 'fixed') {
        setCss(props.state!, 'flexGrow', '0');
        setCss(props.state!, 'flexShrink', '0');
        setCss(props.state!, 'flexBasis', '300px');
    }
};
const flexGrow = computed({
    get(): string {
        return getCss(props.state!, 'flexGrow') || '1';
    },
    set(value: string): void {
        setCss(props.state!, 'flexGrow', value);
    },
});
const flexShrink = computed({
    get(): string {
        return getCss(props.state!, 'flexShrink') || '1';
    },
    set(value: string): void {
        setCss(props.state!, 'flexShrink', value);
    },
});
const flexBasis = computed({
    get(): string {
        return getCss(props.state!, 'flexBasis') || '';
    },
    set(value: string): void {
        setCss(props.state!, 'flexBasis', value);
    },
});
</script>
<script lang="ts">
export default defineComponent({
    name: 'css-flex-selector',
});
</script>
