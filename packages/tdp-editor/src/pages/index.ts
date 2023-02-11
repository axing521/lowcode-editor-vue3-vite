import { createApp } from 'vue';
import { initEditor } from '../editor/utils';
import TdpPreview from './AppIndex.vue';
import '../editor/index.less';
import 'tdp-editor-components/src/styles/index.less';

const app = createApp(TdpPreview);
initEditor(app);
// 渲染editor
app.mount('#app');
