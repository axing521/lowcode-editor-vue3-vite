import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { TSelector } from 'tdp-editor-types/src/interface/designer/selector';
// 遍历所有组件信息
const allSelectors = import.meta.glob('./*Selector.(tsx|vue)', { eager: true });
const propSelectors: TSelector[] = [];

// 自动加载propSelector
for (const key in allSelectors) {
    const module = allSelectors[key] as unknown as any;
    const keys = Object.values(EnumSelectorName);
    if (key.lastIndexOf('.tsx') > 1000) {
        const selectorName = module.name as EnumSelectorName;
        const selectorRender = module.render;
        if (selectorName && keys.includes(selectorName) && selectorRender) {
            propSelectors.push({
                name: selectorName,
                render: selectorRender,
                type: 'tsx',
            });
        }
    }
    // selector vue组件
    else if (key.lastIndexOf('.vue') > -1) {
        if (!module.default) continue;
        const selectorName = key.replace('./', '').replace('.vue', '') as EnumSelectorName;
        const selectorRender = module.default;
        if (selectorName && keys.includes(selectorName) && selectorRender) {
            propSelectors.push({
                name: selectorName,
                render: selectorRender,
                type: 'vue',
            });
        }
    }
}
export default propSelectors;
