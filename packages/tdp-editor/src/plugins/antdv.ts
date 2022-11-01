import type { App } from 'vue';
import antdV from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css';
export default function useAntdV(app: App) {
    app.use(antdV);
}
