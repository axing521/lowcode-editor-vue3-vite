import type { VNode } from 'vue';
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import type { IMenusStore, IPageStore } from 'tdp-editor-types/interface/store';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import {
    OrderedListOutlined,
    EditOutlined,
    DeleteOutlined,
    FormOutlined,
    PlusCircleFilled,
    ClusterOutlined,
} from '@ant-design/icons-vue';
import classnames from 'classnames';
import { useEditorControler } from 'tdp-editor-utils/controller';
import { useEditorStore } from 'tdp-editor-utils/stores/editorStore';
import { useLeftMenuStore } from 'tdp-editor-utils/stores/leftMenuStore';
import { useAppStore } from 'tdp-editor-utils/stores/appStore';
import DesignerComponentList from './componentList';
import './index.less';
import NewPageModal from './newPageModal.vue';

export default defineComponent({
    name: 'editor-left-panel',
    components: {
        DesignerComponentList,
        OrderedListOutlined,
        EditOutlined,
        DeleteOutlined,
        FormOutlined,
        PlusCircleFilled,
        ClusterOutlined,
        NewPageModal,
    },
    inject: ['selectComponent'],
    computed: {
        ...mapState(useEditorStore, {
            selectedComponent: 'selectedComponent',
        }),
        ...mapState(useLeftMenuStore, {
            menus: 'menus',
        }),
        ...mapState(useAppStore, {
            pages: 'pages',
            selectedPage: 'activePage',
        }),
        __treeData(): any[] {
            if (this.selectedPage) {
                return [this.selectedPage];
            } else {
                return [];
            }
        },
    },
    data() {
        return {
            showAddPageShadow: false,
        };
    },
    methods: {
        renderMenus(): VNode[] {
            const MENUS = this.menus;
            const menu_pageList = MENUS[0]; // 表单列表菜单项
            const pageListChildren = menu_pageList.list || []; // 表单列表菜单的所有子菜单
            const firstMenu = (
                <div class="first-menu">
                    <ul>
                        {MENUS.map(c => {
                            return (
                                <li
                                    class={classnames({ selected: c.selected })}
                                    key={c.key}
                                    onClick={() => this.selectFirstMenu(c)}
                                    title={c.title}
                                >
                                    <i class={`iconfont ${c.icon}`} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
            const secondMenu = (
                <div class="second-menu">
                    {/* 页面列表 */}
                    <div
                        style={{
                            display: menu_pageList.selected === true ? 'block' : 'none',
                        }}
                        class="pages"
                    >
                        <h3>
                            {pageListChildren.find(c => c.selected === true)?.title}
                            <div class="pages-action">
                                <PlusCircleFilled onClick={this.addPage} />
                                <ClusterOutlined
                                    class={classnames('icon_40tree', {
                                        selected: pageListChildren[1].selected,
                                    })}
                                    onClick={() => {
                                        pageListChildren[0].selected =
                                            !pageListChildren[0].selected;
                                        pageListChildren[1].selected =
                                            !pageListChildren[1].selected;
                                    }}
                                ></ClusterOutlined>
                            </div>
                        </h3>
                        <ul
                            class="pages-list"
                            style={{
                                display: MENUS[0].list![0].selected === true ? 'block' : 'none',
                            }}
                        >
                            {(this.pages as IPageStore[]).map(c => {
                                return (
                                    <li
                                        class={classnames({
                                            'li-page': true,
                                            selected: c.selected,
                                        })}
                                        data-compType={c.type}
                                        key={c.key}
                                        onClick={() => this.selectPage(c.key)}
                                    >
                                        {c.label}
                                        <span class="page-action">
                                            <edit-outlined />
                                            <delete-outlined
                                                type="delete"
                                                onClick={(e: any) => this.deletePage(e, c.key)}
                                            />
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <ul
                            class="tree-component"
                            style={{
                                display: MENUS[0].list![1].selected === true ? 'block' : 'none',
                            }}
                        >
                            <a-tree
                                class="draggable-tree"
                                defaultExpandAll={true}
                                showIcon
                                fieldNames={{
                                    key: 'key',
                                    title: 'label',
                                    children: 'list',
                                }}
                                // onDragenter={this.onTreeDragEnter}
                                // onDrop={this.onTreeDrop}
                                onSelect={this.onTreeSelect}
                                treeData={this.__treeData}
                                v-slots={{
                                    title: this.treeSlots_title,
                                    icon: this.treeSlots_icon,
                                }}
                            ></a-tree>
                        </ul>
                    </div>
                    <designer-component-list
                        style={{
                            display: MENUS[1].selected === true ? 'block' : 'none',
                        }}
                    />
                </div>
            );
            return [firstMenu, secondMenu];
        },
        treeSlots_title(node: IDesignerComponent) {
            const title = node.label;
            return <span title={title}>{title}</span>;
        },
        treeSlots_icon(node: IDesignerComponent) {
            const icon = node.icons || '';
            return <i class={`iconfont ${icon}`}></i>;
        },
        selectFirstMenu(menu: IMenusStore): void {
            useLeftMenuStore().setSelectMenu({ menu });
        },
        selectPage(pageId: string): void {
            const appStore = useAppStore();
            appStore.setActivePage({ pageId });
        },
        addPage(): void {
            this.showAddPageShadow = true;
        },
        onTreeSelect(selectedKeys: string[]) {
            // @ts-ignore
            if (this.selectComponent) {
                // @ts-ignore
                this.selectComponent(selectedKeys[0]);
            }
        },
        deletePage(e: any, pageKey: string) {
            e.stopPropagation();
            const editorController = useEditorControler();
            editorController.deletePage({ pageKey });
        },
    },
    render(): VNode {
        return (
            <div class="tdp-editor-panel-left editor-left-panel">
                {this.renderMenus()}
                <new-page-modal v-model:visible={this.showAddPageShadow}></new-page-modal>
            </div>
        );
    },
});
