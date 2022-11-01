import type { ComponentPublicInstance } from 'vue';
import type { EnumHttpMethod } from '../../enum';
import type {
    EnumComponentType,
    EnumComponentGroup,
    EnumApiType,
    EnumEventType,
    EnumPropsValueType,
} from '../../enum/components';
import type { IFormInfo } from './form';

// setup中公共部分props的定义
export interface ISetupBaseProps {
    state: IComponentState;
    parentId: string;
}

/* form组件基础属性定义 */
export interface IBaseFormItemProps {
    label: string;
    show?: boolean;
    visibility?: boolean;
    dense?: boolean;
    disabled?: boolean;
    value?: any;
}
export type IComponentProps<P> = {
    [key in keyof P]: {
        value: P[key];
        type: EnumPropsValueType;
    };
};
export interface IComponentCommonProps<P = any, C = Record<string, string | undefined>> {
    state: IComponentState<P>;
    parentId: string;
    props: P;
    css: C;
    events: Record<string, any>;
}
export interface IComponentState<P = any, C = Record<string, string | undefined>> {
    key: string;
    code: string /* 别名，一般用于用户给组件定义，方便调用 */;
    type: EnumComponentType | string;
    group: EnumComponentGroup;
    list?: IComponentState[];
    apis?: IComponentApi[];
    props?: IComponentProps<P>;
    formInfo?: IFormInfo;
    isFormer?: boolean; // 是否属于form组件
    css?: C;
    styleText?: string;
    events?: IComponentEvent[];
}

export interface IComponentApi {
    name: string;
    path: string;
    method: EnumHttpMethod;
    type: EnumApiType;
}

export interface IComponentEvent {
    eventType: EnumEventType;
    funcName: string;
    funcStr: string;
}

export type IComponentEventFunction = ($event: Event, component: ComponentPublicInstance) => void;
