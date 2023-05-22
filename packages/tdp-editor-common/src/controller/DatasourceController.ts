import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { IDataSource } from 'tdp-editor-types/src/interface/app/datasource';

import { useAppStore } from '../stores/appStore';
import { $error } from '../utils';

// 创建两个map，存放数据源配置
const globalDS: IDataSource[] = [];
const currentPageDS: IDataSource[] = [];
const allPageDS: IDataSource[] = [];

export default class DatasourceController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
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
            const activePageId = dsJson.pageKey || appStore.activePage?.key;
            if (activePageId) {
                // 如果变量已经存在，则不能添加
                if (currentPageDS.some(c => c.key === dsJson.key) && !cover) {
                    $error(`数据源： ${dsJson.name} 已存在，不能重复添加`);
                    result.msg = '数据源已存在，不能重复添加';
                    return result;
                }
                // 添加变量
                else {
                    currentPageDS.push(dsJson);
                    appStore.currentPageDS[dsJson.key] = {};
                }
                result.success = true;
            }
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
