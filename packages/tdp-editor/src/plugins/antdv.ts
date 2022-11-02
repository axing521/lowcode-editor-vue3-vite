import type { App } from 'vue';
import {
    AutoComplete,
    Breadcrumb,
    Button,
    Calendar,
    Card,
    Checkbox,
    Col,
    ConfigProvider,
    DatePicker,
    Divider,
    Drawer,
    Dropdown,
    Empty,
    Form,
    Image,
    Input,
    Menu,
    Modal,
    Pagination,
    Rate,
    Row,
    Select,
    Switch,
    Tabs,
    Tree,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
export default function useAntdV(app: App) {
    app.use(AutoComplete);
    app.use(Breadcrumb);
    app.use(Button);
    app.use(Calendar);
    app.use(Card);
    app.use(Checkbox);
    app.use(Col);
    app.use(ConfigProvider);
    app.use(DatePicker);
    app.use(Divider);
    app.use(Drawer);
    app.use(Dropdown);
    app.use(Empty);
    app.use(Form);
    app.use(Image);
    app.use(Input);
    app.use(Menu);
    app.use(Modal);
    app.use(Pagination);
    app.use(Rate);
    app.use(Row);
    app.use(Select);
    app.use(Switch);
    app.use(Tabs);
    app.use(Tree);
}
