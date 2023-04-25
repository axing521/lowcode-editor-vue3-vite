import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { EnumAppEnv, EnumAppMode } from 'tdp-editor-types/src/enum';
import type { IAppStore } from 'tdp-editor-types/src/interface/store';

import { useAppStore } from '../stores/appStore';
import { usePageControler } from './index';
import { $log } from '../utils';

export default class AppController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }
    /**
     * 初始化应用
     * @param appJson appJson
     */
    initApp(appJson: IAppStore) {
        const appStore = useAppStore(this.$pinia);
        appStore.pages = appJson.pages;
        appStore.activePage = appJson.activePage || appJson.pages[0];
    }
    /**
     * 获取当前显示页面
     * @returns 返回页面对象
     */
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
    /**
     * 更改当前显示页面
     * @param pageKey 页面的key
     * @param oldPageKey 切换前的页面key
     */
    changePage(pageKey: string, oldPageKey: string) {
        const appStore = useAppStore(this.$pinia);
        const activePage = appStore.getPageByKey(pageKey);
        if (activePage) {
            const pageController = usePageControler();
            pageController.initStyle(activePage.key, activePage.styles || '');
            pageController.initFunctions(activePage.functions || '');
            appStore.setActivePage({ pageId: activePage.key });
        }
        if (oldPageKey) {
            $log('切换前的页面key：' + oldPageKey);
        }
    }
    /**
     * 设置应用运行模式
     * @param mode 设计时，运行时，预览等
     */
    setMode(mode: EnumAppMode) {
        const appStore = useAppStore(this.$pinia);
        appStore.mode = mode;
    }
}
