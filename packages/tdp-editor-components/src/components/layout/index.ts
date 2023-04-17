import { defineAsyncComponent } from 'vue';
import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumCssProerty, EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { ILayoutProps } from './interface';
export default defineAsyncComponent(() => import('./layoutRenderer.vue'));

export const register: registerComponentFunc = function () {
    const layout: IDesignerComponent<ILayoutProps> = {
        key: '',
        label: '卡片',
        icons: 'Cards',
        group: EnumComponentGroup.layout,
        type: EnumComponentType.layout,
        order: 100,
        listGroup: 'normal',
        showInList: false,
        propsConfigs: [{ key: 'showShadow', label: '显示阴影', selector: EnumSelectorName.switch }],
        cssConfigs: [EnumCssProerty.position, EnumCssProerty.width, EnumCssProerty.height],
    };
    return layout;
};
