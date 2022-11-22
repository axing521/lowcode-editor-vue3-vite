export const RouterConfig = {
    Index: {
        name: 'runtime_index',
        path: '/',
        meta: {
            className: 'tdp-app-index',
            label: 'tdp应用首页',
            title: 'tdp应用首页',
        },
    },
    AppIndex: {
        name: 'runtime_app',
        path: '/app',
        meta: {
            className: 'tdp-app',
            label: 'tdp应用',
            title: 'tdp应用',
        },
    },
    AppPage: {
        name: 'runtime_app_page',
        path: '/app/pages/:pageId',
        meta: {
            className: 'tdp-app-page',
            label: '页面',
            title: '页面',
        },
    },
};
