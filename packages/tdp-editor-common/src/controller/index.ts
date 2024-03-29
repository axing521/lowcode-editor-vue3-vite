import type { App } from 'vue';
import type { Pinia } from 'pinia';
import AppController from './AppController';
import AppVarController from './AppVarController';
import EditorController from './EditorController';
import PageController from './PageController';
import DatasourceController from './DatasourceController';

type TController = {
    appController: AppController;
    appVarController: AppVarController;
    editorController: EditorController;
    pageController: PageController;
    datasourceController: DatasourceController;
};

const __createControllers = (app: App, pinia: Pinia) => {
    return {
        appController: new AppController(app, pinia),
        editorController: new EditorController(app, pinia),
        appVarController: new AppVarController(app, pinia),
        pageController: new PageController(app, pinia),
        datasourceController: new DatasourceController(app, pinia),
    };
};
let activeApp: App;
const controllerMap: WeakMap<App, TController> = new WeakMap();

// 应用初始化时调用，初始化contorller
export const createController = (app: App, pinia: Pinia) => {
    if (!app) {
        throw new Error('createController 报错，参数app不能为空');
    }
    activeApp = app;
    const controllers = __createControllers(app, pinia);
    app.config.globalProperties.$AppController = controllers.appController;
    app.config.globalProperties.$AppVarController = controllers.appVarController;
    app.config.globalProperties.$EditorController = controllers.editorController;
    app.config.globalProperties.$PageController = controllers.pageController;
    app.config.globalProperties.$DatasourceController = controllers.datasourceController;
    controllerMap.set(app, controllers);
    return controllers;
};

export const getControllers = (app?: App) => {
    if (app) activeApp = app;
    return controllerMap.get(activeApp)!;
};

export const useAppControler = (app?: App) => {
    if (app) activeApp = app;
    return controllerMap.get(activeApp)!.appController;
};

export const useVarControler = (app?: App) => {
    if (app) activeApp = app;
    return controllerMap.get(activeApp)!.appVarController;
};

export const useEditorControler = (app?: App) => {
    if (app) activeApp = app;
    return controllerMap.get(activeApp)!.editorController;
};

export const usePageControler = (app?: App) => {
    if (app) activeApp = app;
    return controllerMap.get(activeApp)!.pageController;
};

export const useDatasourceControler = (app?: App) => {
    if (app) activeApp = app;
    return controllerMap.get(activeApp)!.datasourceController;
};
