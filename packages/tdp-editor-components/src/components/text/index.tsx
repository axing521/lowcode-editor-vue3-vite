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
import type { ITextProps } from './interface';
import Text from './Text.vue';

export default Text;

export const register: registerComponentFunc = function () {
    const button: IDesignerComponent<ITextProps> = {
        key: '',
        label: '文本',
        icons: 'Text',
        group: EnumComponentGroup.base,
        type: EnumComponentType.text,
        order: 302,
        cssConfigs: ['width', 'display', 'position', 'textAlign', 'height', 'color'],
        getDefaultProps: () => {
            return {
                text: {
                    type: EnumPropsValueType.string,
                    value: '文本',
                },
            };
        },
        propsConfigs: [
            {
                key: 'text',
                label: '文本内容',
                enableExpression: true,
                selector: EnumSelectorName.input,
            },
        ],
        eventConfigs: [
            {
                eventName: EnumEventName.click,
                eventTypes: [EnumEventType.pageFunction],
            },
        ],
    };
    return button;
};
