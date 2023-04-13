import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { IAppVarConstructor } from 'tdp-editor-types/src/interface/app/vars';
import AppVar from './AppVar';
import { EnumAppVarScope } from 'tdp-editor-types/src/enum/app/vars';
import { useAppStore } from '../stores/appStore';
import { $error, $log } from '../utils';

// 创建两个map，存放变量实例
const GlobalVarMap: Map<string, AppVar> = new Map();
const currentPageVarMap: Map<string, AppVar> = new Map();

export default class AppVarController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }

    /**
     * 添加变量，传入变量的具体信息
     * @param {} param0
     */
    addVar(varJson: IAppVarConstructor) {
        const appStore = useAppStore();
        const result = {
            success: false,
            msg: 'vars.newDialog.errorCreate',
            instance: null as AppVar | null,
        };
        if (!varJson.pageKey && varJson.scope === EnumAppVarScope.Page) {
            varJson.pageKey = appStore.activePage?.key || '';
        }
        const varInstance = new AppVar(varJson);
        const addResult = this.addVarInstance(varInstance);
        result.success = addResult.success;
        result.msg = addResult.msg;
        result.instance = varInstance;
        return result;
    }

    /**
     * 添加变量
     * @param {*} varInstance 被添加的变量对象
     */
    addVarInstance(varInstance: AppVar) {
        const appStore = useAppStore();
        const addResult = {
            success: false,
            msg: 'vars.newDialog.errorCreate',
        };
        // 添加全局变量
        if (varInstance.scope === EnumAppVarScope.Global) {
            if (!appStore.globalVars[varInstance.name]) {
                appStore.globalVars[varInstance.name] = varInstance.getCloneInitData();
                GlobalVarMap.set(varInstance.name, varInstance);
                addResult.success = true;
            } else {
                $error(`${varInstance.name}变量已存在，不能重复添加`);
                addResult.msg = '变量已存在，不能重复添加';
                return addResult;
            }
        } else if (varInstance.scope === EnumAppVarScope.Page) {
            // 添加页面变量
            const activePageId = varInstance.pageKey || appStore.activePage?.key;
            if (activePageId) {
                const pageVars = appStore.currentPageVars;
                // 如果变量已经存在，则不能添加
                if (pageVars[varInstance.name]) {
                    $error(`${varInstance.name}变量已存在，不能重复添加`);
                    addResult.msg = '变量已存在，不能重复添加';
                    return addResult;
                }
                // 添加变量
                else {
                    currentPageVarMap.set(varInstance.name, varInstance);
                    appStore.currentPageVars[varInstance.name] = varInstance.getCloneInitData();
                }
                addResult.success = true;
            }
        }
        addResult.success = true;
        return addResult;
    }

    // 根据name查找变量
    getVarByName(name: string) {
        let _var: any = undefined;
        // 先查找全局变量
        const appStore = useAppStore();
        _var = appStore.globalVars[name];
        if (_var) return _var;
        // 再查找页面变量
        _var = appStore.currentPageVars[name];
        if (_var) return _var;
        return undefined;
    }

    // 根据name查找变量实例
    getVarInstanceByName(name: string) {
        let _var: AppVar | undefined = undefined;
        // 先查找全局变量
        _var = GlobalVarMap.get(name);
        if (_var) return _var;
        // 再查找页面变量
        _var = currentPageVarMap.get(name);
        if (_var) return _var;
        return _var;
    }

    // 获取当前页面下所有的页面变量
    getCurrentPageVars(): Record<string, any> | undefined {
        return useAppStore().currentPageVars;
    }

    getGlobalVars(): Record<string, any> {
        return useAppStore().globalVars;
    }

    /**
     * 根据变量name删除某个变量
     * @param name 变量的key
     */
    removeVarByName(name: string) {
        const varInstance = this.getVarInstanceByName(name);
        return this.removeVarByInstance(varInstance);
    }

    /**
     * 根据变量实例删除某个变量
     * @param varInstance 变量实例
     */
    removeVarByInstance(varInstance: AppVar | undefined | null) {
        const result = {
            success: false,
            msg: '',
        };
        const appStore = useAppStore();
        // 非空校验
        if (varInstance instanceof AppVar) {
            // 判断是 全局变量 还是 页面变量
            if (varInstance.scope === EnumAppVarScope.Global) {
                if (!GlobalVarMap.has(varInstance.key)) return;
                delete appStore.globalVars[varInstance.name];
                GlobalVarMap.delete(varInstance.name);
            } else if (varInstance.scope === EnumAppVarScope.Page) {
                if (!currentPageVarMap.has(varInstance.key)) return;
                delete appStore.currentPageVars[varInstance.name];
                currentPageVarMap.delete(varInstance.key);
            }
        } else {
            result.success = false;
            result.msg = '删除失败';
        }
        result.success = true;
        return result;
    }

    /**
     * 返回序列化后的全局变量集合
     */
    SerializeGlobalVars() {
        const result: Record<string, any> = {};
        GlobalVarMap.forEach((value, key) => {
            result[key] = value.Serialize();
        });
        $log('%c %s', 'color: green', 'SerializeGlobalVars --------->', result);
        return result;
    }

    /**
     * 返回序列化后的当前页面变量集合
     */
    SerializeCurrentPageVars() {
        const result: Record<string, any> = {};
        currentPageVarMap.forEach((value, key) => {
            result[key] = value.Serialize();
        });
        $log('%c %s', 'color: green', 'SerializeCurrentPageVars --------->', result);
        return result;
    }
}
