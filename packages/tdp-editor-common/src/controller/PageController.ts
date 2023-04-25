import type { App, ComponentPublicInstance } from 'vue';
import type { Pinia } from 'pinia';
import type { IComponentCommonProps } from 'tdp-editor-types/src/interface/app/components';
import { utils } from '..';

export default class PageController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    // 当前页面所有函数集合
    private readonly pageFunctions = new Map<string, Function>();
    // 当前页面所有组件的实例集合
    private readonly componentsMap = new Map<
        string,
        ComponentPublicInstance<IComponentCommonProps>
    >();
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

    /**
     * 获取当前页面的函数Map集合
     * @returns 返回map
     */
    getPageFunctionMap() {
        return this.pageFunctions;
    }

    /**
     * 向当前页面添加组件实例
     * @param key 组件key
     * @param componentInstance 组件实例
     */
    addComponent(key: string, componentInstance: ComponentPublicInstance) {
        this.componentsMap.set(key, componentInstance as any);
    }

    /**
     * 删除当前页面添加组件实例
     * @param key 组件key
     */
    deleteComponent(key: string) {
        this.componentsMap.delete(key);
    }

    /**
     * 获取当前页面添加组件实例
     * @param key 组件key
     * @returns 返回组件实例
     */
    getComponentByKey(key: string) {
        return this.componentsMap.get(key);
    }

    /**
     * 获取实例集合map
     * @returns 返回map
     */
    getComponentsMap() {
        return this.componentsMap;
    }
}
