import type { ComponentPublicInstance } from 'vue';
import type { EnumHttpMethod } from '../../enum';
import type {
    EnumComponentType,
    EnumComponentGroup,
    EnumApiType,
    EnumEventName,
    EnumPropsValueType,
    EnumEventType,
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
    label: string /* 页面显示名称 */;
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

// 组件的事件描述对象
export interface IComponentEvent {
    eventName: EnumEventName;
    eventType: EnumEventType;
    funcName: string;
    funcStr: string;
}

// 将IComponentEvent处理后的事件对象
export type TEventsMapRaw = Map<
    EnumEventName,
    {
        func: TEventFunc;
        eventType: EnumEventType;
        funcName: string;
    }[]
>;

// 将TEventsMapRaw处理后的事件对象，可直接绑定到组件v-on属性上
export type TEventsMap = Map<EnumEventName, TEventFunc[]>;

export type TEventFunc = ($event: any, $info: Record<string, any>) => void;

export type IComponentEventFunction = ($event: Event, component: ComponentPublicInstance) => void;
