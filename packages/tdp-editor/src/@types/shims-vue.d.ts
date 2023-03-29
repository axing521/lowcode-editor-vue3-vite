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
}

namespace NodeJS {
    interface ProcessEnv {
        VITE_APP_VERSION: string;
        VITE_APP_ENV: 'localhost' | 'development' | 'uat' | 'production'
    }
}
