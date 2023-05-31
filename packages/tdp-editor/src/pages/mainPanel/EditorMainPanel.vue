<template>
    <div id="designer-main-panel" class="editor-main-box" @click="handleClick" data-app="true">
        <div
            class="designer-main-action"
            :class="{ preview: appMode !== EnumAppMode.design }"
            id="designer-main-action-box"
        >
            <div class="action-title">{{ selectedComponentLabel }}</div>
            <div class="action-bars">
                <i class="iconfont del" @click="deleteComponent" />
            </div>
        </div>
        <div class="main-panel-container">
            <template v-if="selectedPage && activePageMode === 'content'">
                <page-content-designer
                    :selectedPage="selectedPage"
                    :appMode="appMode"
                ></page-content-designer>
            </template>
            <template v-if="selectedPage && activePageMode === 'css'">
                <page-css-designer
                    :selectedPage="selectedPage"
                    :appMode="appMode"
                ></page-css-designer>
            </template>
            <template v-if="selectedPage && activePageMode === 'function'">
                <page-function-designer
                    :selectedPage="selectedPage"
                    :appMode="appMode"
                ></page-function-designer>
            </template>
        </div>
    </div>
</template>
<style lang="less">
@import url('../../styles/var/index.less');
.editor-main-box {
    position: relative;
    height: 100%;
    flex: 1;
    overflow-x: hidden;
    #designer-main-action-box {
        position: absolute;
        display: none;
        z-index: 1;
        transition: all 0.3s;
        width: 30px;
        height: 20px;
        overflow: hidden;
        .action-title {
            float: left;
            background-color: @primary-color;
            color: #fff;
            padding: 0 10px;
            opacity: 0.8;
        }
        .action-bars {
            float: right;
            height: 100%;
            background-color: azure;
            i.iconfont {
                font-size: 14px;
                z-index: 100;
                color: @primary-color;
                float: right;
                cursor: pointer;
            }
        }
        &.preview {
            display: none !important;
        }
    }
    .main-panel-container {
        height: 100%;
        position: relative;
        padding: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        .editor-designer-comp {
            position: relative;
            border: 1px dashed #c8c8c8;
            touch-action: none;
            user-select: none;
            transition-duration: 0ms;
            transition-delay: 0ms;
            &.active {
                opacity: 0.6;
            }
            &.target {
                border-top: 2px solid @primary-7;
            }
            &:hover {
                border-color: @primary-color;
            }
        }
        // 容器组件
        .editor-designer-box {
            padding-bottom: 20px;
            &.target {
                opacity: 0.8;
                background-color: @primary-color;
            }
        }
        /* 选中的组件 */
        .editor-designer-component-ck {
            border: 1px solid @primary-color !important;
            > .fd-layout.editor-designer-comp {
                border: 0;
            }
        }
        .editor-designer-component-ck.editor-designer-comp {
            border: 0;
        }

        .sortable-chosen.sortable-ghost {
            border-top: 2px solid @primary-color !important;
        }
    }
}
</style>
<script setup lang="ts">
import { inject, onMounted, getCurrentInstance, provide, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumAppMode } from 'tdp-editor-types/src/enum';
import { utils } from 'tdp-editor-common/src';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import { useEditorControler } from 'tdp-editor-common/src/controller';
import { $log } from 'tdp-editor-common/src/utils';
import PageContentDesigner from './PageContentDesigner.vue';
import PageCssDesigner from './PageCssDesigner.vue';
import PageFunctionDesigner from './PageFunctionDesigner.vue';

const appStore = useAppStore();
const editorStore = useEditorStore();
const setIndexRefs = inject('setRefs', (key: string, comInstance: ComponentPublicInstance) =>
    $log('setRefs', key, comInstance)
);
const selectedComponentLabel = computed(() => {
    if (editorStore.selectedComponent) {
        return useEditorControler().getComponentConfigByType(editorStore.selectedComponent.type)
            ?.label;
    }
    return '';
});
const appMode = computed(() => appStore.mode);
const selectedPage = computed(() => appStore.activePage);
const activePageMode = computed(() => editorStore.pageEditMode);
// const dragContainerClassName = 'main-panel-container';
// let dragComponent: IDesignerComponent | undefined = undefined;
// 用户选中的组件
let selectedTargetHtmlElement: HTMLElement | null = null;
// 组件操作区
let actionBox: HTMLElement | null = null;
provide('getAppMode', () => {
    return appMode;
});
provide('dragAddComponent', (component: IDesignerComponent, parent: IDesignerComponent) => {
    useEditorStore().dragAddComponent({
        component,
        parent,
    });
});
onMounted(() => {
    const instance = getCurrentInstance();
    if (instance) {
        setIndexRefs('designerMain', instance.proxy!);
    }
    actionBox = document.getElementById('designer-main-action-box');
});
// 组件选中代理事件
const handleClick = (e: any): void => {
    if (appMode.value !== EnumAppMode.design) return;
    const _targetNode = getTargetNode(e.target);
    if (_targetNode) {
        const dataset = _targetNode.dataset;
        // 如果触发元素是组件
        if (dataset.id) {
            if (selectedTargetHtmlElement) {
                selectedTargetHtmlElement.classList.remove('editor-designer-component-ck');
            }
            const componentElement = document.getElementById(dataset.id);
            if (!componentElement) return;
            selectedTargetHtmlElement = componentElement;
            setTargetAction();
            const currentComponent: IDesignerComponent[] =
                utils.$findTreeItem([selectedPage.value], dataset.id) || [];
            if (currentComponent && currentComponent.length > 0) {
                // 如果选中了组件，设置vuex的选中组件，并添加样式
                useEditorStore().setSelectedComponent({
                    component: currentComponent[0],
                });
            } else {
                unselect();
            }
        } else if (dataset.type === EnumComponentType.page) {
            $log('page');
        } else {
            unselect();
        }
    } else {
        unselect();
    }
};
const getTargetNode = (target?: any): HTMLElement | undefined => {
    if (!target) return undefined;
    if (target.dataset && target.dataset.id) {
        return target;
    } else {
        return getTargetNode(target.parentNode);
    }
};
//设置组件操作区域显示
const setTargetAction = () => {
    if (selectedTargetHtmlElement && actionBox) {
        // 单独处理页面
        if (selectedTargetHtmlElement.dataset.type === EnumComponentType.page) {
            actionBox.style.display = 'none';
            return;
        }
        selectedTargetHtmlElement.classList.add('editor-designer-component-ck');
        const targetWidth = selectedTargetHtmlElement.offsetWidth;
        // const targetHeight = this.selectedTargetHtmlElement.offsetHeight;
        const container = document.getElementById('designer-main-panel')!;
        const containerRect = container.getBoundingClientRect();
        const offsetLeft = containerRect.left; // 设计窗口的偏移量
        const offsetTop = containerRect.top - container.scrollTop;

        const rect = selectedTargetHtmlElement.getBoundingClientRect();
        const boxTop = rect.top - offsetTop;
        const boxLeft = rect.left - offsetLeft;
        // this.actionBox.style.top = boxTop + targetHeight + 'px';
        actionBox.style.top = boxTop + 'px';
        actionBox.style.left = boxLeft + 'px';
        actionBox.style.width = targetWidth + 'px';
        actionBox.style.display = 'block';
    }
};
// 取消选中组件
const unselect = () => {
    if (actionBox) {
        actionBox.style.display = 'none';
    }
    if (selectedTargetHtmlElement) {
        selectedTargetHtmlElement.classList.remove('editor-designer-component-ck');
    }
    selectedTargetHtmlElement = null;
    useEditorStore().setSelectedComponent({
        component: undefined,
    });
};
// 删除所选组件
const deleteComponent = () => {
    if (selectedTargetHtmlElement && actionBox) {
        const id = selectedTargetHtmlElement.dataset.id || '';
        actionBox.style.display = 'none';
        selectedTargetHtmlElement = null;
        useEditorControler().deleteComponent({ id });
    }
};
</script>
