/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.png';
declare module '*.jpg';

interface Window {
    $fd: {
        funcFactory: any;
    };
    $tdp: {
        App: {
            changePage(pageKey: string): void;
        };
        Utils: any;
        vue: {
            ref: Function;
            reactive: Function;
            computed: Function;
            watch: Function;
            watchEffect: Function;
        };
    };
    wm: WeakMap;
}

namespace NodeJS {
    interface ProcessEnv {
        VITE_APP_VERSION: string;
    }
}
