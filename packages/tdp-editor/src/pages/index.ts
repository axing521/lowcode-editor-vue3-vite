import { createApp } from 'vue';
import { initEditor } from '../editor/utils';
import EditorIndex from './AppIndex.vue';
import '../editor/index.less';
import 'tdp-editor-components/src/styles/index.less';

const app = createApp(EditorIndex);
initEditor(app);
// 渲染editor
app.mount('#app');
