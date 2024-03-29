import type { IComponentState, TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { cssFactory } from '..';

const CssFactory = {
    // 获取css值
    getCssValue(state: IComponentState, propertyName: TCssStyleName) {
        if (state && state.css) {
            if (state.css[propertyName as TCssStyleName]) {
                return state.css[propertyName as TCssStyleName] as string;
            } else {
                return undefined;
            }
        }
        return undefined;
    },
    // 设置css属性
    setCssValue(
        state: IComponentState,
        propertyName: TCssStyleName,
        value: string | undefined
    ): void {
        if (state && propertyName) {
            if (state.css) {
                state.css[propertyName as any] = value;
            } else {
                state.css = { [propertyName]: value };
            }
        }
    },
};

export const getCss = (state: IComponentState, propertyName: TCssStyleName) => {
    return cssFactory.getCssValue(state, propertyName) as string;
};
export const setCss = (
    state: IComponentState,
    propertyName: TCssStyleName,
    value: string | undefined
) => {
    cssFactory.setCssValue(state, propertyName, value);
};

export default CssFactory;
