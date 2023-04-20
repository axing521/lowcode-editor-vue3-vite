/**
 * EditorController 封装editor的逻辑
 * 需要同时访问editorStore和appStore的较复杂的逻辑方法放到此类中
 */
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { IAppSaveStruct } from 'tdp-editor-types/src/interface/app';
import type { IPageStore, TPageEditMode } from 'tdp-editor-types/src/interface/store';

import { toRaw } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { useEditorStore } from '../stores/editorStore';
import { useAppStore } from '../stores/appStore';
import { EnumAppEnv } from 'tdp-editor-types/src/enum';
import { openDBAsync, setDataAsync, getDataAsync } from '../indexDBUtil';
import { utils } from '../index';
import { useVarControler } from './index';
import { $warn } from '../utils';

export default class EditorController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }
    /**
     * 添加自定义组件
     * @param list 要添加的自定义组件列表
     */
    addCustomerComponents(list: IDesignerComponent[]) {
        const $editorStore = useEditorStore(this.$pinia);
        $editorStore.addComponents({ list });
    }
    /**
     * 初始化组件列表
     * @param list 组件列表
     */
    initComponentList(list: IDesignerComponent[]) {
        const $editorStore = useEditorStore(this.$pinia);
        $editorStore.initComponentList({ list });
    }
    /**
     * 初始化editor数据
     */
    async initEditorAsync() {
        const db = await openDBAsync().catch();
        // 如果有本地数据，则使用本地数据渲染，如果没有，则初始化一个空的editor
        const localData = await getDataAsync(db, 'local').catch();
        if (localData) {
            this.initEditorByLocalData(localData.data);
        } else {
            this.initEditorByEmpty();
        }
    }
    /**
     * 使用本地数据初始化editor数据
     */
    initEditorByLocalData(localData: IAppSaveStruct) {
        const appStore = useAppStore(this.$pinia);
        appStore.pages = localData.pages.map(p => {
            return {
                ...p,
                submitState: 'saved',
                selected: false,
            } as IPageStore;
        });
        appStore.activePage = appStore.pages.find(c => c.key === localData.defaultPageKey);
        if (appStore.activePage) {
            appStore.activePage.selected = true;
        }
    }
    /**
     * 初始化一个空的editor的数据
     */
    initEditorByEmpty() {
        const appStore = useAppStore(this.$pinia);
        const editorStore = useEditorStore(this.$pinia);
        const newPage = editorStore.createNewEmptyPage(appStore.pages);
        newPage.selected = true;
        appStore.pages.push(newPage);
        appStore.setActivePage({ pageId: newPage.key });
    }
    /**
     * 获取预览地址
     * @param env 运行环境
     * @returns 返回预览地址
     */
    getPreviewUrl(env: EnumAppEnv) {
        const appStore = useAppStore(this.$pinia);
        const pageKey = appStore.activePage?.key || '';
        if (env === EnumAppEnv.local || env === EnumAppEnv.dev) {
            return `/app/pages/${pageKey}`;
        }
    }
    /**
     * 保存editor的数据到本地
     */
    async saveLocalData() {
        const db = await openDBAsync().catch();
        const data = {
            id: 'local',
            data: this.getSaveData(),
        };
        await setDataAsync(db, data).catch(e => $warn(e));
    }
    getSaveData(): IAppSaveStruct {
        const appStore = useAppStore(this.$pinia);
        const varController = useVarControler(this.$app);
        return {
            defaultPageKey: appStore.activePage?.key || '',
            pages: toRaw(appStore.pages),
            globarVars: varController.SerializeGlobalVars(),
        };
    }
    // 导入配置文件
    importConfig(payload: { pages: IPageStore[] }) {
        const appStore = useAppStore(this.$pinia);
        appStore.pages = payload.pages;
        if (appStore.pages && appStore.pages.length) {
            appStore.activePage = appStore.pages[0];
        }
    }
    // 添加页面
    addPage(payload?: { page?: IPageStore }) {
        const appStore = useAppStore(this.$pinia);
        const editorStore = useEditorStore(this.$pinia);
        if (payload && payload.page) {
            const newPage = editorStore.createNewEmptyPage(appStore.pages);
            const _page = { ...newPage, ...payload.page };
            appStore.pages.push(_page);
        } else {
            const newPage = editorStore.createNewEmptyPage(appStore.pages);
            appStore.pages.push(newPage);
        }
    }
    // 删除页面
    deletePage(payload: { pageKey: string }) {
        const appStore = useAppStore(this.$pinia);
        const index = appStore.pages.findIndex(p => p.key === payload.pageKey);
        if (index > -1) {
            appStore.pages.splice(index, 1);
        }
    }
    initAppPages(payload: { pages: IPageStore[] }) {
        const appStore = useAppStore(this.$pinia);
        appStore.pages = payload.pages;
        if (payload.pages.length) {
            appStore.setActivePage({ pageId: payload.pages[0].key });
        }
    }
    // 删除选中的组件
    deleteComponent(payload: { id: string }) {
        const componentId = payload.id;
        const appStore = useAppStore(this.$pinia);
        const editorStore = useEditorStore(this.$pinia);
        const activePage = appStore.activePage;
        if (activePage && activePage.list) {
            // 从当前页面组件列表中查找要删除的组件
            utils.$deleteTreeItem(activePage.list, componentId);
            editorStore.selectedComponent = undefined;
        }
    }
    // 导入csv文件的组件
    importCsvData(payload: { pageName: string; pageCode: string; data: any }) {
        const appStore = useAppStore(this.$pinia);
        const editorStore = useEditorStore(this.$pinia);
        const newPage = {
            ...editorStore.createNewEmptyPage(appStore.pages),
            ...{ label: payload.pageName, code: payload.pageCode },
        };
        const rowState = editorStore.componentList.find(c => c.type === EnumComponentType.row);
        if (rowState) {
            // 创建行
            const rowKey = utils.$getUUID(EnumComponentType.row);
            const newRow: IDesignerComponent = {
                key: rowKey,
                label: rowState.label,
                icons: rowState.icons,
                group: rowState.group,
                type: rowState.type,
                list: [],
            };
            for (const k in payload.data) {
                const type = payload.data[k];
                const component = editorStore.componentList.find(c => c.type === type);
                if (component) {
                    newRow.list!.push({
                        key: utils.$getUUID(component.type),
                        code: '',
                        group: component.group,
                        type: component.type,
                        label: component.label,
                        icons: component.icons,
                        props: {
                            label: k,
                            dense: true,
                        },
                    } as any);
                }
            }
            if (newPage.list && newPage.list.length) {
                newPage.list[0].list!.push(newRow);
                appStore.pages.push(newPage);
                return newPage.key;
            }
        }
        return '';
    }
    // 导入csv文件数据
    importCsvDataAsync(payload: { pageName: string; pageCode: string; data: any }) {
        this.importCsvData(payload);
        const appStore = useAppStore(this.$pinia);
        appStore.setActivePage({
            pageId: appStore.pages[appStore.pages.length - 1].key,
        });
    }

    /**
     * 编辑器切换页面动作
     * @param pageKey 要切换的页面key
     */
    setActivePage(pageKey: string) {
        const appStore = useAppStore();
        appStore.setActivePage({ pageId: pageKey });
        this.setActivePageMode('content');
    }

    /**
     * 设置当前页面的编辑模式
     * @param mode 内容，css或者function
     */
    setActivePageMode(mode: TPageEditMode) {
        const editorStore = useEditorStore();
        editorStore.pageEditMode = mode;
    }
}
