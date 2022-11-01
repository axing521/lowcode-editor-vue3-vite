import { fileURLToPath, URL } from 'url';
import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-ignore
import visualizer from 'rollup-plugin-visualizer';

console.log('runtime vite config----------------');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), visualizer()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        outDir: 'dist/runtime',
        lib: {
            entry: path.resolve(__dirname, 'src/pages/runtime.ts'),
            name: 'TDPEditorRuntime',
            fileName: format => `tdp-editor-runtime.${format}.js`,
        },
        rollupOptions: {
            input: {
                runtime: path.resolve(__dirname, 'runtime.html'),
                editor: path.resolve(__dirname, 'index.html'),
            },
        },
    },
});
