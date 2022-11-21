import { useAppStore } from '../stores/appStore';
import { useEditorStore } from '../stores/editorStore';
import { $findTreeItem } from '../utils';

export interface IAppInfo {
    appId: string;
    appName: string;
    projectId: string;
}

type Nullable<T> = {
    [P in keyof T]?: T[P];
};

export interface IUserInfo {
    itcode: string;
    id: string;
    name: string;
}
// @ts-nocheck
export default class FunctionFactory {
    private readonly $editorStore = useEditorStore();
    private readonly $appStore = useAppStore();
    static init(): FunctionFactory {
        // @ts-ignore
        if (window.$fd && window.$fd.funcFactory) {
            // @ts-ignore
            return window.$fd.funcFactory;
        } else {
            const funcFactory = new FunctionFactory();
            // @ts-ignore
            if (window.$fd) {
                // @ts-ignore
                window.$fd.funcFactory = funcFactory;
            } else {
                // @ts-ignore
                window.$fd = {
                    funcFactory: funcFactory,
                };
            }
            return funcFactory;
        }
    }
    getCompState = (compId: string) => {
        if (this.$appStore) {
            const page = this.$appStore.activePage;
            if (page && page.list) {
                const list = $findTreeItem(page.list, compId) || [];
                if (list.length > 0) {
                    return list[0];
                } else return undefined;
            } else return undefined;
        } else {
            return undefined;
        }
    };
    getUserInfo = (): IUserInfo => {
        return {
            itcode: '',
            id: '',
            name: '',
        };
    };
    getAppInfo = (): IAppInfo => {
        return {
            appId: localStorage.getItem('fd_appId') || '',
            appName: localStorage.getItem('fd_appName') || '',
            projectId: localStorage.getItem('currentPro') || '',
        };
    };
    setAppInfo = (app: Nullable<IAppInfo>) => {
        if (app.appId) {
            localStorage.setItem('fd_appId', app.appId);
        }
        if (app.appName) {
            localStorage.setItem('fd_appName', app.appName);
        }
        if (app.projectId) {
            localStorage.setItem('currentPro', app.projectId);
        }
    };
    clearAppInfo = (): void => {
        localStorage.removeItem('fd_appId');
        localStorage.removeItem('fd_appName');
        localStorage.removeItem('currentPro');
    };
}
