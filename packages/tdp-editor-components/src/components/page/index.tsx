import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { IPageProps } from 'tdp-editor-types/src/interface/app/components';
import {
    EnumComponentGroup,
    EnumComponentType,
    EnumEventName,
    EnumEventType,
    EnumPropsValueType,
} from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import Page from './page.vue';

export default Page;

export const register: registerComponentFunc = function () {
    const page: IDesignerComponent<IPageProps> = {
        key: '',
        label: '页面',
        icons: 'manage_page',
        group: EnumComponentGroup.page,
        type: EnumComponentType.page,
        showInList: false,
        getDefaultProps: () => {
            return {
                title: {
                    type: EnumPropsValueType.string,
                    value: '可以输入页面标题',
                },
            };
        },
        cssConfigs: ['width'],
        propsConfigs: [
            {
                key: 'title',
                label: '页面标题',
                selector: EnumSelectorName.input,
            },
        ],
        eventConfigs: [{ eventName: EnumEventName.click, eventTypes: [EnumEventType.script] }],
    };
    return page;
};
