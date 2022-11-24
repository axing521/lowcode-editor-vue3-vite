import { toRaw } from 'vue';
import type { App } from 'vue';
import type { EnumAppEnv, EnumAppMode } from 'tdp-editor-types/enum';
import type { IAppStoreState } from 'tdp-editor-types/interface/store';
import type { IAppSaveStruct } from 'tdp-editor-types/interface/app';

import { useAppStore } from '../stores/appStore';
export default class AppController {
    private readonly $appStore = useAppStore();
    private readonly $app: App;
    constructor(app: App) {
        this.$app = app;
    }
    initApp(appJson: IAppStoreState) {
        this.$appStore.pages = appJson.pages;
        this.$appStore.activePage = appJson.activePage || appJson.pages[0];
    }
    getActivePage() {
        const activePage = this.$appStore.activePage;
        if (activePage) {
            return activePage;
        } else if (this.$appStore.pages.length) {
            this.$appStore.activePage = this.$appStore.pages[0];
            return this.$appStore.activePage;
        } else {
            return undefined;
        }
    }
    /**
     * 获取app当前的运行环境
     */
    getEnv() {
        return import.meta.env.VITE_APP_ENV as EnumAppEnv;
    }
    getSaveData(): IAppSaveStruct {
        return {
            defaultPageKey: this.$appStore.activePage?.key || '',
            pages: toRaw(this.$appStore.pages),
        };
    }
    replacePage(pageId: string) {
        this.$appStore.setActivePage({ pageId });
    }
    setMode(mode: EnumAppMode) {
        this.$appStore.mode = mode;
    }
}
