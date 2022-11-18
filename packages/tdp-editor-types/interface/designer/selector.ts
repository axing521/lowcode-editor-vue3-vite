import type { DefineComponent } from 'vue';
import type { EnumPropsValueType } from '../../enum/components';
import type { IDesignerComponent, IPropsConfig } from '.';
import type { EnumCssProerty, EnumSelectorName } from '../../enum/designer';

// Selector对象定义
export type TSelector = { name: EnumSelectorName | string; render: TSelectorRender };
// css Selector对象定义
export type TCssSelector = { name: EnumCssProerty | string; render: DefineComponent };
// 选择器渲染方法定义
export type TSelectorRender<P = unknown, O extends ISelectorBaseOptions = ISelectorBaseOptions> = (
    element: IDesignerComponent,
    prop: IPropsConfig<P>,
    options: O
) => JSX.Element;

export interface ISelectorBaseOptions {
    showParamsModal?: (propKey: string, propValueType: EnumPropsValueType) => void;
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
