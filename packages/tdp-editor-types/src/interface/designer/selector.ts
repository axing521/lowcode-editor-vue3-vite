import type { DefineComponent, Component } from 'vue';
import type { IDesignerComponent, IPropsConfig } from '.';
import type { EnumSelectorName } from '../../enum/designer';
import type { TCssStyleName } from '../app/components';

// Selector对象定义
export type TSelector = {
    name: EnumSelectorName | string;
    render: Component;
    type?: 'tsx' | 'vue';
};
// css Selector对象定义
export type TCssSelector = { name: TCssStyleName | string; render: DefineComponent };
// 选择器渲染方法定义
export type TSelectorRender<P = unknown, O extends ISelectorBaseOptions = ISelectorBaseOptions> = (
    element: IDesignerComponent,
    prop: IPropsConfig<P>,
    options: O
) => JSX.Element;

export interface ISelectorBaseOptions {
    defaultValue: unknown;
}

// 拖动选择器选项定义
export interface ISelectorSliderOptions extends ISelectorBaseOptions {
    max?: number;
    min?: number;
}

// 下拉选择器选项定义
export interface ISelectorSelectOptions extends ISelectorBaseOptions {
    items: { key: string; label: string }[];
}
