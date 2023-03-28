/**
 * runtime类库入口文件
 * 暴露createRuntime方法提供给第三方调用
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import type { IAppStoreState } from 'tdp-editor-types/interface/store';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';

// 自定义组件样式
import 'tdp-editor-components/src/styles/index.less';
import registerDirectives from 'tdp-editor-components/src/directives';
import componentRegister from 'tdp-editor-components/src/utils/componentRegister';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';

import packageJson from '../../package.json';
import usePlugin from '../plugins';
import createRouter from '../routers/runtime.router';
import App from './TdpApp.vue';
import { createController } from 'tdp-editor-utils/controller';
import { EnumAppMode } from 'tdp-editor-types/enum';

interface ICreateRuntimeOptions {
    container: string | Element;
}

console.info('tdp app runtime version: ' + packageJson.version);

export const createRuntime = (options: ICreateRuntimeOptions) => {
    const app = createApp(App);
    const pinia = createPinia();
    // 注册指令
    registerDirectives(app);
    // 注册插件
    usePlugin(app);
    // 注册pinia
    app.use(pinia);
    // 注册router
    app.use(createRouter());

    // 注册默认组件
    const componentList = componentRegister(app);
    app.config.globalProperties.$default_componentList = componentList;
    // 注册controller
    const controllers = createController(app, pinia);
    controllers.appController.setMode(EnumAppMode.runtime);
    // 渲染应用
    app.mount(options.container);
    return {
        app,
        setRuntimeJson: (runtimeJson: IAppStoreState) => {
            controllers.appController.initApp(runtimeJson);
        },
        addCustomComponents(components: IDesignerComponent[]) {
            if (Array.isArray(components) && components.length) {
                app.config.globalProperties.$custom_componentList = components;
                components.forEach(c => {
                    if (c.group === EnumComponentGroup.custom) {
                        app.component(c.type, c.sfc!);
                    }
                });
            }
        },
    };
};
