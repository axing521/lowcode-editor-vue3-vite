import { EnumCssProerty } from 'tdp-editor-types/enum/designer';
import type { TCssSelector } from 'tdp-editor-types/interface/designer/selector';
// 遍历所有组件信息
const allSelectors = import.meta.globEager('./*Selector.(tsx|vue)');
const cssSelectors: TCssSelector[] = [];

// 自动加载propSelector
for (const key in allSelectors) {
    const module = allSelectors[key];
    if (!module.default) continue;
    const _vue = module.default;
    const selectorName = module.name as EnumCssProerty;
    const selectorRender = _vue;
    const keys = Object.values(EnumCssProerty);
    if (selectorName && keys.includes(selectorName) && selectorRender) {
        cssSelectors.push({
            name: selectorName,
            render: selectorRender,
        });
    }
}
export default cssSelectors;
