import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TdpEditor from '../pages/TdpEditor.vue';
import TdpPreview from '../pages/TdpPreview.vue';

const routes: Array<RouteRecordRaw> = [
    {
        name: 'index',
        path: '/',
        meta: {
            className: 'tdp-editor-index',
            label: '编辑器首页',
            title: '编辑器首页',
        },
        // component: () => import(/* webpackChunkName: "runtime_index" */ '../pages/TdpEditor.vue'),
        component: TdpEditor,
    },
    {
        name: 'preview',
        path: '/app/pages/:pageId',
        meta: {
            className: 'tdp-editor-preview',
            label: '编辑器预览',
            title: '编辑器预览',
        },
        // component: () => import(/* webpackChunkName: "runtime_index" */ '../pages/TdpPreview.vue'),
        component: TdpPreview,
    },
];

const _createRouter = () => {
    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes,
    });

    router.beforeEach((to, from, next) => {
        const className: string = (to.meta?.className as string) || '';
        if (className) {
            const html = document.querySelector('html');
            const body = document.querySelector('body');
            if (html) {
                html.setAttribute('class', className);
            }
            if (body) {
                body.setAttribute('class', className);
            }
        }
        next();
    });
    return router;
};

export default _createRouter;
