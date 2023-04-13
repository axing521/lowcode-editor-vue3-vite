import { defineStore } from 'pinia';
import { EnumAppMode } from 'tdp-editor-types/src/enum';
import type { IAppStore } from 'tdp-editor-types/src/interface/store';
import type { IPageForm } from 'tdp-editor-types/src/interface/designer/pageForm';

export const useAppStore = defineStore('appStore', {
    state(): IAppStore {
        return {
            mode: EnumAppMode.design,
            pages: [],
            pageForms: new Map(),
            activePage: undefined,
            globalVars: {}, // 运行时的全局变量，存放的是运行时的值
            currentPageVars: {}, // 运行时的当前页面变量，存放的是运行时的值
        };
    },
    actions: {
        setMode(mode: EnumAppMode) {
            this.mode = mode;
        },
        // 根据formKey获取form实例
        pageForm(key: string) {
            return this.pageForms.get(key);
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
        // 切换所选页面
        setActivePage(payload: { pageId: string }) {
            this.pages.forEach(page => {
                page.selected = page.key === payload.pageId;
                if (page.key === payload.pageId) {
                    this.activePage = page;
                }
            });
        },
    },
});
