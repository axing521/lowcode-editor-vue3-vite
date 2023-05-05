import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { IFormProps } from './interface';
import Form from './Form.vue';

export default Form;

export const register: registerComponentFunc = function () {
    const form: IDesignerComponent<IFormProps> = {
        key: '',
        label: '表单',
        icons: 'form',
        group: EnumComponentGroup.layout,
        type: EnumComponentType.form,
        order: 200,
        list: [],
        propsConfigs: [
            { key: 'name', label: '表单名', selector: EnumSelectorName.input },
            { key: 'topTitle', label: 'title上方显示', selector: EnumSelectorName.switch },
        ],
    };
    return form;
};
