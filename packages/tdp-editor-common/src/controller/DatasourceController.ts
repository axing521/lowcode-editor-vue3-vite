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

// 创建两个map，存放数据源配置
const globalDS: IDataSource[] = [];
const currentPageDS: IDataSource[] = [];
const allPageDS: IDataSource[] = [];

document.addEventListener('dblclick', function () {
    $log(111, globalDS);
    $log(222, currentPageDS);
    $log(333, allPageDS);
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

    initDS(_globalDS: IDataSource[], _pageDS: IDataSource[]) {
        globalDS.splice(0, globalDS.length);
        currentPageDS.splice(0, currentPageDS.length);
        allPageDS.splice(0, allPageDS.length);
        _globalDS.forEach(c => {
            this.add(c, true);
        });
        _pageDS.forEach(c => {
            allPageDS.push(c);
        });
    }

    /**
     * 重置指定页面的页面变量
     * @param pageKey
     */
    resetTargetPageDS(pageKey: string) {
        const pageVars = allPageDS.filter(c => c.pageKey === pageKey);
        this.resetCurrentPageDS(pageVars);
    }

    /**
     * 重置当前页面变量
     * @param pageDS 要重置的变量集合
     */
    resetCurrentPageDS(pageDS: IDataSource[]) {
        this.clearCurrentPageDS();
        const appStore = useAppStore(this.$pinia);
        pageDS.forEach(c => {
            currentPageDS.push(c);
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
            if (!globalDS.some(c => c.key === dsJson.key) || cover) {
                globalDS.push(dsJson);
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
                if (currentPageDS.some(c => c.key === dsJson.key) && !cover) {
                    $error(`数据源： ${dsJson.name} 已存在，不能重复添加`);
                    result.msg = '数据源已存在，不能重复添加';
                    return result;
                }
                // 添加变量
                else {
                    currentPageDS.push(dsJson);
                    allPageDS.push(dsJson);
                    appStore.currentPageDS[dsJson.key] = this.getDatasourceDefaultValue(dsJson);
                }
                result.success = true;
            }
        }
        return result;
    }

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

    // 获取当前页面下所有的页面数据源
    getCurrentPageDSList(): IDataSource[] {
        return currentPageDS;
    }

    getGlobalDSLIst(): IDataSource[] {
        return globalDS;
    }

    /**
     * 根据数据源key删除某个数据源
     * @param dsKey 数据源key
     */
    removeDSByKey(dsKey: string) {
        const result = {
            success: false,
            msg: '',
        };
        // 非空校验
        if (dsKey) {
            // 判断是 全局变量 还是 页面变量
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
    clearCurrentPageDS() {
        const appStore = useAppStore(this.$pinia);
        currentPageDS.splice(0, currentPageDS.length);
        for (const key in appStore.currentPageDS) {
            delete appStore.currentPageDS[key];
        }
    }

    /**
     * 返回序列化后的全局变量集合
     */
    SerializeGlobalDS() {
        return globalDS;
    }

    /**
     * 返回序列化后的当前页面变量集合
     */
    SerializeAllPageDS() {
        return allPageDS;
    }
}
