import { fileURLToPath, URL } from 'url';
import path from 'path';

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
            `${prefix}/language/typescript/ts.worker`,
            `${prefix}/editor/editor.worker`,
        ],
    },
    build: {
        outDir: 'dist/lib',
        lib: {
            entry: path.resolve(__dirname, 'src/editor/editor.ts'),
            name: 'TDPEditor',
            fileName: format => `tdp-editor.${format}.js`,
        },
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html'),
            },
            output: {
                chunkFileNames: 'chunk/[name].[hash].js',
                entryFileNames: 'js/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]',
            },
        },
    },
});
