import type { App } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
export default function useAntdV(app: App) {
    app.use(Antd);
}
