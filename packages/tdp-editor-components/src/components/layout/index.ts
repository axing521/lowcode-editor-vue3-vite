import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { ILayoutProps } from './interface';
import Layout from './Layout.vue';

export default Layout;

export const register: registerComponentFunc = function () {
    const layout: IDesignerComponent<ILayoutProps> = {
        key: '',
        label: '布局容器',
        icons: 'Cards',
        group: EnumComponentGroup.layout,
        type: EnumComponentType.layout,
        order: 100,
        listGroup: 'normal',
        showInList: false,
        propsConfigs: [{ key: 'showShadow', label: '显示阴影', selector: EnumSelectorName.switch }],
        cssConfigs: ['position', 'width', 'height'],
    };
    return layout;
};
