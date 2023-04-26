import { EnumComponentGroup } from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';

import LycInput from './LycInput.vue';
export const componentConfig: IDesignerComponent = {
    group: EnumComponentGroup.custom,
    sfc: LycInput,
    key: '',
    label: '输入框',
    type: 'LycInput',
    listGroup: 'high',
    propsConfigs: [{ key: 'placeholder', label: '默认文本', selector: EnumSelectorName.input }],
};

export default {
    LycInput,
    componentConfig,
};
