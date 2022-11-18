import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import { EnumCssProerty, EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';

import LycButton from './LycButton.vue';
export const componentConfig: IDesignerComponent = {
    code: '',
    group: EnumComponentGroup.custom,
    sfc: LycButton,
    key: '',
    label: '自定义按钮',
    type: 'LycButton',
    listGroup: 'high',
    propsConfigs: [{ key: 'text', label: '文本', selector: EnumSelectorName.input }],
    cssConfigs: [EnumCssProerty.position, EnumCssProerty.display],
};

export default {
    LycButton,
    componentConfig,
};
