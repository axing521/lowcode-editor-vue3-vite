import type { App } from 'vue';
import { createPinia } from 'pinia';
import packageJson from '../../package.json';
import createRouter from '../routers/router';
import registerDirectives from 'tdp-editor-components/src/directives';
import usePlugin from '../plugins';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import componentRegister from 'tdp-editor-components/src/utils/componentRegister';
import SelectorManager from '../selectors/selectorManager';
import propSelectors from '../selectors/propSelectors';
import { cssSelectors } from '../selectors/cssSelectors';
import { createController } from 'tdp-editor-common/src/controller';
import { EnumAppMode } from 'tdp-editor-types/src/enum';
import { $log } from 'tdp-editor-common/src/utils';

export const initEditor = (app: App) => {
    $log(
        '%c %s',
        'background-color: red; color: white',
        'tdp-editor version: ' + packageJson.version
    );
    const pinia = createPinia();
    // 注册指令
    registerDirectives(app);
    app.use(pinia);
    app.use(createRouter());
    const editorStore = useEditorStore();
    // 注册controller
    const controllers = createController(app, pinia);
    controllers.appController.setMode(EnumAppMode.design);
    // 注册插件
    usePlugin(app);
    // 注册默认组件
    const componentList = componentRegister(app);
    app.config.globalProperties.$default_componentList = componentList;
    editorStore.initComponentList({
        list: componentList,
    });
    // 注册selector
    const selectorManager = new SelectorManager(app, propSelectors, cssSelectors);
    app.config.globalProperties.$selectorManager = selectorManager;

    return {
        editorStore,
        selectorManager,
    };
};
