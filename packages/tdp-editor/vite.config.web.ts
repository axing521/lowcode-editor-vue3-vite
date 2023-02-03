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
            `${prefix}/language/html/html.worker`,
            `${prefix}/language/typescript/ts.worker`,
            `${prefix}/editor/editor.worker`,
        ],
    },
    build: {
        outDir: 'dist/web',
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html'),
            },
            output: {
                chunkFileNames: 'js/[name].[hash].js',
                entryFileNames: 'js/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]',
                manualChunks(id) {
                    if (id.includes('ant-design')) {
                        return 'antdv';
                    } else if (id.includes('monaco')) {
                        return 'monaco';
                    } else if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
});
