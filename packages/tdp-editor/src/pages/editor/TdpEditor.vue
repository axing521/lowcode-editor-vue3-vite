<template>
    <div
        :class="{
            'tdp-editor-container': true,
            preview: editorMode === EnumAppMode.preview,
        }"
    >
        <div class="tdp-editor-toolbar">
            <div class="toolbar-left">
                <ExportOutlined title="导出" @click="exportJson" />
                <a-upload
                    name="file"
                    action="/import/config"
                    accept=".json"
                    :showUploadList="false"
                    @change="importJson"
                >
                    <ImportOutlined title="导入" />
                </a-upload>
                <SaveOutlined title="保存" />
            </div>
            <div class="toolbar-right">
                <a-button type="primary" @click="pagePreview">
                    <i class="iconfont Preview" />
                    预览
                </a-button>
                <a-switch
                    class="switch-designer"
                    checkedChildren="设计"
                    unCheckedChildren="预览"
                    v-model:checked="computed_editorDesignMode"
                />
            </div>
        </div>
        <div class="tdp-editor-main">
            <DesignerLeft :class="{ 'tdp-editor-panel-left': true, hide: !showLeft }" />
            <DesignerMain class="tdp-editor-panel-main" ref="designerMain" />
            <DesignerRight
                :class="{ 'tdp-editor-panel-right': true, hide: !showRight }"
                ref="designerRight"
            />
        </div>
        <a-modal
            dialogClass="preview-dialog"
            v-model="showPreviewModal"
            :afterClose="previewDialogClosed"
            :footer="null"
        >
            <Preview :json="selectedPage!" :appMode="EnumAppMode.preview"></Preview>
        </a-modal>
    </div>
</template>
<style lang="less" scoped>
@blueColor: #1890ff;
.preview-dialog {
    width: 96% !important;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

div.tdp-editor-container {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    &.preview {
        :deep(#editor-main-action-box) {
            display: none !important;
        }
        :deep(.editor-designer-component-ck) {
            border: none !important;
        }
    }
    .tdp-editor-toolbar {
        flex: 0 0 auto;
        height: 44px;
        line-height: 44px;
        display: flex;
        flex-flow: row nowrap;
        background-color: #fff;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        .toolbar-left {
            padding-left: 20px;
            height: 100%;
            .anticon {
                font-size: 20px;
                margin-right: 20px;
                cursor: pointer;
            }
            i.left {
                line-height: 44px;
                display: inline-block;
                &.show {
                    color: @blueColor;
                }
            }
            i.right {
                line-height: 30px;
                display: inline-block;
                transform: rotate(180deg);
                margin-bottom: 4px;
                // margin-top: -4px;
                &.show {
                    color: @blueColor;
                }
            }
        }
        .toolbar-right {
            i.iconfont.Preview {
                font-weight: 400;
                font-size: 14px;
                line-height: 1;
                margin-right: 2px;
            }
            .ant-btn {
                margin-right: 10px;
            }
        }
        .switch-designer {
            margin-right: 10px;
        }
    }

    div.tdp-editor-main {
        position: relative;
        width: 100%;
        // height: 100%;
        flex: 1;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: flex-start;
        border-top: 1px solid #bdbdbd;
        overflow: hidden;
    }
}

.preview-dialog {
    .ant-modal-content {
        margin-top: 10px;
        height: 100%;
        overflow: auto;
    }
}
</style>
<script lang="ts" setup>
import { onMounted, provide, ref, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import fileSaver from 'file-saver';
import { useEditorStore } from 'tdp-editor-utils/stores/editorStore';
import { useAppStore } from 'tdp-editor-utils/stores/appStore';
import { ImportOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons-vue';

import { EnumAppMode } from 'tdp-editor-types/enum';

import DesignerLeft from '../leftPanel';
import DesignerRight from '../rightPanel';
import DesignerMain from '../mainPanel';
import Preview from 'tdp-editor-components/src/page.vue';

// import type FdComponent from 'tdp-editor-components/src/component';

const appStore = useAppStore();
const editorStore = useEditorStore();

const showPreviewModal = ref(false); // 是否显示预览弹窗
/* eslint-disable-next-line */
// const components = ref(new Map() as Map<string, FdComponent>); // 当前页面所有组件的实例集合
const showRight = ref(true); // 是否显示右侧面板
const showLeft = ref(true); // 是否显示左侧面板
const thisRefs = {} as any;

onMounted(() => {
    appStore.setMode(EnumAppMode.design);
    editorStore.initDesignerPage();
    // const instance = getCurrentInstance();
    // const comList = instance?.appContext.app.config.globalProperties || [];
});

// 编辑器的所有页面
const pages = appStore.pages;
// 编辑器当前选中的页面
const selectedPage = appStore.activePage;
console.log('selectedPage', selectedPage);
// 编辑器模式，预览 | 设计 | 浏览
const editorMode = appStore.mode;

// 预览switch按钮绑定值
const computed_editorDesignMode = computed({
    get(): boolean {
        return appStore.mode === EnumAppMode.design;
    },
    set(isDesignMode: boolean) {
        if (isDesignMode) {
            appStore.mode = EnumAppMode.design;
            showRight.value = showLeft.value = true;
        } else {
            appStore.mode = EnumAppMode.preview;
            showLeft.value = showRight.value = false;
        }
    },
});

// 导出editor内容的json
const exportJson = () => {
    const jsonString = JSON.stringify(pages);
    const blob = new Blob([jsonString], { type: '' });
    fileSaver.saveAs(blob, 'form.json');
};
// 导入json数据
const importJson = (info: any) => {
    const file = info.file || {};
    const response = file.response || {};
    if (file.status === 'done' && file.response.success) {
        const pages = response.data || [];
        editorStore.importConfig({ pages: pages });
    }
};

// 页面预览
const pagePreview = () => {
    appStore.setMode(EnumAppMode.preview);
    showPreviewModal.value = !showPreviewModal.value;
};

// 预览弹窗关闭后事件
const previewDialogClosed = () => {
    appStore.setMode(EnumAppMode.design);
};

const selectComponent = (componentKey: string) => {
    const compElement = document.getElementById(componentKey);
    const mainRef = thisRefs['designerMain'] as typeof DesignerMain;
    if (compElement && mainRef) {
        mainRef.handleClick({ target: compElement });
    }
};
const unselectComponent = () => {
    const mainRef = thisRefs['designerMain'] as typeof DesignerMain;
    if (mainRef) {
        mainRef.unselect();
    }
};
const setRefs = (key: string, value: ComponentPublicInstance) => {
    thisRefs[key] = value;
};

provide('selectComponent', selectComponent);
provide('unselectComponent', unselectComponent);
provide('setRefs', setRefs);
</script>
