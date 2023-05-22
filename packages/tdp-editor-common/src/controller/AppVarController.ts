import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { IAppVarJson } from 'tdp-editor-types/src/interface/app/vars';
import { EnumAppVarScope } from 'tdp-editor-types/src/enum/app/vars';
import { useAppStore } from '../stores/appStore';
import { $error, $getUUID, $log, $warn } from '../utils';

type evalBindValueResult = {
    success: boolean;
    value: any;
    errMsg: string;
    err?: Error;
};

type evalBindValueParams = {
    expression: string;
    faildValue?: any;
    globalVars?: Record<string, any>;
    pageVars?: Record<string, any>;
    loopItem?: any;
    loopIndex?: number;
    apiData?: any;
};

// 创建两个map，存放变量实例
const globalVarMap: Map<string, IAppVarJson> = new Map();
const currentPageVarMap: Map<string, IAppVarJson> = new Map();

const allPageVars: IAppVarJson[] = [];

document.addEventListener('dblclick', function () {
    $log(111, globalVarMap);
    $log(222, currentPageVarMap);
    $log(333, allPageVars);
});

export default class AppVarController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }

    initVars(globalVars: IAppVarJson[], pageVars: IAppVarJson[]) {
        globalVarMap.clear();
        currentPageVarMap.clear();
        globalVars.forEach(c => {
            this.addVar(c, true);
        });
        pageVars.forEach(c => {
            allPageVars.push(c);
        });
    }

    /**
     * 重置指定页面的页面变量
     * @param pageKey
     */
    resetTargetPageVars(pageKey: string) {
        const pageVars = allPageVars.filter(c => c.pageKey === pageKey);
        this.resetCurrentPageVars(pageVars);
    }

    /**
     * 重置当前页面变量
     * @param pageVars 要重置的变量集合
     */
    resetCurrentPageVars(pageVars: IAppVarJson[]) {
        this.clearCurrentPageVar();
        const appStore = useAppStore(this.$pinia);
        pageVars.forEach(c => {
            currentPageVarMap.set(c.name, c);
            appStore.currentPageVars[c.name] = this.getCloneInitData(c.initData);
        });
    }

    /**
     * 添加变量
     * @param {*} varInstance 被添加的变量对象
     * @param { boolean } cover 是否覆盖已有变量
     */
    addVar(varJson: IAppVarJson, cover = false) {
        const appStore = useAppStore(this.$pinia);
        const addResult = {
            success: false,
            msg: 'vars.newDialog.errorCreate',
        };
        if (!varJson.key) {
            varJson.key = $getUUID(varJson.scope, 13);
        }
        // 添加全局变量
        if (varJson.scope === EnumAppVarScope.Global) {
            if (!appStore.globalVars[varJson.name] || cover) {
                appStore.globalVars[varJson.name] = this.getCloneInitData(varJson.initData);
                globalVarMap.set(varJson.name, varJson);
                addResult.success = true;
            } else {
                $error(`${varJson.name}变量已存在，不能重复添加`);
                addResult.msg = '变量已存在，不能重复添加';
                return addResult;
            }
        } else if (varJson.scope === EnumAppVarScope.Page) {
            if (!varJson.pageKey) {
                varJson.pageKey = appStore.activePage?.key || '';
            }
            // 添加页面变量
            if (appStore.activePage?.key === varJson.pageKey) {
                const pageVars = appStore.currentPageVars;
                // 如果变量已经存在，则不能添加
                if (pageVars[varJson.name] && !cover) {
                    $error(`${varJson.name}变量已存在，不能重复添加`);
                    addResult.msg = '变量已存在，不能重复添加';
                    return addResult;
                }
                // 添加变量
                else {
                    allPageVars.push(varJson);
                    currentPageVarMap.set(varJson.name, varJson);
                    appStore.currentPageVars[varJson.name] = this.getCloneInitData(
                        varJson.initData
                    );
                }
                addResult.success = true;
            }
        }
        addResult.success = true;
        return addResult;
    }

    getCloneInitData(initData: any) {
        if (typeof initData === 'object' || Array.isArray(initData)) {
            return JSON.parse(JSON.stringify(initData));
        } else {
            return initData;
        }
    }

    // 根据name查找变量
    getVarByName(name: string) {
        let _var: any = undefined;
        // 先查找全局变量
        const appStore = useAppStore(this.$pinia);
        _var = appStore.globalVars[name];
        if (_var) return _var;
        // 再查找页面变量
        _var = appStore.currentPageVars[name];
        if (_var) return _var;
        return undefined;
    }

    // 根据name查找变量实例
    getVarInstanceByName(name: string) {
        let _var: IAppVarJson | undefined = undefined;
        // 先查找全局变量
        _var = globalVarMap.get(name);
        if (_var) return _var;
        // 再查找页面变量
        _var = currentPageVarMap.get(name);
        if (_var) return _var;
        return _var;
    }

    // 获取当前页面下所有的页面变量
    getCurrentPageVars(): Record<string, any> | undefined {
        return useAppStore(this.$pinia).currentPageVars;
    }

    getGlobalVars(): Record<string, any> {
        return useAppStore(this.$pinia).globalVars;
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
    removeVarByInstance(varInstance: IAppVarJson | undefined | null) {
        const result = {
            success: false,
            msg: '',
        };
        const appStore = useAppStore(this.$pinia);
        // 非空校验
        if (varInstance && varInstance.key) {
            // 判断是 全局变量 还是 页面变量
            if (varInstance.scope === EnumAppVarScope.Global) {
                if (!globalVarMap.has(varInstance.key)) return;
                delete appStore.globalVars[varInstance.name];
                globalVarMap.delete(varInstance.name);
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
     * 清空当前页面变量
     */
    clearCurrentPageVar() {
        const appStore = useAppStore(this.$pinia);
        currentPageVarMap.clear();
        for (const key in appStore.currentPageVars) {
            delete appStore.currentPageVars[key];
        }
    }

    /**
     * 返回序列化后的全局变量集合
     */
    SerializeGlobalVars() {
        const result: IAppVarJson[] = [];
        globalVarMap.forEach(value => {
            result.push(value);
        });
        $log('%c %s', 'color: green', 'SerializeGlobalVars --------->', result);
        return result;
    }

    /**
     * 返回序列化后的当前页面变量集合
     */
    SerializeCurrentPageVars() {
        const result: IAppVarJson[] = [];
        currentPageVarMap.forEach(value => {
            result.push(value);
        });
        $log('%c %s', 'color: green', 'SerializeCurrentPageVars --------->', result);
        return result;
    }

    /**
     * 执行变量表达式，获得结果
     * @param expression 表达式
     * @param faildValue 表达式错误时返回的默认值，不传则返回 undefined
     * @returns
     */
    evalVarValue(params: evalBindValueParams): evalBindValueResult {
        let result: evalBindValueResult = {
            success: false,
            value: params.faildValue !== undefined ? params.faildValue : undefined,
            errMsg: '',
        };
        if (!params.expression) return result;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const $g = params.globalVars || this.getGlobalVars();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const $p = params.pageVars || this.getCurrentPageVars();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const $item = params.loopItem || {};
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const $index = params.loopIndex || 0;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const $api = params.apiData || [];
        try {
            result = {
                success: true,
                value: eval(`(${params.expression})`),
                // value: evalFn($g, $p),
                errMsg: '',
            };
        } catch (error: any) {
            $warn(`{{ ${params.expression} }} 表达式有错误`, error);
            result.errMsg = error.toString();
            result.err = error;
        }
        return result;
    }
}
