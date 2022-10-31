import type { IAppStoreState } from 'tdp-editor-types/interface/designer';
import { defineStore } from 'pinia';
import { EnumAppMode } from 'tdp-editor-types/enum';
import type { IPageForm } from 'tdp-editor-types/interface/designer/pageForm';

export const useAppStore = defineStore('appStore', {
    state(): IAppStoreState {
        return {
            mode: EnumAppMode.design,
            pages: [],
            pageForms: new Map(),
            activePage: undefined,
        };
    },
    getters: {
        pagesGetter: state => state.pages || [],
        pageFormsGetter: state => state.pageForms,
        activePageGetter: state => state.activePage,
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
        setSelectPage(payload: { pageId: string }) {
            this.pages.forEach(page => {
                page.selected = page.key === payload.pageId;
                if (page.key === payload.pageId) {
                    this.activePage = page;
                }
            });
        },
    },
});
