import { defineStore } from 'pinia';
import {
    EnumComponentType,
    EnumComponentGroup,
    EnumPropsValueType,
} from 'tdp-editor-types/enum/components';

import type { IPageForm } from 'tdp-editor-types/interface/designer/pageForm';
import type { IPageStoreState } from 'tdp-editor-types/interface/designer';
import type { IDesignerComponent, IEditorStoreState } from 'tdp-editor-types/interface/designer';

import { utils } from 'tdp-editor-utils';
import { apps, forms } from 'tdp-editor-utils/service';
import { EnumServiceResultStatus } from 'tdp-editor-types/enum/request';

export const useEditorStore = defineStore('editorStore', {
    state: (): IEditorStoreState => {
        return {
            menus: [],
            pages: [],
            pageForms: new Map(),
            selectedPage: undefined,
            selectedComponent: undefined,
            componentList: [],
        };
    },
    getters: {
        pagesGetter: state => state.pages || [],
        componentListGetter: state => state.componentList || [],
        selectedPageGetter: state => state.selectedPage,
        selectedComponentGetter: state => state.selectedComponent,
        dragComponentGetter: state => state.dragComponent,
        pageFormsGetter: state => state.pageForms,
        pageForm: state => (key: string) => state.pageForms.get(key),
    },
    actions: {
        // 导入配置文件
        importConfig(payload: { pages: IPageStoreState[] }) {
            this.pages = payload.pages;
            if (this.pages && this.pages.length) {
                this.selectedPage = this.pages[0];
            }
        },
        // 初始化editor的组件列表
        initComponentList(payload: { list: IDesignerComponent[] }) {
            this.componentList = payload.list;
        },
        // 追加一批组件
        addComponents(payload: { list: IDesignerComponent[] }) {
            payload.list.forEach(l => {
                if (!this.componentList.some(c => c.type === l.type)) {
                    this.componentList.push(l);
                }
            });
        },
        // 添加页面
        addPage(payload?: { page?: IPageStoreState }) {
            const newPage = getDefaultPageModule(this.$state);
            if (payload && payload.page) {
                const _page = { ...newPage, ...payload.page };
                this.pages.push(_page);
            } else {
                const newPage = getDefaultPageModule(this.$state);
                this.pages.push(newPage);
            }
        },
        // 删除页面
        deletePage(payload: { pageKey: string }) {
            const index = this.pages.findIndex(p => p.key === payload.pageKey);
            console.log('pagekey', payload.pageKey, index);
            if (index > -1) {
                this.pages.splice(index, 1);
            }
        },
        initAppPages(payload: { pages: IPageStoreState[] }) {
            this.pages = payload.pages;
            if (payload.pages.length) {
                this.selectedPage = payload.pages[0];
            }
        },
        // 初始化编辑器页面
        initDesignerPage() {
            const newPage = getDefaultPageModule(this.$state);
            newPage.selected = true;
            this.pages.push(newPage);
            this.selectedPage = newPage;
        },
        // 切换所选页面
        setSelectPage(payload: { pageId: string }) {
            this.pages.forEach(page => {
                page.selected = page.key === payload.pageId;
                if (page.key === payload.pageId) {
                    this.selectedPage = page;
                }
            });
        },
        // 设计面板拖入组件
        dragAddComponent(payload: { parent: IDesignerComponent; component: IDesignerComponent }) {
            if (payload.parent) {
                this.selectedComponent = payload.component;
            }
        },
        // 双击添加组件
        doubleAddComponent(payload: { parent: IDesignerComponent; component: IDesignerComponent }) {
            if (payload.parent && payload.component) {
                // 父组件是页面，并且要添加的组件是容器组件时，才可以正常添加
                if (
                    payload.parent.type === EnumComponentType.page &&
                    payload.component.group === EnumComponentGroup.layout
                ) {
                    payload.parent.list?.push(payload.component);
                }
                // 不是页面时，需要父组件是容器组件才能添加
                else if (
                    payload.parent.type !== EnumComponentType.page &&
                    [
                        EnumComponentType.layout,
                        EnumComponentType.form,
                        EnumComponentType.row,
                        EnumComponentType.col,
                    ].some(type => type === payload.parent.type)
                ) {
                    payload.parent.list?.push(payload.component);
                    // state.selectedComponent = payload.component;
                }
            }
        },
        // 设置选中的拖动组件
        setDragComponent(payload: { component: IDesignerComponent }) {
            this.dragComponent = payload.component;
        },
        // 设置当前选中的组件
        setSelectedComponent(payload: { component: IDesignerComponent | undefined }) {
            this.selectedComponent = payload.component;
        },
        // 删除选中的组件
        deleteComponent(payload: { id: string }) {
            const componentId = payload.id;
            if (this.selectedPage && this.selectedPage.list) {
                // 从当前页面组件列表中查找要删除的组件
                utils.$deleteTreeItem(this.selectedPage.list, componentId);
                this.selectedComponent = undefined;
            }
        },
        // 导入csv文件的组件
        importCsvData(payload: { pageName: string; pageCode: string; data: any }) {
            const newPage = {
                ...getDefaultPageModule(this.$state),
                ...{ label: payload.pageName, code: payload.pageCode },
            };
            const rowState = this.componentList.find(c => c.type === EnumComponentType.row);
            if (rowState) {
                // 创建行
                const rowKey = utils.$getUUID(EnumComponentType.row);
                const newRow: IDesignerComponent = {
                    key: rowKey,
                    code: '',
                    label: rowState.label,
                    icon: rowState.icon,
                    group: rowState.group,
                    type: rowState.type,
                    list: [],
                };
                for (const k in payload.data) {
                    const type = payload.data[k];
                    const component = this.componentList.find(c => c.type === type);
                    if (component) {
                        newRow.list!.push({
                            key: utils.$getUUID(component.type),
                            code: '',
                            group: component.group,
                            type: component.type,
                            label: component.label,
                            icon: component.icon,
                            props: {
                                label: k,
                                dense: true,
                            },
                        } as any);
                    }
                }
                if (newPage.list && newPage.list.length) {
                    newPage.list[0].list!.push(newRow);
                    this.pages.push(newPage);
                    return newPage.key;
                }
            }
            return '';
        },
        // 给pageForm赋值
        setPageForm(payload: { pageForm: IPageForm }) {
            if (this.pageForms.has(payload.pageForm.key)) {
                const oldPageForm = this.pageForms.get(payload.pageForm.key)!;
                oldPageForm.column = payload.pageForm.column;
                oldPageForm.formId = payload.pageForm.formId;
            } else {
                this.pageForms.set(payload.pageForm.key, payload.pageForm);
            }
        },
        // 导入csv文件数据
        importCsvDataAsync(payload: { pageName: string; pageCode: string; data: any }) {
            this.importCsvData(payload);
            this.setSelectPage({
                pageId: this.pages[this.pages.length - 1].key,
            });
        },
        // 保存页面json数据
        async savePage(payload: { appId: string; projectId: string; app: any }) {
            return apps.appService.updateApp(payload.appId, payload.projectId, payload.app);
        },
        // 保存form数据结构
        async saveForm(payload: { form: any }) {
            return forms.formService.addForm(payload.form);
        },
        async save(payload: { appId: string; projectId: string; app: any; form: any }) {
            return new Promise((ok, fail) => {
                Promise.all([
                    this.savePage({
                        appId: payload.appId,
                        projectId: payload.projectId,
                        app: payload.app,
                    }),
                    this.saveForm({ form: payload.form }),
                ])
                    .then(resAll => {
                        if (
                            resAll.length === 2 &&
                            resAll[0].status === EnumServiceResultStatus.success &&
                            resAll[1].status === EnumServiceResultStatus.success
                        ) {
                            ok('');
                        } else {
                            fail('save fail');
                        }
                    })
                    .catch(() => {
                        fail('save fail');
                    });
            });
        },
    },
});

// 生成一个默认的page配置
const getDefaultPageModule = (state: IEditorStoreState): IPageStoreState => {
    const newPage: IPageStoreState = {
        key: utils.$getUUID(EnumComponentType.page),
        code: '',
        label: '表单' + (state.pages.length + 1),
        icon: 'flex',
        type: EnumComponentType.page,
        group: EnumComponentGroup.page,
        selected: false,
        submitState: 'unsaved',
        props: {
            pageData: {
                type: EnumPropsValueType.object,
                value: {
                    text: 'testExpression',
                },
            },
            pageMethods: {
                type: EnumPropsValueType.object,
                value: {
                    setText: `this.pageData.text = new Date().toLocaleTimeString();`,
                },
            },
        },
        list: [],
    };
    // const formState = state.componentList.find(c => c.type === EnumComponentType.form);
    // if (formState) {
    //     const formKey = utils.$getUUID(EnumComponentType.form);
    //     const newForm: IDesignerComponent = {
    //         key: formKey,
    //         code: '',
    //         label: formState.label,
    //         icon: formState.icon,
    //         group: formState.group,
    //         type: formState.type,
    //         list: [],
    //     };
    //     newPage.list!.push(newForm);
    // }
    const layoutState = state.componentList.find(c => c.type === EnumComponentType.layout);
    if (layoutState) {
        const Key = utils.$getUUID(EnumComponentType.layout);
        const newForm: IDesignerComponent = {
            key: Key,
            code: '',
            label: layoutState.label,
            icon: layoutState.icon,
            group: layoutState.group,
            type: layoutState.type,
            list: [],
        };
        newPage.list!.push(newForm);
    }
    return newPage;
};
