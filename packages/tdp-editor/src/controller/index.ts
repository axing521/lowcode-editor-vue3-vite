import type { App } from 'vue';
import AppController from './AppController';
import AppVarController from './AppVarController';
import EditorController from './EditorController';

const controllers = {
    appController: Object.create(null) as AppController,
    appVarController: Object.create(null) as AppVarController,
    editorController: Object.create(null) as EditorController,
};

export const createController = (app: App) => {
    controllers.appController = new AppController();
    app.config.globalProperties.$AppController = controllers.appController;
    controllers.appVarController = new AppVarController();
    app.config.globalProperties.$AppVarController = controllers.appVarController;
    controllers.editorController = new EditorController();
    app.config.globalProperties.$EditorController = controllers.editorController;
    return controllers;
};

export const getControllers = () => {
    return controllers;
};

export const getAppController = () => {
    return controllers.appController;
};

export const getEditorController = () => {
    return controllers.editorController;
};
