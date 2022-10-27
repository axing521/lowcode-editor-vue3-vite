import type { IAppStoreState } from 'tdp-editor-types/interface/designer';
import { defineStore } from 'pinia';
import { EnumAppMode } from 'tdp-editor-types/enum';

export const useAppStore = defineStore('appStore', {
    state(): IAppStoreState {
        return {
            mode: EnumAppMode.design,
        };
    },
    actions: {
        setMode(mode: EnumAppMode) {
            this.mode = mode;
        },
    },
});
