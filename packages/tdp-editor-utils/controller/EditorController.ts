import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import type { App } from 'vue';
import { useEditorStore } from '../stores/editorStore';
import { useAppStore } from '../stores/appStore';
import { EnumAppEnv } from 'tdp-editor-types/enum';
import { openDBAsync, setDataAsync } from '../indexDBUtil';
import { useAppControler } from './index';

export default class EditorController {
    private readonly $app: App;
    constructor(app: App) {
        this.$app = app;
    }
    addCustomerComponents(list: IDesignerComponent[]) {
        const $editorStore = useEditorStore();
        $editorStore.addComponents({ list });
    }
    initComponentList(list: IDesignerComponent[]) {
        const $editorStore = useEditorStore();
        $editorStore.initComponentList({ list });
    }
    /**
     * 获取预览地址
     * @param env 运行环境
     * @returns 返回预览地址
     */
    getPreviewUrl(env: EnumAppEnv) {
        const appStore = useAppStore();
        const pageKey = appStore.activePage?.key || '';
        if (env === EnumAppEnv.local || env === EnumAppEnv.dev) {
            return `http://localhost:3031/preview/app/pages/${pageKey}`;
        }
    }
    async saveLocalData() {
        const appController = useAppControler();
        const db = await openDBAsync().catch();
        const data = {
            id: 'local',
            data: appController.getSaveData(),
        };
        await setDataAsync(db, data).catch();
    }
}
