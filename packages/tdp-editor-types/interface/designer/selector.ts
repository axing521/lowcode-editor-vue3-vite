import type { EnumPropsValueType } from '../../enum/components';
import type { IDesignerComponent, IPropsConfig } from '.';

// 选择器渲染方法定义
export interface ISelectorRender<
    P = unknown,
    O extends ISelectorBaseOptions = ISelectorBaseOptions
> {
    element: IDesignerComponent;
    props: IPropsConfig<P>;
    options: O;
}

export interface ISelectorBaseOptions {
    showParamsModal?: (propKey: string, propValueType: EnumPropsValueType) => void;
}

// 拖动选择器选项定义
export interface ISliderSelectorOptions extends ISelectorBaseOptions {
    max?: number;
    min?: number;
}

// 下拉选择器选项定义
export interface ISelectSelectorOptions extends ISelectorBaseOptions {
    items: { key: string; label: string }[];
}
