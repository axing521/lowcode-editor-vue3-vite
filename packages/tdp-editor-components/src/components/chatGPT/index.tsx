import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import { defineAsyncComponent } from 'vue';
import type { IChatGPTProps } from './interface';
import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';

export default defineAsyncComponent(() => import('./chatGPTRenderer.vue'));

export const register: registerComponentFunc = function () {
    const chatGPT: IDesignerComponent<IChatGPTProps> = {
        key: '',
        label: '表单',
        icons: 'chatGPT', //这一块是做什么，从哪儿拿这个icon
        group: EnumComponentGroup.layout, //这一块是做什么
        type: EnumComponentType.chatGPT,
        isFormer: true, //?
        order: 200,
        list: [],
        propsConfigs: [
            {
                key: 'apiKey',
                label: 'openAI-API-Key',
                selector: EnumSelectorName.bindData,
            },
            {
                key: 'proxy',
                label: '可以访问openAI的代理地址',
                selector: EnumSelectorName.bindData,
            },
            {
                key: 'gptModel',
                label: '选择GPT模型',
                selector: EnumSelectorName.select,
            },
            {
                key: 'theme',
                label: '设置颜色主题',
                selector: EnumSelectorName.switch,
            },
            {
                key: 'enableContext',
                label: '开启上下文功能',
                selector: EnumSelectorName.switch,
            },
        ],
    };
    return chatGPT;
};
