import type { TCssSelector } from 'tdp-editor-types/src/interface/designer/selector';
// 遍历所有组件信息
const allSelectors = import.meta.glob('./*Selector.(tsx|vue)', { eager: true });
const cssSelectors: TCssSelector[] = [];

// 自动加载cssSelector
for (const key in allSelectors) {
    const module = allSelectors[key] as unknown as any;
    if (!module.default) continue;
    const _vue = module.default;
    const selectorName = module.name as string;
    const selectorRender = _vue;
    if (selectorName && selectorName.includes('Selector') && selectorRender) {
        cssSelectors.push({
            name: selectorName,
            render: selectorRender,
        });
    }
}
export default cssSelectors;
