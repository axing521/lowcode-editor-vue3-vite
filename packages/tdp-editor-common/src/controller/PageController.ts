/**
 * 封装页面级别的交互逻辑
 * 例如页面初始化、获取页面方法、向当前页面添加删除组件map关系等
 */
import type { App, ComponentPublicInstance } from 'vue';
import type { Pinia } from 'pinia';
import type { IComponentCommonProps } from 'tdp-editor-types/src/interface/app/components';
import { $createPageFunction, $createDynamicStyle, $iniPageScript, $log } from '../utils';
import { useVarControler } from './index';
import { useAppStore } from '../stores/appStore';

export default class PageController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    // 当前页面所有函数集合
    private readonly pageFunctions = new Map<string, Function>();
    // 当前页面所有组件的实例集合
    private readonly componentsMap = new WeakMap<
        HTMLElement,
        ComponentPublicInstance<IComponentCommonProps>
    >();
    // 测试组件是否释放
    private readonly testMap = new WeakMap<ComponentPublicInstance, HTMLElement | string>();
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
        document.addEventListener('dblclick', () => {
            $log('testMap', this.testMap);
            $log('componentsMap', this.componentsMap);
        });
    }

    /**
     * 初始化函数
     * @param functionStr 用户定义的函数字符串
     */
    initFunctions(functionStr: string) {
        const functions = $createPageFunction(functionStr);
        this.pageFunctions.clear();
        functions.forEach(func => {
            this.pageFunctions.set(func.name, func);
        });
    }

    /**
     * 初始化脚本
     * @param pageKey 页面key
     * @param script 用户定义的脚本字符串
     */
    initScript(pageKey: string, script: string) {
        const startTime = Date.now();
        $log('初始化脚本开始', startTime);
        const scriptSet = $iniPageScript(script);
        const appStore = useAppStore(this.$pinia);
        const varController = useVarControler(this.$app);

        // 清理之前的页面函数
        this.pageFunctions.clear();
        // 清理之前的页面变量
        varController.clearCurrentPageVar();
        // 保存用户自定义函数
        scriptSet.functions.forEach(func => {
            this.pageFunctions.set(func.name, func);
        });
        // 保存用户自定义变量
        scriptSet.responsiveVars.forEach(v => {
            appStore.currentPageVars[v.varKey] = v.varValue;
        });

        const endTime = Date.now();
        $log('初始化脚本结束', endTime);
        $log(
            `共用时 ${endTime - startTime} ms`,
            this.pageFunctions,
            varController.getCurrentPageVars()
        );
    }

    /**
     * 初始化页面样式
     * @param pageKey 页面key
     * @param styleStr 样式内容
     */
    initStyle(pageKey: string, styleStr: string) {
        $createDynamicStyle(pageKey, styleStr);
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
        const el = document.getElementById(key);
        if (el) {
            this.componentsMap.set(el, componentInstance as any);
            this.testMap.set(componentInstance, el);
        } else {
            this.testMap.set(componentInstance, key);
        }
    }

    /**
     * 删除当前页面添加组件实例
     * @param key 组件key
     */
    deleteComponent(key: string) {
        const el = document.getElementById(key);
        if (el) {
            this.componentsMap.delete(el);
        }
    }

    /**
     * 获取当前页面添加组件实例
     * @param key 组件key
     * @returns 返回组件实例
     */
    getComponentByKey(key: string) {
        const el = document.getElementById(key);
        if (el) {
            return this.componentsMap.get(el);
        }
        return undefined;
    }
}
