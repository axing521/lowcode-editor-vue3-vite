import type { TCssSelector } from 'tdp-editor-types/src/interface/designer/selector';
// 遍历所有组件信息
const allSelectors = import.meta.glob('./*Selector.vue', { eager: true });
const _cssSelectors: TCssSelector[] = [];
// 自动加载cssSelector
for (const key in allSelectors) {
    const module = allSelectors[key] as unknown as any;
    if (!module.default) continue;
    const _vue = module.default;
    const selectorRender = _vue;
    const selectorName = _vue.name as string;

    if (selectorName && selectorName.includes('selector') && selectorRender) {
        _cssSelectors.push({
            name: selectorName,
            render: selectorRender,
        });
    }
}
export const cssSelectorMap = {
    backgroundColor: { selector: 'css-color-selector', label: '背景色' },
    color: { selector: 'css-color-selector', label: '颜色' },
    display: { selector: 'css-display-selector', label: '显示' },
    height: { selector: 'css-size-selector', label: '高度' },
    position: { selector: 'css-position-selector', label: '定位' },
    textAlign: { selector: 'css-align-selector', label: '文本对齐' },
    width: { selector: 'css-size-selector', label: '宽度' },
    flex: { selector: 'css-flex-selector', label: '弹性布局' },
} as Record<
    keyof CSSStyleDeclaration,
    {
        selector: string;
        label: string;
    }
>;
export const cssSelectors = _cssSelectors;
