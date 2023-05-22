import type { App } from 'vue';
import type { Router } from 'vue-router';
import type { Pinia } from 'pinia';
import type { EnumAppEnv, EnumAppMode } from 'tdp-editor-types/src/enum';

import { useAppStore } from '../stores/appStore';
import { usePageControler, useVarControler } from './index';
import { $log } from '../utils';
import { useContentStore } from '../stores/contentStore';

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
    initApp(appJson: any) {
        const contentStore = useContentStore(this.$pinia);
        contentStore.pages = appJson.pages;
        const activePage = appJson.activePage || contentStore.pages[0];
        this.changePage(activePage.key, '');
    }
    /**
     * 获取当前显示页面
     * @returns 返回页面对象
     */
    getActivePage() {
        const appStore = useAppStore(this.$pinia);
        const contentStore = useContentStore(this.$pinia);
        const activePage = appStore.activePage;
        if (activePage) {
            return activePage;
        } else if (contentStore.pages.length) {
            appStore.setActivePage({ pageId: contentStore.pages[0].key });
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
        const contentStore = useContentStore(this.$pinia);
        const targetPage = contentStore.getPageByKey(pageKey);
        if (targetPage) {
            const pageController = usePageControler(this.$app);
            const varController = useVarControler(this.$app);

            // 重置当前页面变量
            varController.resetTargetPageVars(pageKey);
            // 初始化目标页样式
            pageController.initStyle(pageKey, targetPage.styles || '');
            // 初始化目标页脚本
            pageController.initScript(pageKey, targetPage.script || '');
            // 切换到目标页
            appStore.setActivePage({ pageId: pageKey });
        }
        if (oldPageKey) {
            $log('切换前的页面key：' + oldPageKey);
        }
    }
    // 路由到某个页面
    routerPage(params: { router: Router; pageKey?: string; pageName?: string }) {
        if (params.pageKey) {
            params.router.push(params.pageKey);
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
