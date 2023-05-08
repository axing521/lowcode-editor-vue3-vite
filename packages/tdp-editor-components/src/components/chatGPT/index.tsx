import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import { defineAsyncComponent } from 'vue';
import type { IChatGPTProps } from './interface';
import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { ISelectorSelectOptions } from '@/tdp-editor-types/src/interface/designer/selector';

export default defineAsyncComponent(() => import('./chatGPTRenderer.vue'));

export const register: registerComponentFunc = function () {
    const chatGPT: IDesignerComponent<IChatGPTProps> = {
        key: '',
        label: 'chatGPT',
        icons: 'button',
        group: EnumComponentGroup.base,
        type: EnumComponentType.chatGPT,
        order: 200,
        list: [],
        propsConfigs: [
            {
                key: 'apiKey',
                label: 'APIKey',
                selector: EnumSelectorName.input,
            },
            {
                key: 'proxy',
                label: '代理地址',
                selector: EnumSelectorName.input,
            },
            {
                key: 'gptModel',
                label: 'GPT模型',
                selector: {
                    name: EnumSelectorName.select,
                    options: {
                        items: [
                            { key: '', label: '默认' },
                            { key: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
                            { key: 'gpt-3.5-turbo-0301', label: 'gpt-3.5-turbo-0301' },
                            { key: 'gpt-4-0314', label: 'gpt-4-0314' },
                            { key: 'gpt-4', label: 'gpt-4' },
                        ],
                    } as ISelectorSelectOptions,
                },
            },
            {
                key: 'theme',
                label: '颜色主题',
                selector: EnumSelectorName.switch,
            },
            {
                key: 'enableContext',
                label: '开启上下文',
                selector: EnumSelectorName.switch,
            },
        ],
    };
    return chatGPT;
};
