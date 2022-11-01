import { createApp } from 'vue';
import { createPinia } from 'pinia';
// 自定义组件样式
import 'tdp-editor-components/src/styles/index.less';
import registerDirectives from 'tdp-editor-components/src/directives';
import componentRegister from 'tdp-editor-components/src/utils/componentRegister';

import usePlugin from '../../plugins';
// import createRouter from '../routers/runtime.router';
import RuntimeWrapper from './RuntimeWrapper.vue';
import { createController } from '../../controller';
import type { IAppStoreState } from 'tdp-editor-types/interface/designer';

interface ICreateEditorOptions {
    container: string | Element;
}

export const version = import.meta.env.VITE_APP_VERSION;
console.info('tdp editor runtime version: ' + version);

export const createRuntime = (options: ICreateEditorOptions) => {
    const app = createApp(RuntimeWrapper);
    // const router = createRouter();
    // 注册指令
    registerDirectives(app);
    // 注册插件
    usePlugin(app);
    app.use(createPinia());
    // app.use(router);
    // 注册默认组件
    const componentList = componentRegister(app);
    app.config.globalProperties.$default_componentList = componentList;
    const controllers = createController(app);
    controllers.editorController.initComponentList(componentList);
    console.log('runtime app', app);
    app.mount(options.container);
    return {
        runtime: app,
        setRuntimeJson: (runtimeJson: IAppStoreState) => {
            controllers.appController.initApp(runtimeJson);
        },
    };
};
