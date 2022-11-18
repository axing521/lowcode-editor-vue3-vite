import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { TSelector } from 'tdp-editor-types/interface/designer/selector';
// 遍历所有组件信息
const allSelectors = import.meta.globEager('./*Selector.tsx');
const propSelectors: TSelector[] = [];

// 自动加载propSelector
for (const key in allSelectors) {
    const module = allSelectors[key];
    const selectorName = module.name as EnumSelectorName;
    const selectorRender = module.render;
    const keys = Object.values(EnumSelectorName);
    if (selectorName && keys.includes(selectorName) && selectorRender) {
        propSelectors.push({
            name: selectorName,
            render: selectorRender,
        });
    }
}
export default propSelectors;
