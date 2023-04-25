import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
export interface IChatGPTState extends IComponentState<IChatGPTProps> {
    type: EnumComponentType.chatGPT;
}

export interface IChatGPTProps {
    apiKey?: string;
    proxy?: string;
    gptModel?: string;
    theme?: boolean; //true: dark, false: light
    enableContext?: boolean; //true: enable, false: disable
}

/* 
interface IChatGPTState {
    type: EnumComponentType.chatGPT;

    props?: IComponentProps<P>;  // 索引签名
            {
                [key in keyof P]: {
                    value: P[key];
                    type: EnumPropsValueType;
                };
            }
            ==
            {
                apiKey?: string;
                proxy?: string;
                gptModel?: string;
                theme?: boolean;    //true: dark, false: light
                enableContext?: boolean;    //true: enable, false: disable
            }

    key: string;
    label: string;  // 页面显示名称
    name?: string;  // 别名，一般用于用户给组件定义，方便调用
    type: EnumComponentType | string;
    group: EnumComponentGroup;
    list?: IComponentState[];
    apis?: IComponentApi[];
    formInfo?: IFormInfo;
    isFormer?: boolean; // 是否属于form组件
    css?: C;    // C是传入的泛型
    styles?: string; // 自定义样式, 存放在page 的state中
    classNames?: string[]; // 组件的自定义样式名
    events?: IComponentEvent[];
}
 */
