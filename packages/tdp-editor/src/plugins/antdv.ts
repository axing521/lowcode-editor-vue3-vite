import type { App } from 'vue';
import antdV from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
export default function useAntdV(app: App) {
    app.use(antdV);
}
