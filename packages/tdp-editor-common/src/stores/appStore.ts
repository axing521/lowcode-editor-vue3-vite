import { defineStore } from 'pinia';
import { EnumAppMode } from 'tdp-editor-types/src/enum';
import type { IAppStore } from 'tdp-editor-types/src/interface/store';
import { useContentStore } from './contentStore';

export const useAppStore = defineStore('appStore', {
    state(): IAppStore {
        return {
            mode: EnumAppMode.design,
            activePage: undefined,
            globalVars: {}, // 运行时的全局变量，存放的是运行时的值
            currentPageVars: {}, // 运行时的当前页面变量，存放的是运行时的值
            globalDS: {}, // 运行时，应用级的datasource
            currentPageDS: {}, // 运行时，页面级的datasource
            layout: {
                header: {
                    show: false,
                    key: '',
                },
                footer: {
                    show: false,
                    key: '',
                },
                left: {
                    show: false,
                    key: '',
                },
                right: {
                    show: false,
                    key: '',
                },
            },
        };
    },
    actions: {
        setMode(mode: EnumAppMode) {
            this.mode = mode;
        },
        /**
         * 切换所选页面
         * @param payload 参数
         */
        setActivePage(payload: { pageId: string }) {
            const contentStore = useContentStore();
            contentStore.pages.forEach(page => {
                if (page.key === payload.pageId) {
                    this.activePage = page;
                }
            });
        },
    },
});
