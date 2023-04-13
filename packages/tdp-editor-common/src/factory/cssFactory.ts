import { EnumCssProerty } from 'tdp-editor-types/src/enum/designer';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';

const CssFactory = {
    // 获取css值
    getCssValue(state: IComponentState, propertyName: EnumCssProerty) {
        if (state && propertyName === EnumCssProerty.styleText) {
            return state.styleText;
        }
        if (state && state.css) {
            if (state.css[propertyName]) {
                return state.css[propertyName];
            } else {
                return undefined;
            }
        }
        return undefined;
    },
    // 设置css属性
    setCssValue(
        state: IComponentState,
        propertyName: EnumCssProerty,
        value: string | undefined
    ): void {
        if (state && propertyName) {
            if (propertyName === EnumCssProerty.styleText) {
                state[propertyName] = value;
            } else {
                if (state.css) {
                    state.css[propertyName] = value;
                } else {
                    state.css = { [propertyName]: value };
                }
            }
        }
    },
};

export default CssFactory;
