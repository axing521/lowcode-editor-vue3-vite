import { toRaw } from 'vue';
import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { EnumAppEnv, EnumAppMode } from 'tdp-editor-types/enum';
import type { IAppStoreState } from 'tdp-editor-types/interface/store';
import type { IAppSaveStruct } from 'tdp-editor-types/interface/app';

import { useAppStore } from '../stores/appStore';
export default class AppController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }
    initApp(appJson: IAppStoreState) {
        const appStore = useAppStore(this.$pinia);
        appStore.pages = appJson.pages;
        appStore.activePage = appJson.activePage || appJson.pages[0];
    }
    getActivePage() {
        const appStore = useAppStore(this.$pinia);
        const activePage = appStore.activePage;
        if (activePage) {
            return activePage;
        } else if (appStore.pages.length) {
            appStore.activePage = appStore.pages[0];
            return appStore.activePage;
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
        const appStore = useAppStore(this.$pinia);
        return {
            defaultPageKey: appStore.activePage?.key || '',
            pages: toRaw(appStore.pages),
        };
    }
    replacePage(pageId: string) {
        const appStore = useAppStore(this.$pinia);
        appStore.setActivePage({ pageId });
    }
    setMode(mode: EnumAppMode) {
        const appStore = useAppStore(this.$pinia);
        appStore.mode = mode;
    }
}
