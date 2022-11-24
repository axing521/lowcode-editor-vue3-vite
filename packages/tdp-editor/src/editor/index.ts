// 引入editor
import { createEditor } from './editor';
import { customList } from '../custom';
import './index.less';

const tdpEditor = createEditor({
    container: '#app',
});
tdpEditor.addCustomComponent(customList);
