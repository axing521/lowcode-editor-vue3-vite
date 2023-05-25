import type { EnumComponentType } from '../../enum/components';
export type TDatasourceScope = 'page' | 'app';
export interface IDataSource<I = any> {
    key: string;
    name: string;
    scope: TDatasourceScope;
    enable: boolean; // 是否启用
    pageKey?: string;
    desc?: string;
    sourceType: TSourceType; // 数据源类型
    input: IDataSourceInput<I>;
    output: IDataSourceOutput;
}

export type TSourceType = 'url' | 'apiRepo' | 'dataModeler' | 'dataFlow';
export interface IDataSourceInputUrl {
    url: string;
    method: 'post' | 'get' | 'delete' | 'put';
    queryString?: { key: string; value: string }[];
    payload?: {
        field: string;
        type: 'string' | 'number' | 'file';
        value: string;
    }[];
}
export interface IDataSourceInput<T> {
    config: T;
}
type TFieldMappingItem = {
    dsField: string;
    resField: string;
};
export interface IDataSourceOutput {
    compType: EnumComponentType | 'basic';
    fieldMapping: TFieldMappingItem[];
}
