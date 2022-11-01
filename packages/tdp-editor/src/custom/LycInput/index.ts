import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import { EnumPropsSelector } from 'tdp-editor-types/enum/designer';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';

import LycInput from './LycInput.vue';
export const componentConfig: IDesignerComponent = {
    code: '',
    group: EnumComponentGroup.custom,
    sfc: LycInput,
    key: '',
    label: '输入框',
    type: 'LycInput',
    listGroup: 'high',
    propsConfigs: [{ key: 'placeholder', label: '默认文本', selector: EnumPropsSelector.input }],
};

export default {
    LycInput,
    componentConfig,
};
