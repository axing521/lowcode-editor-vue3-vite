/**
 * editor类库入口文件
 * 暴露createEditor方法提供给第三方调用
 */
import { createApp } from 'vue';
import type { TSelector } from 'tdp-editor-types/interface/designer/selector';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
// monaco配置
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { initEditor } from './utils';
import TdpEditorVue from '../pages/TdpEditor.vue';
// 自定义组件样式
import 'tdp-editor-components/src/styles/index.less';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';

// @ts-ignore
window.MonacoEnvironment = {
    getWorker(_: any, label: any) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

interface ICreateEditorOptions {
    container: string | Element;
}

export const version = import.meta.env.VITE_APP_VERSION;
console.info('tdp editor version: ' + version);

export const createEditor = (options: ICreateEditorOptions) => {
    const app = createApp(TdpEditorVue);
    const editor = initEditor(app);
    // 渲染editor
    app.mount(options.container);
    return {
        editor: app,
        addCustomComponent(components: IDesignerComponent[]) {
            if (Array.isArray(components) && components.length) {
                app.config.globalProperties.$custom_componentList = components;
                components.forEach(c => {
                    if (c.group === EnumComponentGroup.custom) {
                        app.component(c.type, c.sfc!);
                    }
                });
                editor.editorStore.addComponents({ list: components });
            }
        },
        addSelectors(selectors: TSelector[]) {
            editor.selectorManager.addSelectors(selectors);
        },
    };
};
