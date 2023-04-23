import type { App } from 'vue';
import type { Pinia } from 'pinia';
import { utils } from '..';

export default class PageController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    private readonly pageFunctions = new Map<string, Function>();
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }

    /**
     * 初始化函数
     * @param functionStr 用户定义的函数字符串
     */
    initFunctions(functionStr: string) {
        const functions = utils.$createPageFunction(functionStr);
        this.pageFunctions.clear();
        functions.forEach(func => {
            this.pageFunctions.set(func.name, func);
        });
    }

    /**
     * 初始化页面样式
     * @param pageKey 页面key
     * @param styleStr 样式内容
     */
    initStyle(pageKey: string, styleStr: string) {
        utils.$createDynamicStyle(pageKey, styleStr);
    }

    /**
     * 根据方法名获取页面方法
     * @param funcName 方法名
     * @returns 返回页面方法
     */
    getFunctionByName(funcName: string) {
        return this.pageFunctions.get(funcName);
    }

    getPageFunctionMap() {
        return this.pageFunctions;
    }
}
