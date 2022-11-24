import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { RouterConfig } from 'tdp-editor-utils/constants/router';
import TdpAppHeaderVue from '../pages/TdpAppHeader.vue';
import TdpAppFooterVue from '../pages/TdpAppFooter.vue';
import TdpAppLeftSideVue from '../pages/TdpAppLeftSide.vue';
import TdpAppRightSideVue from '../pages/TdpAppRightSide.vue';
import TdpPageVue from '../pages/TdpPage.vue';
import TdpAppIndexVue from '../pages/TdpAppIndex.vue';
import TdpPage404Vue from '../pages/TdpPage404.vue';

const componentNames = {
    header: TdpAppHeaderVue,
    footer: TdpAppFooterVue,
    leftSide: TdpAppLeftSideVue,
    rightSide: TdpAppRightSideVue,
};

declare module 'vue-router' {
    interface RouteMeta {
        className: string;
        label?: string;
        title?: string;
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        ...RouterConfig.Index,
        component: TdpAppIndexVue,
    },
    {
        ...RouterConfig.AppIndex,
        component: TdpAppIndexVue,
    },
    {
        ...RouterConfig.AppPage,
        ...{
            components: {
                default: TdpPageVue,
                ...componentNames,
            },
        },
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: TdpPage404Vue },
];

const _createRouter = () => {
    console.log('env.BASE_URL', import.meta.env.BASE_URL);
    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes,
    });

    router.beforeEach((to, from, next) => {
        const toClassName: string = (to.meta?.className as string) || '';
        const fromClassName: string = (from && (from.meta?.className as string)) || '';
        console.log('fromClassName ------------', fromClassName);
        const html = document.querySelector('html');
        const body = document.querySelector('body');
        if (fromClassName === toClassName) {
            next();
            return;
        }
        if (fromClassName) {
            if (html) {
                if (html.className.includes(fromClassName)) {
                    html.className = html.className.replace(' ' + fromClassName, '');
                }
            }
            if (body) {
                if (body.className.includes(fromClassName)) {
                    body.className = body.className.replace(' ' + fromClassName, '');
                }
            }
        }
        if (toClassName) {
            if (html) {
                if (!html.className.includes(toClassName)) {
                    html.className += ' ' + toClassName;
                }
            }
            if (body) {
                if (!body.className.includes(toClassName)) {
                    body.className += ' ' + toClassName;
                }
            }
        }
        next();
    });
    return router;
};

export default _createRouter;
