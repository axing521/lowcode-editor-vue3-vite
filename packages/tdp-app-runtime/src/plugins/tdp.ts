import { ref, reactive, computed, watch, watchEffect, type App } from 'vue';
import type { Router } from 'vue-router';
import { useAppControler } from 'tdp-editor-common/src/controller';

export default function useTDP(app: App, router: Router) {
    const appController = useAppControler(app);
    window.$tdp = {
        App: {
            changePage(pageKey: string) {
                appController.routerPage({ router, pageKey });
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
