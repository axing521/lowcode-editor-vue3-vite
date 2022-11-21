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
        outDir: 'dist',
        lib: {
            entry: path.resolve(__dirname, 'src/runtime/runtime.ts'),
            name: 'TDPAppRuntime',
            fileName: format => `tdp-app-runtime.${format}.js`,
        },
        rollupOptions: {
            input: {
                runtime: path.resolve(__dirname, 'index.html'),
            },
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
