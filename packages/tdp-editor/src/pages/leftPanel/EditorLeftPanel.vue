<template>
    <div class="tdp-editor-panel-left editor-left-panel">
        <div class="first-menu">
            <ul>
                <li
                    v-for="c in menus"
                    :key="c.key"
                    :class="{ selected: c.selected }"
                    @click="selectFirstMenu(c)"
                    :title="c.title"
                >
                    <i :class="`iconfont ${c.icon}`" />
                </li>
            </ul>
        </div>
        <div class="second-menu">
            <div v-show="menu_pageList.selected" class="pages">
                <h3>
                    {{ pageListChildren.find(c => c.selected === true)?.title }}
                    <div class="pages-action">
                        <PlusCircleFilled @click="addPage" class="selected" />
                        <CopyOutlined
                            :class="{ selected: pageEditMode === 'content' }"
                            @click="setPageEditMode('content')"
                        />
                        <BgColorsOutlined
                            :class="{ selected: pageEditMode === 'css' }"
                            @click="setPageEditMode('css')"
                        />
                        <UsbOutlined
                            :class="{ selected: pageEditMode === 'function' }"
                            @click="setPageEditMode('function')"
                        />
                        <ClusterOutlined
                            :class="{ selected: pageListChildren[1].selected }"
                            @click="showTreeStruct"
                        ></ClusterOutlined>
                    </div>
                </h3>
                <!-- 页面列表 -->
                <ul class="pages-list" v-show="menus[0].list![0].selected">
                    <li
                        v-for="c in pages"
                        :key="c.key"
                        :class="{
                            'li-page': true,
                            selected: c.selected,
                        }"
                        :data-compType="c.type"
                        @click="selectPage(c.key)"
                    >
                        {{ c.label }}
                        <span class="page-action">
                            <edit-outlined />
                            <delete-outlined type="delete" @click="deletePage($event, c.key)" />
                        </span>
                    </li>
                </ul>
                <!-- 大纲 -->
                <ul class="tree-component" v-show="menus[0].list![1].selected">
                    <a-tree
                        class="draggable-tree"
                        :defaultExpandAll="true"
                        showIcon
                        :fieldNames="{
                            key: 'key',
                            title: 'label',
                            children: 'list',
                        }"
                        @select="onTreeSelect"
                        :treeData="__treeData"
                    >
                        <template #title="{ type }">
                            <span>{{ getTreeLabel(type) }}</span>
                        </template>
                        <template #icon="{ type }">
                            <i :class="`iconfont ${getTreeIcon(type)}`"></i>
                        </template>
                    </a-tree>
                </ul>
            </div>
            <!-- 组件列表 -->
            <designer-component-list v-show="menus[1].selected" />
        </div>
        <new-page-modal v-model:visible="showAddPageShadow"></new-page-modal>
    </div>
</template>
<style lang="less">
@import url('../../styles/var/index.less');
.editor-left-panel {
    width: 320px;
    height: 100%;
    flex: 0 0 auto;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    border-right: 1px solid @frame-border-color;
    overflow: hidden;
    transition: all 0.3s;
    &.hide {
        width: 0;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: center;
    }

    .first-menu {
        width: 44px;
        height: 100%;
        border-right: 1px solid @frame-border-color;
        li {
            width: 44px;
            height: 44px;
            line-height: 44px;
            overflow: hidden;
            text-align: center;
            cursor: pointer;
            color: @primary-color;
            i.iconfont {
                font-size: 18px;
            }
        }
        li.selected {
            background-color: @primary-color !important;
            color: #fff !important;
        }
        li:hover {
            background-color: rgba(38, 132, 252, 0.1);
            color: @primary-color;
        }
    }
    .second-menu {
        flex: 1;
        height: 100%;
        overflow-y: auto;
        h3 {
            height: 44px;
            line-height: 44px;
            margin: 0;
            padding: 0 20px;
            text-align: left;
            font-weight: 600;
            color: #000;
            border-bottom: 1px solid #aaa;
            position: relative;
        }
        .ant-collapse-content-box {
            padding: 10px;
        }
        li.li-page {
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            text-align: left;
            padding-left: 20px;
        }
        div.pages {
            .pages-action {
                position: absolute;
                height: 100%;
                width: 200px;
                top: 0;
                right: 0;
                text-align: right;
                padding-right: 10px;
                .anticon {
                    cursor: pointer;
                    font-size: 18px;
                    color: @primary-color;
                    margin-left: 5px;
                    color: #aaa;
                    &.selected {
                        color: @primary-color;
                    }
                }
            }
            li.li-page {
                .page-action {
                    float: right;
                    margin-right: 10px;
                    cursor: pointer;
                    .anticon {
                        margin-left: 4px;
                        color: #000;
                        &:hover {
                            color: @primary-color;
                        }
                    }
                }
                .anticon-exclamation {
                    margin-left: 6px;
                    color: red;
                }
                .anticon-check {
                    margin-left: 6px;
                    color: #49cc90;
                }
            }
            li.selected {
                background-color: #e8e8e8;
                border-left: 3px solid @primary-color;
                color: @primary-color;
            }
        }
        ul.tree-component {
            text-align: left;
            .ant-tree,
            .ant-tree-child-tree {
                text-align: left;
            }
            .iconfont {
                font-size: 22px;
            }
            .ant-tree-title {
                height: 24px;
                line-height: 24px;
            }
        }
    }
}
</style>
<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import type { IMenusStore, TPageEditMode } from 'tdp-editor-types/src/interface/store';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleFilled,
    ClusterOutlined,
    CopyOutlined,
    BgColorsOutlined,
    UsbOutlined,
} from '@ant-design/icons-vue';
import { useEditorControler } from 'tdp-editor-common/src/controller';
import { useLeftMenuStore } from 'tdp-editor-common/src/stores/leftMenuStore';
import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import { useContentStore } from 'tdp-editor-common/src/stores/contentStore';
import DesignerComponentList from './componentList';
import './index.less';
import NewPageModal from './newPageModal.vue';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';

const showAddPageShadow = ref(false);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectComponent = inject('selectComponent', (_key: string) => {});
const menus = computed(() => useLeftMenuStore().menus);
const menu_pageList = computed(() => menus.value[0]);
const pageListChildren = computed(() => menu_pageList.value.list || []);
const pages = computed(() => useContentStore().pages);
const selectedPage = computed(() => useAppStore().activePage);
const pageEditMode = computed(() => useEditorStore().pageEditMode);
const __treeData = computed(() => {
    if (selectedPage.value) {
        return [selectedPage.value];
    } else {
        return [];
    }
});

// 获取组件的icon信息
const getTreeIcon = (type: EnumComponentType) => {
    const componentConfig = useEditorControler().getComponentConfigByType(type);
    if (componentConfig) return componentConfig.icons;
    return '';
};

// 获取组件的label信息
const getTreeLabel = (type: EnumComponentType) => {
    const componentConfig = useEditorControler().getComponentConfigByType(type);
    if (componentConfig) return componentConfig.label;
    return '';
};

// 显示隐藏大纲
const showTreeStruct = () => {
    pageListChildren.value[0].selected = !pageListChildren.value[0].selected;
    pageListChildren.value[1].selected = !pageListChildren.value[1].selected;
};
// 选中一级菜单
const selectFirstMenu = (menu: IMenusStore): void => {
    useLeftMenuStore().setSelectMenu({ menu });
};
// 切换页面
const selectPage = (pageId: string): void => {
    useEditorControler().setActivePage(pageId);
};
// 添加页面
const addPage = (): void => {
    showAddPageShadow.value = true;
};
// 树选中事件
const onTreeSelect = (selectedKeys: string[]) => {
    if (selectComponent) {
        selectComponent(selectedKeys[0]);
    }
};
// 删除页面
const deletePage = (e: any, pageKey: string) => {
    e.stopPropagation();
    const editorController = useEditorControler();
    editorController.deletePage({ pageKey });
};
// 设置页面编辑模式
const setPageEditMode = (_mode: TPageEditMode) => {
    useEditorControler().setActivePageMode(_mode);
};
</script>
