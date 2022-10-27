import { createApp } from 'vue';
import { createPinia } from 'pinia';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import Editor from './EditorWrapper.vue';
// 自定义组件样式
import 'tdp-editor-components/src/styles/index.less';
import registerDirectives from 'tdp-editor-components/src/directives';
import usePlugin from './plugins';
import { useEditorStore } from './stores/editorStore';
import componentRegister from 'tdp-editor-components/src/utils/componentRegister';

// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_: any, label: any) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
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
console.info('tdp editor version: ' + import.meta.env.VITE_APP_VERSION);
const createEditor = (options: ICreateEditorOptions) => {
    const app = createApp(Editor);
    // 注册指令
    registerDirectives(app);
    // 注册插件
    usePlugin(app);
    app.use(createPinia());
    const editorStore = useEditorStore();

    // 注册默认组件
    const componentList = componentRegister(app);
    app.config.globalProperties.$default_componentList = componentList;
    editorStore.initComponentList({
        list: componentList,
    });
    console.log('editor app', app);
    app.mount(options.container);
    return app;
};

export default {
    createEditor,
    version: import.meta.env.VITE_APP_VERSION,
};
