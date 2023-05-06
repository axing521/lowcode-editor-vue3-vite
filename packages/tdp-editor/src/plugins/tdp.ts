import { ref, reactive, computed, watch, watchEffect, type App } from 'vue';
import type { Router } from 'vue-router';
import { useAppControler } from 'tdp-editor-common/src/controller';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useTDP(app: App, router?: Router) {
    const appController = useAppControler(app);
    window.$tdp = {
        App: {
            changePage(pageKey: string) {
                appController.changePage(pageKey, '');
            },
        },
        Utils: {},
        vue: {
            ref,
            reactive,
            computed,
            watch,
            watchEffect,
        },
    };
}
