import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type {
    IDataSource,
    IDataSourceInputUrl,
} from 'tdp-editor-types/src/interface/app/datasource';
import type { IFetchAsyncResult } from 'tdp-editor-types/src/interface/request';

import { useAppStore } from '../stores/appStore';
import { $error, $log, $warn } from '../utils';
import { $fetch } from '../request';

type TTriggerDatasourceResult = {
    success: boolean;
    data: any;
};

// 存放数据源配置
const allDatasource: IDataSource[] = [];
// 缓存当前页面数据源
let currentPageDSDirty = true;
let currentPageDSCache: IDataSource[] = [];
// 缓存全局数据源
let globalDSDirty = true;
let globalDSCache: IDataSource[] = [];

document.addEventListener('dblclick', function () {
    $log(222, currentPageDSCache);
    $log(333, allDatasource);
});

const getResFieldValue = (response: IFetchAsyncResult<any>, expression: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = response;
        return eval(expression);
    } catch {
        return undefined;
    }
};

export default class DatasourceController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }

    initDS(datasourceList: IDataSource[]) {
        datasourceList.forEach(c => {
            if (c.scope === 'app') {
                this.add(c, true);
            } else {
                allDatasource.push(c);
            }
        });
        this.getGlobalDSList();
        this.getCurrentPageDS();
    }

    /**
     * 重置指定页面的页面变量
     * @param pageKey
     */
    resetTargetPageDS(pageKey: string) {
        const dsList = allDatasource.filter(c => c.scope === 'page' && c.pageKey === pageKey);
        this.resetCurrentPageDS(dsList);
    }

    /**
     * 重置当前页面变量
     * @param pageDS 要重置的变量集合
     */
    resetCurrentPageDS(pageDS: IDataSource[]) {
        this.clearCurrentPageDS();
        currentPageDSDirty = false;
        const appStore = useAppStore(this.$pinia);
        pageDS.forEach(c => {
            currentPageDSCache.push(c);
            this.triggerDatasource(c).then(res => {
                if (res.success) {
                    appStore.currentPageDS[c.key] = res.data;
                } else {
                    appStore.currentPageDS[c.key] = this.getDatasourceDefaultValue(c);
                }
            });
        });
    }

    /**
     * 触发数据源
     * @param datasourceKey 数据源对象Key
     */
    async triggerDatasourceByKey(datasourceKey: string) {
        const ds = this.getDSByKey(datasourceKey);
        if (ds.item) {
            return await this.triggerDatasource(ds.item);
        } else {
            return {
                success: false,
                data: null,
            } as TTriggerDatasourceResult;
        }
    }

    /**
     * 触发数据源
     * @param datasource 数据源对象
     */
    async triggerDatasource(datasource: IDataSource) {
        if (datasource.sourceType === 'url') {
            return await this.triggerUrlDatasource(datasource);
        }
        return {
            success: false,
            data: null,
        } as TTriggerDatasourceResult;
    }

    /**
     * 触发url类型的数据源
     * @param datasource 数据源对象
     */
    async triggerUrlDatasource(datasource: IDataSource<IDataSourceInputUrl>) {
        const result: TTriggerDatasourceResult = {
            success: false,
            data: null,
        };
        if (!datasource.enable) return result;
        const inputConfig = datasource.input.config;
        const res = await $fetch({
            url: inputConfig.url,
            method: inputConfig.method,
            data:
                Array.isArray(inputConfig.payload) &&
                inputConfig.payload.map(c => ({
                    [c.field]: c.value,
                })),
        });

        if (res.success) {
            result.success = true;
            result.data = {};
            datasource.output.fieldMapping.forEach(field => {
                result.data[field.dsField] = getResFieldValue(res.data, field.resField);
            });
            $log(`${datasource.name} -> ${inputConfig.url} 请求成功`, res, result);
        } else {
            $warn('url datasource发送请求失败', res.error);
        }
        return result;
    }

    /**
     * 获取数据源默认数据
     * @param datasource 数据源对象
     * @returns 返回默认数据json对象
     */
    getDatasourceDefaultValue(datasource: IDataSource) {
        const result: any = {};
        if (datasource.output.fieldMapping && datasource.output.fieldMapping.length) {
            datasource.output.fieldMapping.forEach(field => {
                result[field.dsField] = '';
            });
        }
        return result;
    }

    // 获取当前页面下所有的页面数据源
    getCurrentPageDS(): Record<string, any> | undefined {
        return useAppStore(this.$pinia).currentPageDS;
    }

    getGlobalDS(): Record<string, any> {
        return useAppStore(this.$pinia).globalDS;
    }

    /**
     * 获取当前页面下所有的页面数据源
     * @returns 当前页面下所有的页面数据源
     */
    getCurrentPageDSList(): IDataSource[] {
        if (currentPageDSDirty) {
            const appStore = useAppStore(this.$pinia);
            const pageKey = appStore.activePage?.key;
            currentPageDSCache = allDatasource.filter(c => c.pageKey === pageKey);
            currentPageDSDirty = false;
        }
        return currentPageDSCache;
    }

    /**
     * 获取全局数据源
     * @returns 全局数据源
     */
    getGlobalDSList(): IDataSource[] {
        if (globalDSDirty) {
            globalDSCache = allDatasource.filter(c => c.scope === 'app');
            globalDSDirty = false;
        }
        return globalDSCache;
    }

    /**
     * 根据数据源key获取某个数据源
     * @param dsKey 数据源key
     */
    getDSByKey(dsKey: string) {
        const result = {
            index: -1,
            item: undefined as IDataSource | undefined,
        };
        // 非空校验
        if (dsKey) {
            result.index = allDatasource.findIndex(c => c.key === dsKey);
            if (result.index >= 0) {
                result.item = allDatasource[result.index];
                return result;
            }
        }
        return result;
    }

    /**
     * 查找数据源数据
     * @param datasourceKey 数据源key
     * @returns 数据源对应的数据
     */
    getDatasourceStore(datasourceKey: string) {
        if (!datasourceKey) return undefined;
        const appStore = useAppStore(this.$pinia);
        const globalDSList = this.getGlobalDSList();
        if (globalDSList.findIndex(c => c.key === datasourceKey) > -1) {
            return appStore.globalDS[datasourceKey];
        }
        const pageDSList = this.getCurrentPageDSList();
        if (pageDSList.findIndex(c => c.key === datasourceKey) > -1) {
            return appStore.currentPageDS[datasourceKey];
        }
        return undefined;
    }

    /**
     * 添加数据源，传入数据源的具体信息
     * @param dsJson 数据源信息
     * @param cover 是否覆盖已有数据源
     * @returns 返回创建数据源结果
     */
    add(dsJson: IDataSource, cover = false) {
        const appStore = useAppStore(this.$pinia);
        const result = {
            success: false,
            msg: 'vars.newDialog.errorCreate',
        };
        if (!dsJson.pageKey && dsJson.scope === 'page') {
            dsJson.pageKey = appStore.activePage?.key || '';
        }
        // 添加全局变量
        if (dsJson.scope === 'app') {
            if (!globalDSCache.some(c => c.name === dsJson.name) || cover) {
                allDatasource.push(dsJson);
                appStore.globalDS[dsJson.key] = {};
                globalDSDirty = true;
                result.success = true;
            } else {
                $error(`数据源： ${dsJson.name} 已存在，不能重复添加`);
                result.msg = '数据源已存在，不能重复添加';
                return result;
            }
        } else if (dsJson.scope === 'page') {
            // 添加页面变量
            if (dsJson.pageKey === appStore.activePage?.key) {
                // 如果变量已经存在，则不能添加
                if (currentPageDSCache.some(c => c.name === dsJson.name) && !cover) {
                    $error(`数据源： ${dsJson.name} 已存在，不能重复添加`);
                    result.msg = '数据源已存在，不能重复添加';
                    return result;
                }
                // 添加变量
                else {
                    allDatasource.push(dsJson);
                    appStore.currentPageDS[dsJson.key] = {};
                    currentPageDSDirty = true;
                }
                result.success = true;
            }
        }
        return result;
    }

    /**
     * 更新一个数据源
     * @param dsJson 数据源对象
     */
    update(dsJson: IDataSource) {
        const ds = this.getDSByKey(dsJson.key);
        if (ds.item) {
            allDatasource[ds.index] = dsJson;
            if (ds.item.scope === 'app') {
                globalDSDirty = true;
            } else {
                currentPageDSDirty = true;
            }
        }
    }

    /**
     * 根据数据源key删除某个数据源
     * @param dsKey 数据源key
     */
    removeDSByKey(dsKey: string) {
        const result = {
            success: false,
            removeIndex: -1,
            msg: '',
        };
        // 非空校验
        if (dsKey) {
            // 判断是 全局变量 还是 页面变量
            result.removeIndex = allDatasource.findIndex(c => c.key === dsKey);
            if (result.removeIndex >= 0) {
                if (allDatasource[result.removeIndex].scope === 'app') {
                    globalDSDirty = true;
                } else {
                    currentPageDSDirty = true;
                }
                allDatasource.splice(result.removeIndex, 1);
                result.success = true;
                return result;
            }
        } else {
            result.success = false;
            result.msg = '删除失败';
        }
    }

    /**
     * 清空当前页面变量
     */
    clearCurrentPageDS() {
        const appStore = useAppStore(this.$pinia);
        currentPageDSCache = [];
        currentPageDSDirty = true;
        for (const key in appStore.currentPageDS) {
            delete appStore.currentPageDS[key];
        }
    }

    /**
     * 返回序列化后的数据源集合
     */
    SerializeDatasourceList() {
        return allDatasource;
    }
}
