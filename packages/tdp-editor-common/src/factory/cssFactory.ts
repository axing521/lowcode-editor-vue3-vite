import type { IComponentState, TCssStyleName } from 'tdp-editor-types/src/interface/app/components';

const CssFactory = {
    // 获取css值
    getCssValue(state: IComponentState, propertyName: TCssStyleName | 'styleText') {
        if (state && propertyName === 'styleText') {
            return state.styleText as string;
        }
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
        propertyName: TCssStyleName | 'styleText',
        value: string | undefined
    ): void {
        if (state && propertyName) {
            if (propertyName === 'styleText') {
                state['styleText'] = value;
            } else {
                if (state.css) {
                    state.css[propertyName as any] = value;
                } else {
                    state.css = { [propertyName]: value };
                }
            }
        }
    },
};

export default CssFactory;
