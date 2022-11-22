// 引入editor
import { createEditor } from './editor';
import { customList } from '../custom';
import './index.less';
console.log('tdp-editor-debug');

const tdpEditor = createEditor({
    container: '#app',
});
tdpEditor.addCustomComponent(customList);
