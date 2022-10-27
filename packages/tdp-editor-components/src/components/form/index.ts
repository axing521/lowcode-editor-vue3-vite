import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/enum/components';
import { EnumPropsSelector } from 'tdp-editor-types/enum/designer';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/interface/designer';
import './form.less';
import type { IFormProps } from './interface';

import Form from './formRenderer.vue';

export default Form;

export const register: registerComponentFunc = function () {
    const form: IDesignerComponent<IFormProps> = {
        key: '',
        code: '',
        label: '表单',
        icon: 'form',
        group: EnumComponentGroup.layout,
        type: EnumComponentType.form,
        isFormer: true,
        order: 200,
        list: [],
        propsConfigs: [
            { key: 'name', label: '表单名', selector: EnumPropsSelector.input },
            { key: 'topTitle', label: 'title上方显示', selector: EnumPropsSelector.switch },
        ],
    };
    return form;
};
