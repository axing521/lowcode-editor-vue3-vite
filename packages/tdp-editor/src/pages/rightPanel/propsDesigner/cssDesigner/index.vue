<template>
    <div class="designer-css-panel">
        <div class="section">
            <div class="item">
                <div class="label">边距</div>
                <div class="value">
                    <css-box-selector :element="props.element" />
                </div>
            </div>
            <component
                v-for="item in cssList"
                :key="item.key"
                :is="item.selector"
                :label="item.label"
                :state="props.element"
                :cssStyleName="item.key"
            ></component>
            <div class="item">
                <div class="label">css代码</div>
                <div class="value">
                    <a-button @lick="showMonaco = true">编辑</a-button>
                </div>
            </div>
        </div>
        <div id="fd_css_monaco_box" :style="{ display: showMonaco ? 'block' : 'none' }">
            <div class="box-buttons">
                <a-button type="link" @click="showMonaco = false"> 关闭 </a-button>
                <a-button type="primary" @click="saveStyleText"> 确定 </a-button>
            </div>
            <div id="fd_css_designer_monaco"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { cssFactory } from 'tdp-editor-common/src';
import { cssSelectorMap } from '../../../../selectors/cssSelectors';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';

const props = defineProps<{
    element?: IDesignerComponent;
}>();
const monacoRef = ref<any>(null);
const showMonaco = ref(false);
const saveStyleText = () => {
    showMonaco.value = false;
    if (props.element && monacoRef.value) {
        const styleText = monacoRef.value.getValue();
        cssFactory.setCssValue(props.element, 'styleText', styleText);
    }
};
const cssList = computed(() => {
    if (props.element) {
        const componentList = useEditorStore().componentList;
        const comp = componentList.find(c => c.type === props.element!.type);
        if (comp && comp.cssConfigs) {
            return comp.cssConfigs.map(css => {
                const selectorInfo = cssSelectorMap[css as any] || {};
                return {
                    key: css,
                    selector: selectorInfo.selector,
                    label: selectorInfo.label,
                };
            });
        } else {
            return [];
        }
    } else {
        return [];
    }
});
</script>
<script lang="ts">
export default defineComponent({
    name: 'designer-css-panel',
});
</script>
<style lang="less">
.designer-css-panel {
    position: relative;
    #fd_css_monaco_box {
        position: fixed;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background-color: #fff;
        display: none;
        z-index: 1000;
        .box-buttons {
            width: 100%;
            height: 40px;
            line-height: 40px;
            position: absolute;
            right: 0;
            top: 0;
            .ant-btn {
                float: right;
            }
        }
        #fd_css_designer_monaco {
            width: 100%;
            height: 100%;
            padding: 40px 10px;
            text-align: left;
        }
    }
}
</style>
