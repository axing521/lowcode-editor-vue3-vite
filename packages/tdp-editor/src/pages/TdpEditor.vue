<template>
    <div
        :class="{
            'tdp-editor-container': true,
            preview: editorMode === EnumAppMode.preview,
        }"
    >
        <div class="tdp-editor-toolbar">
            <div class="toolbar-left">
                <AddVarModal
                    v-model:visible="addVarModalVisible"
                    :scope="addVarScope"
                ></AddVarModal>
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
                <a-button
                    type="primary"
                    @click="
                        addVarScope = EnumAppVarScope.Global;
                        addVarModalVisible = true;
                    "
                    >添加全局变量</a-button
                >&nbsp;
                <a-button
                    type="primary"
                    @click="
                        addVarScope = EnumAppVarScope.Page;
                        addVarModalVisible = true;
                    "
                    >添加页面变量</a-button
                >
            </div>
            <div class="toolbar-right">
                <a-button type="primary" @click="pagePreview">
                    <i class="iconfont Preview" />
                    运行
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
            <editor-left-panel :class="{ 'tdp-editor-panel-left': true, hide: !showLeft }" />
            <editor-main-panel class="tdp-editor-panel-main" ref="designerMain" />
            <DesignerRight
                :class="{ 'tdp-editor-panel-right': true, hide: !showRight }"
                ref="designerRight"
            />
        </div>
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
import interact from 'interactjs';

// monaco配置
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import { useContentStore } from 'tdp-editor-common/src/stores/contentStore';
import {
    useAppControler,
    useEditorControler,
    usePageControler,
} from 'tdp-editor-common/src/controller';
import { ImportOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { EnumAppMode } from 'tdp-editor-types/src/enum';
import { EnumAppVarScope } from 'tdp-editor-types/src/enum/app/vars';
import { $log } from 'tdp-editor-common/src/utils';

import EditorLeftPanel from './leftPanel/EditorLeftPanel.vue';
import DesignerRight from './rightPanel';
import EditorMainPanel from './mainPanel/EditorMainPanel.vue';
import AddVarModal from '../components/AddVar.vue';

(window as any).MonacoEnvironment = {
    getWorker(_: any, label: any) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

const appController = useAppControler();
const pageControler = usePageControler();
const editorController = useEditorControler();
const appStore = useAppStore();
const contentStore = useContentStore();
const showRight = ref(true); // 是否显示右侧面板
const showLeft = ref(true); // 是否显示左侧面板
const thisRefs = {} as any;

onMounted(async () => {
    // editorStore.initDesignerPage();
    await editorController.initEditorAsync();
    handleDrag();
});

const handleDrag = () => {
    // 左侧菜单拖动时clone的html元素
    const cloneElement = {
        dx: 0,
        dy: 0,
        element: null as HTMLElement | null,
    };
    // 内容区被拖拽的对象
    const contentDragElement = {
        dx: 0,
        dy: 0,
        element: null as HTMLElement | null,
    };

    // 拖拽目标
    const dropTargetElement = {
        element: null as HTMLElement | null,
    };

    const getElementComp = (element: HTMLElement) => {
        if (element && element.id) {
            return pageControler.getComponentByKey(element.id);
        } else {
            return undefined;
        }
    };

    const cloneElementReset = () => {
        if (cloneElement.element) {
            cloneElement.element.classList.remove('active');
        }
        cloneElement.element = null;
        cloneElement.dx = 0;
        cloneElement.dy = 0;
    };

    const contentDragElementReset = () => {
        if (contentDragElement.element) {
            contentDragElement.element.classList.remove('active');
            contentDragElement.element.style.transform = '';
        }
        contentDragElement.element = null;
        contentDragElement.dx = 0;
        contentDragElement.dy = 0;
    };

    const dropTargetElementReset = () => {
        if (dropTargetElement.element) {
            dropTargetElement.element.classList.remove('target');
        }
        dropTargetElement.element = null;
    };

    // 左侧组件列表
    const leftComps = interact('.li-component');
    leftComps.draggable({
        onstart(e) {
            e.preventDefault();
            e.stopPropagation();
            $log('左侧组件列表开始拖拽', e);
            cloneElement.element = e.target as HTMLElement;
        },
        onend() {
            cloneElementReset();
        },
    });
    // 内容区中的组件
    const contentComps = interact('.editor-designer-comp');
    contentComps.draggable({
        onstart(e) {
            e.preventDefault();
            e.stopPropagation();
            $log('内容设计器开始拖拽组件', e);
            const dragedElement = e.target as HTMLElement;
            if (dragedElement) {
                contentDragElement.element = dragedElement;
                contentDragElement.element.classList.add('active');
            }
        },
        onmove(e) {
            e.preventDefault();
            e.stopPropagation();
            const dragedElement = e.target as HTMLElement;
            if (dragedElement) {
                contentDragElement.dx += e.dx;
                contentDragElement.dy += e.dy;

                dragedElement.style.transform = `translate3d(${contentDragElement.dx}px, ${contentDragElement.dy}px, 20px)`;
            }
        },
        autoScroll: true,
    });

    // 容器组件
    const drops = interact('.editor-designer-comp');
    drops.dropzone({
        accept: '.editor-designer-comp, .li-component',
        overlap: 0.5,
        ondrop(e) {
            $log('[ drops dropzone ] ondrop', e);
            // 被拖入的元素
            // const dragedElement = e.relatedTarget as HTMLElement;
            // 拖入的目标元素
            dropTargetElement.element = e.target as HTMLElement;
            const targetComp = getElementComp(dropTargetElement.element);
            // 设计区域内拖拽
            if (contentDragElement.element) {
                const dragedComp = getElementComp(contentDragElement.element);
                if (targetComp && dragedComp) {
                    // 同级元素排序
                    if (!targetComp.state.box && targetComp.parentId === dragedComp.parentId) {
                        $log('同级元素排序');
                    }
                    // 跨级排序
                    else if (!targetComp.state.box && targetComp.parentId !== dragedComp.parentId) {
                        $log('跨级排序');
                    }
                    // 跨级添加
                    else if (targetComp.state.box && targetComp.state.key !== dragedComp.parentId) {
                        $log('跨级添加');
                    }
                    // 同级没有变
                    else if (targetComp.state.box && targetComp.state.key === dragedComp.parentId) {
                        $log('不需要变更');
                    }
                }
            }
            // 左侧组件列表拖拽
            else if (cloneElement.element) {
                $log('新来组件了');
            }

            dropTargetElementReset();
            contentDragElementReset();
            cloneElementReset();

            e.preventDefault();
            e.stopPropagation();
        },
        ondragenter(e) {
            $log('[ drops dropzone ] ondragenter', e);
            // 被拖入的元素
            // const dragedElement = e.relatedTarget as HTMLElement;
            // 拖入的目标元素
            dropTargetElement.element = e.target as HTMLElement;
            if (dropTargetElement.element) {
                dropTargetElement.element.classList.add('target');
            }
        },
        ondragleave(e) {
            $log('[ drops dropzone ] ondragleave', e);
            // 被拖出的元素
            // const dragedElement = e.relatedTarget as HTMLElement;
            // 拖出的目标元素
            dropTargetElement.element = e.target as HTMLElement;
            if (dropTargetElement.element) {
                dropTargetElement.element.classList.remove('target');
            }
        },
        ondropmove(e) {
            $log('[ drops dropzone ] ondropmove', e);
        },
    });
};

// 编辑器的所有页面
const pages = contentStore.pages;
// 编辑器模式，预览 | 设计 | 浏览
const editorMode = appStore.mode;

// 预览switch按钮绑定值
const computed_editorDesignMode = computed({
    get(): boolean {
        return appStore.mode === EnumAppMode.design;
    },
    set(isDesignMode: boolean) {
        if (isDesignMode) {
            appController.setMode(EnumAppMode.design);
            showRight.value = showLeft.value = true;
        } else {
            appController.setMode(EnumAppMode.preview);
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
        editorController.importConfig({ pages: pages });
    }
};

// 页面预览
const pagePreview = () => {
    // 1.保存本地数据
    editorController.saveLocalData();
    // 2.打开预览地址
    const url = editorController.getPreviewUrl(appController.getEnv());
    window.open(url, '_blank');
};

const selectComponent = (componentKey: string) => {
    const compElement = document.getElementById(componentKey);
    const mainRef = thisRefs['designerMain'] as typeof EditorMainPanel;
    if (compElement && mainRef) {
        mainRef.handleClick({ target: compElement });
    }
};
const unselectComponent = () => {
    const mainRef = thisRefs['designerMain'] as typeof EditorMainPanel;
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

const addVarModalVisible = ref(false);
const addVarScope = ref(EnumAppVarScope.Global);
</script>
