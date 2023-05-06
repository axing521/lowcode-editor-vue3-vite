import { ref, reactive, computed, watch, watchEffect, type App } from 'vue';
import { useAppControler } from 'tdp-editor-common/src/controller';
export default function useTDP(app: App) {
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
