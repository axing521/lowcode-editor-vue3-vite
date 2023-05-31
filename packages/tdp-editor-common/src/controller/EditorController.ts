/**
 * EditorController 封装editor的逻辑
 * 需要同时访问editorStore和appStore的较复杂的逻辑方法放到此类中
 */
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { IAppSaveStruct } from 'tdp-editor-types/src/interface/app';
import type { TPageEditMode } from 'tdp-editor-types/src/interface/store';
import type { IPageState } from 'tdp-editor-types/src/interface/app/components';

import { toRaw } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { useEditorStore } from '../stores/editorStore';
import { useAppStore } from '../stores/appStore';
import { EnumAppEnv } from 'tdp-editor-types/src/enum';
import { openDBAsync, setDataAsync, getDataAsync } from '../indexDBUtil';
import { utils } from '../index';
import { useVarControler, useAppControler, useDatasourceControler } from './index';
import { $warn } from '../utils';
import { useContentStore } from '../stores/contentStore';

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
        const contentStore = useContentStore(this.$pinia);
        const varController = useVarControler(this.$app);
        const dsController = useDatasourceControler(this.$app);
        contentStore.pages = localData.pages as IPageState[];
        varController.initVars(localData.globalVars || [], localData.pageVars || []);
        dsController.initDS(localData.datasourceList || []);
        this.setActivePage(localData.defaultPageKey);
    }
    /**
     * 初始化一个空的editor的数据
     */
    initEditorByEmpty() {
        const contentStore = useContentStore(this.$pinia);
        this.addPage();
        this.setActivePage(contentStore.pages[0].key);
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
    /**
     * 根据组件类型获取组件配置信息
     * @param type 组件类型
     * @returns 返回组件的配置信息
     */
    getComponentConfigByType(type: EnumComponentType | string) {
        const editorStore = useEditorStore(this.$pinia);
        return editorStore.componentList.find(c => c.type === type);
    }
    getSaveData(): IAppSaveStruct {
        const appStore = useAppStore(this.$pinia);
        const contentStore = useContentStore(this.$pinia);
        const varController = useVarControler(this.$app);
        const dsController = useDatasourceControler(this.$app);
        return {
            defaultPageKey: appStore.activePage?.key || '',
            pages: toRaw(contentStore.pages),
            globalVars: varController.SerializeGlobalVars(),
            pageVars: varController.SerializeAllPageVars(),
            datasourceList: dsController.SerializeDatasourceList(),
        };
    }
    // 导入配置文件
    importConfig(payload: { pages: IPageState[] }) {
        const appStore = useAppStore(this.$pinia);
        const contentStore = useContentStore(this.$pinia);
        contentStore.pages = payload.pages;
        if (contentStore.pages && contentStore.pages.length) {
            appStore.setActivePage({ pageId: contentStore.pages[0].key });
        }
    }
    // 添加页面
    addPage(payload?: { page?: IPageState }) {
        const editorStore = useEditorStore(this.$pinia);
        const contentStore = useContentStore(this.$pinia);
        if (payload && payload.page) {
            const newPage = editorStore.createNewEmptyPage(contentStore.pages);
            const _page = { ...newPage, ...payload.page };
            contentStore.pages.push(_page);
            editorStore.pageStatus[newPage.key] = {
                submitState: 'unsaved',
            };
        } else {
            const newPage = editorStore.createNewEmptyPage(contentStore.pages);
            contentStore.pages.push(newPage);
            editorStore.pageStatus[newPage.key] = {
                submitState: 'unsaved',
            };
        }
    }
    // 删除页面
    deletePage(payload: { pageKey: string }) {
        const editorStore = useEditorStore(this.$pinia);
        const contentStore = useContentStore(this.$pinia);
        const index = contentStore.pages.findIndex(p => p.key === payload.pageKey);
        if (index > -1) {
            contentStore.pages.splice(index, 1);
            delete editorStore.pageStatus[payload.pageKey];
        }
    }
    initAppPages(payload: { pages: IPageState[] }) {
        const contentStore = useContentStore(this.$pinia);
        contentStore.pages = payload.pages;
        if (payload.pages.length) {
            this.setActivePage(payload.pages[0].key);
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
        const contentStore = useContentStore(this.$pinia);
        const editorStore = useEditorStore(this.$pinia);
        const newPage = {
            ...editorStore.createNewEmptyPage(contentStore.pages),
            ...{ label: payload.pageName, code: payload.pageCode },
        };
        const rowState = editorStore.componentList.find(c => c.type === EnumComponentType.form);
        if (rowState) {
            // 创建行
            const rowKey = utils.$getUUID(EnumComponentType.form);
            const newRow: IDesignerComponent = {
                key: rowKey,
                label: rowState.label,
                icons: rowState.icons,
                group: rowState.group,
                type: rowState.type,
                box: rowState.box,
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
                contentStore.pages.push(newPage);
                return newPage.key;
            }
        }
        return '';
    }
    // 导入csv文件数据
    importCsvDataAsync(payload: { pageName: string; pageCode: string; data: any }) {
        this.importCsvData(payload);
        const contentStore = useContentStore(this.$pinia);
        this.setActivePage(contentStore.pages[contentStore.pages.length - 1].key);
    }

    /**
     * 编辑器切换页面动作
     * @param pageKey 要切换的页面key
     */
    setActivePage(pageKey: string) {
        const appStore = useAppStore(this.$pinia);
        const appController = useAppControler(this.$app);
        const editorController = useEditorStore(this.$pinia);
        const oldPageKey = appStore.activePage?.key || '';
        editorController.setSelectedComponent({ component: undefined });
        appController.changePage(pageKey, oldPageKey);
        this.setActivePageMode('content');
    }

    /**
     * 设置当前页面的编辑模式
     * @param mode 内容，css或者function
     */
    setActivePageMode(mode: TPageEditMode) {
        const editorStore = useEditorStore(this.$pinia);
        editorStore.pageEditMode = mode;
    }
}
