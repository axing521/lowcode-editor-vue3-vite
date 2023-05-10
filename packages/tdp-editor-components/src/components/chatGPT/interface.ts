import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
export interface IChatGPTState extends IComponentState<IChatGPTProps> {
    type: EnumComponentType.chatGPT;
}

export interface IChatGPTProps {
    apiKey?: string;
    proxy?: string;
    gptModel?: 'gpt-4' | 'gpt-4-0314' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301' | '';
    theme?: boolean; //true: dark, false: light
    enableContext?: boolean; //true: enable, false: disable
}
