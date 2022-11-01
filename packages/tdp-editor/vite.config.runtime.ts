import { fileURLToPath, URL } from 'url';
import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

console.log('runtime vite config----------------');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/pages/runtime.ts'),
            name: 'TDPEditorRuntime',
            fileName: format => `tdp-editor-runtime.${format}.js`,
        },
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/pages/runtime/index.html'),
            },
        },
    },
});
