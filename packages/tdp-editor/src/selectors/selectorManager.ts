import type { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { TSelectorRender, TSelector } from 'tdp-editor-types/interface/designer/selector';

type TSelectorMapKey = EnumSelectorName | string;

/**
 * 选择器管理
 */
export default class SelectorManager {
    private readonly selectorMap: Map<TSelectorMapKey, TSelectorRender> = new Map();
    constructor(selectors?: TSelector[]) {
        this.addSelectors(selectors);
    }

    /**
     * 获得选择器
     * @param name 选择器名字
     * @returns 返回对应的选择器或者undefined
     */
    getSelector(name: TSelectorMapKey) {
        return this.selectorMap.get(name);
    }
    /**
     * 添加选择器
     * @param selectors 要添加的选择器
     */
    addSelectors(selectors?: TSelector[]) {
        if (selectors) {
            selectors.forEach(s => {
                if (this.selectorMap.has(s.name)) {
                    console.warn(`selector '${s.name}' allready exits`);
                } else {
                    this.selectorMap.set(s.name, s.render);
                }
            });
        }
    }
}
