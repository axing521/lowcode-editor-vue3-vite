import { fileURLToPath, URL } from 'url';
import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

console.log('editor vite config----------------');

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
    build: {
        outDir: 'dist/editor',
        lib: {
            entry: path.resolve(__dirname, 'src/pages/editor/editor.ts'),
            name: 'TDPEditor',
            fileName: format => `tdp-editor.${format}.js`,
        },
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html'),
            },
        },
    },
});
