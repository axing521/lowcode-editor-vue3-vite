import { warn } from 'vue';
import type { App } from 'vue';
import type { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { TSelector } from 'tdp-editor-types/src/interface/designer/selector';

type TSelectorMapKey = EnumSelectorName | string;

/**
 * 选择器管理
 */
export default class SelectorManager {
    private readonly selectorMap: Map<TSelectorMapKey, TSelector> = new Map();
    private readonly app: App;
    constructor(app: App, selectors?: TSelector[]) {
        this.app = app;
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
                    warn(`selector '${s.name}' allready exits`);
                } else {
                    this.selectorMap.set(s.name, s);
                    this.app.component(s.name, s.render);
                }
            });
        }
    }
}
