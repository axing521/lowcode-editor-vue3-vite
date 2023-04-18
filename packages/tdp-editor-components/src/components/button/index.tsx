import { defineAsyncComponent } from 'vue';
import {
    EnumComponentGroup,
    EnumComponentType,
    EnumEventName,
    EnumEventType,
    EnumPropsValueType,
} from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { IButtonProps } from './interface';

import type { ISelectorSelectOptions } from 'tdp-editor-types/src/interface/designer/selector';

export default defineAsyncComponent(() => {
    return import('./buttonRenderer.vue');
});

export const register: registerComponentFunc = function () {
    const button: IDesignerComponent<IButtonProps> = {
        key: '',
        label: '按钮',
        icons: 'button',
        group: EnumComponentGroup.form,
        type: EnumComponentType.button,
        order: 302,
        cssConfigs: ['width', 'display'],
        getDefaultProps: () => {
            return {
                text: {
                    type: EnumPropsValueType.string,
                    value: '按钮',
                },
                htmlType: {
                    type: EnumPropsValueType.string,
                    value: 'button',
                },
            };
        },
        propsConfigs: [
            {
                key: 'text',
                label: '按钮文本',
                selector: EnumSelectorName.input,
            },
            {
                key: 'ccc',
                label: 'ccc',
                selector: EnumSelectorName.input,
            },
            {
                key: 'ghost',
                label: '幽灵模式',
                selector: EnumSelectorName.switch,
            },
            {
                key: 'abc',
                label: 'abc',
                selector: EnumSelectorName.arrayData,
            },
            {
                key: 'bbc',
                label: 'bbc',
                selector: EnumSelectorName.bindData,
            },
            {
                key: 'type',
                label: '按钮类型',
                selector: {
                    name: EnumSelectorName.select,
                    options: {
                        items: [
                            { key: '', label: '默认' },
                            { key: 'primary', label: 'primary' },
                            { key: 'dashed', label: 'dashed' },
                            { key: 'danger', label: 'danger' },
                            { key: 'link', label: 'link' },
                        ],
                    } as ISelectorSelectOptions,
                },
            },
            {
                key: 'htmlType',
                label: '属性类型',
                selector: {
                    name: EnumSelectorName.select,
                    options: {
                        items: [
                            { key: '', label: '请选择' },
                            { key: 'submit', label: '提交按钮' },
                            { key: 'button', label: '普通按钮' },
                        ],
                    } as ISelectorSelectOptions,
                },
            },
        ],
        eventConfigs: [{ eventName: EnumEventName.click, eventTypes: [EnumEventType.script] }],
    };
    return button;
};
