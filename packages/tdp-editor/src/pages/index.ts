import { createApp } from 'vue';
import { initEditor } from '../editor/utils';
import EditorIndex from './AppIndex.vue';
import createRouter from '../routers/router';
import '../editor/index.less';
import 'tdp-editor-components/src/styles/index.less';

const app = createApp(EditorIndex);
const editorRouter = createRouter();
editorRouter.beforeEach((to, from) => {
    // 浏览器直接打开editor的地址，初始化editor
    if (!from.name && to.name === 'editor') {
        initEditor(app);
    }
    return true;
});
app.use(editorRouter);

// initEditor(app);
// 渲染editor
app.mount('#app');
