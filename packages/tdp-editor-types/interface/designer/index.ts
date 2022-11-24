import type { VNode } from 'vue';
import type { IComponentProps, IComponentState } from '../components';
import type { EnumCssProerty, EnumSelectorName } from '../../enum/designer';
import type { EnumPropsValueType } from '../../enum/components';

// 设计模式下组件的属性
export interface IDesignerComponent<P = any, C = Record<string, string>>
    extends IComponentState<P, C> {
    sfc?: any;
    order?: number;
    icons?: string;
    listGroup?: 'normal' | 'business' | 'high';
    propsConfigs?: IPropsConfig<P>[];
    cssConfigs?: EnumCssProerty[];
    showInList?: boolean;
    getDefaultProps?: () => IComponentProps<P>;
    getDefaultCss?: () => C;
}

export type propsValueType<P> = P[keyof P] | undefined | null;

// 属性渲染工厂定义
export interface IPropsRenderFactory {
    getPropsValue: <P, K extends keyof P>(
        state: IComponentState<P>,
        propertyName: K
    ) => P[K] | undefined;
    setPropsValue: <P, K extends keyof P>(
        state: IComponentState<P>,
        propertyName: K,
        value: P[K] | unknown | undefined,
        type?: EnumPropsValueType
    ) => void;
    pushPropsValue: <P, K extends keyof P>(
        state: IComponentState<P>,
        propertyName: K,
        value: any
    ) => void;
    removePropsValue: <P, K extends keyof P>(
        state: IComponentState<P>,
        propertyName: K,
        index: number
    ) => void;
    formatProps: <P>(
        props: IComponentProps<P>,
        getExpression: (expression: any) => any,
        getFunction: (value: string) => Function
    ) => P;
}

// 属性选择器render函数定义
export type IPropsSelectorRender<P> = (
    state: IDesignerComponent<P>,
    propsFactory: IPropsRenderFactory
) => VNode;

// 需要给selector传递参数的对象
export type IPropsSelectorObj<O = {}> = {
    name: EnumSelectorName;
    options?: O;
};
export type propsSelectorType<P> = EnumSelectorName | IPropsSelectorRender<P> | IPropsSelectorObj;

// 属性配置定义
export type IPropsConfig<P = any> = {
    key: keyof P;
    label: string;
    selector: propsSelectorType<P> | propsSelectorType<P>[];
};

export type registerComponentFunc<P = any> = () => IDesignerComponent<P> | IDesignerComponent<P>[];
