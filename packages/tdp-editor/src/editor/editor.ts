/**
 * editor类库入口文件
 * 暴露createEditor方法提供给第三方调用
 */
import { createApp } from 'vue';
import type { TSelector } from 'tdp-editor-types/interface/designer/selector';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';

import packageJson from '../../package.json';
import { initEditor } from './utils';
import TdpEditorVue from '../pages/TdpEditor.vue';
// 自定义组件样式
import 'tdp-editor-components/src/styles/index.less';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';

interface ICreateEditorOptions {
    container: string | Element;
}

console.info('tdp editor version: ' + packageJson.version);

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
