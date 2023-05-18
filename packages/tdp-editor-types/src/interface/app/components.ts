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
    parentId?: string;
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
        bindValue?: string;
    };
};
export interface IComponentCommonProps<P = any, C = Record<string, string | undefined>> {
    state: IComponentState<P>;
    parentId: string;
    props: P;
    css: C;
}
export type TCssStyleName = keyof CSSStyleDeclaration;
export interface IComponentState<P = any, C = any> {
    key: string;
    name?: string /* 别名，一般用于用户给组件定义，方便调用 */;
    type: EnumComponentType | string;
    group: EnumComponentGroup;
    list?: IComponentState[];
    apis?: IComponentApi[];
    props?: IComponentProps<P>;
    formInfo?: IFormInfo;
    isForm?: boolean; // 是否属于form组件
    css?: C;
    classNames?: string[]; // 组件的自定义样式名
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
    eventId: string;
    eventName: EnumEventName;
    eventType: EnumEventType;
    funcName?: string;
    funcStr?: string;
}

// 将IComponentEvent处理后的事件对象
export type TEventsMapRaw = Record<EnumEventName, TEventFunc[]>;

// 将TEventsMapRaw处理后的事件对象，可直接绑定到组件v-on属性上
export type TEventsMap = Record<EnumEventName, ($event: any) => void>;

// 组件事件函数第一个参数
export type TEventFuncParam1 = {
    $g: Record<string, any>; // 全局变量
    $p?: Record<string, any>; // 当前页面变量
    comp: ComponentPublicInstance | null; // 触发当前事件的组件实例
    e?: any; // 原始事件对象
    data?: Record<string, any>; // 扩展属性
};
type TEventFuncThis = {
    $g: Record<string, any>;
    $p?: Record<string, any>;
    $event: {
        e: any;
        instance: ComponentPublicInstance | null;
        data?: Record<string, any>;
    };
};
export type TEventFunc = (this: TEventFuncThis, $event?: TEventFuncParam1) => void;

// 页面的state，因为页面状态可能提供外部开发者，所以放到interface项目中
export interface IPageState extends IComponentState<IPageProps> {
    type: EnumComponentType.page;
    label?: string /* 页面显示名称 */;
    styles?: string; // 自定义样式, 存放在page 的state中
    script?: string; // 自定义脚本, 存放在page 的state中
    vars?: string; // 页面变量
    datasource?: string;
}

export interface IPageProps {
    title?: string;
}
