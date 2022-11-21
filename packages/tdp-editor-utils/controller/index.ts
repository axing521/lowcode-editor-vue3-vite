import type { App } from 'vue';
import AppController from './AppController';
import AppVarController from './AppVarController';
import EditorController from './EditorController';

type TController = {
    appController: AppController;
    appVarController: AppVarController;
    editorController: EditorController;
};

const __createControllers = (app: App) => {
    return {
        appController: new AppController(app),
        appVarController: new AppVarController(app),
        editorController: new EditorController(app),
    };
};
let activeApp: App;
const controllerMap: WeakMap<App, TController> = new WeakMap();

// 应用初始化时调用，初始化contorller
export const createController = (app: App) => {
    if (!app) {
        throw new Error('createController 报错，参数app不能为空');
    }
    activeApp = app;
    const controllers = __createControllers(app);
    app.config.globalProperties.$AppController = controllers.appController;
    app.config.globalProperties.$AppVarController = controllers.appVarController;
    app.config.globalProperties.$EditorController = controllers.editorController;
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
