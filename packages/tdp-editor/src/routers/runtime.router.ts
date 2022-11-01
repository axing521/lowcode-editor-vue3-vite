import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        name: 'runtime_index',
        path: '/',
        meta: {
            className: 'tdp-editor-runtime-index',
            label: '运行时首页',
            title: '运行时首页',
        },
        component: () =>
            import(/* webpackChunkName: "runtime_index" */ '../pages/runtime/runtimeIndex.vue'),
    },
];

const _createRouter = () => {
    console.log('env.BASE_URL', import.meta.env.BASE_URL);
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
