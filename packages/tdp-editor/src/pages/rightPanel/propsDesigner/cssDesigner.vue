<template>
    <div class="designer-css-panel">
        <div class="section">
            <css-box-selector :state="props.element" />
            <css-class-selector :state="props.element"></css-class-selector>
            <component
                v-for="item in cssList"
                :key="item.key"
                :is="item.selector"
                :label="item.label"
                :state="props.element"
                :cssStyleName="item.key"
            ></component>
        </div>
        <div id="fd_css_monaco_box" v-show="showMonacoBox">
            <div class="box-buttons">
                <a-button type="link" @click="closeMonacoBox"> 关闭 </a-button>
                <a-button type="primary" @click="savePageStyles"> 确定 </a-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue';
import type { IPageState } from 'tdp-editor-types/src/interface/app/components';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { cssSelectorMap } from '../../../selectors/cssSelectors';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';

const props = defineProps<{
    element?: IDesignerComponent;
}>();
const monacoRef = ref<any>(null);
const showMonacoBox = ref(false);
const showMonaco = ref(false);
const savePageStyles = () => {
    showMonacoBox.value = false;
    showMonaco.value = false;
    if (props.element && props.element.type === EnumComponentType.page && monacoRef.value) {
        const styleText = monacoRef.value.getValue();
        (props.element as IPageState).styles = styleText;
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

const closeMonacoBox = () => {
    showMonacoBox.value = false;
    showMonaco.value = false;
};
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
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-color: bisque;
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
        .monaco-editor {
            width: 100%;
            height: 100%;
            padding: 40px 10px;
            text-align: left;
            margin-top: 50px;
            background-color: #fff;
        }
    }
}
</style>
