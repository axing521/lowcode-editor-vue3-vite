import { defineStore } from 'pinia';
import type { IContentStore } from 'tdp-editor-types/src/interface/store';

export const useContentStore = defineStore('contentStore', {
    state(): IContentStore {
        return {
            pages: [],
            headers: [],
            footers: [],
            lefts: [],
            rights: [],
        };
    },
    actions: {
        /**
         * 根据页面key获取页面对象
         * @param key 页面key
         */
        getPageByKey(key: string) {
            return this.pages.find(c => c.key === key);
        },
    },
});
