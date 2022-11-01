// 引入editor
import { createEditor } from './editor';
import './index.less';
console.log('tdp-editor-debug');

const tdpEditor = createEditor({
    container: '#app',
});
tdpEditor.addCustomComponent();
