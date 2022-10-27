import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const prefix = 'monaco-editor/esm/vs';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    optimizeDeps: {
        include: [
            `${prefix}/language/json/json.worker`,
            `${prefix}/language/css/css.worker`,
            `${prefix}/language/html/html.worker`,
            `${prefix}/language/typescript/ts.worker`,
            `${prefix}/editor/editor.worker`,
        ],
    },
});
