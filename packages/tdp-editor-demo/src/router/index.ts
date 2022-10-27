import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        name: 'form_designer_index',
        path: '/',
        meta: {
            className: 'tdp-editor-eidtor-demo',
            label: '模板设计器实例',
            title: '通过json文件，生成对应的模板文件',
        },
        component: () => import(/* webpackChunkName: "form_designer_index" */ '../App.vue'),
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
