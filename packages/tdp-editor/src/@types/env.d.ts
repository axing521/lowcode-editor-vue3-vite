/// <reference types="vite/client" />
import { EnumAppEnv } from 'tdp-editor-types/enum';
interface ImportMetaEnv {
    readonly NODE_ENV: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_ENV: EnumAppEnv;
    readonly VITE_APP_SOURCEMAP: string;
    readonly VITE_APP_BASE_URL: string;
    readonly VITE_APP_VERSION: string;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
