import { warn } from 'vue';
import type { App } from 'vue';
import type { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { TSelector, TCssSelector } from 'tdp-editor-types/src/interface/designer/selector';

type TSelectorMapKey = EnumSelectorName | string;
type TCssSelectorMapKey = keyof CSSStyleDeclaration;

/**
 * 选择器管理
 */
export default class SelectorManager {
    private readonly selectorMap: Map<TSelectorMapKey, TSelector> = new Map();
    private readonly cssSelectorMap: Map<TCssSelectorMapKey, TCssSelector> = new Map();
    private readonly app: App;
    constructor(app: App, selectors?: TSelector[], cssSelectors?: TCssSelector[]) {
        this.app = app;
        this.addSelectors(selectors);
        this.addCssSelectors(cssSelectors);
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
    /**
     * 添加css选择器
     * @param selectors 要添加的选择器
     */
    addCssSelectors(selectors?: TCssSelector[]) {
        if (selectors) {
            selectors.forEach(s => {
                if (this.cssSelectorMap.has(s.name as any)) {
                    warn(`selector '${s.name}' allready exits`);
                } else {
                    this.cssSelectorMap.set(s.name as any, s);
                    this.app.component(s.name as any, s.render);
                }
            });
        }
    }
}
