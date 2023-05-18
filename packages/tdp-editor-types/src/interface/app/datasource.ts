import type { EnumComponentType } from '../../enum/components';

export interface IDataSource<I = any> {
    key: string;
    name: string;
    enable: boolean; // 是否启用
    des?: string;
    sourceType: TSourceType; // 数据源类型
    input: IDataSourceInput<I>;
    output: IDataSourceOutput;
}

export type TSourceType = 'url' | 'apiRepo' | 'dataModeler' | 'dataFlow';
export interface IDataSourceInputUrl {
    url: string;
    method: string;
    queryString?: string;
    payload?: any;
}
export interface IDataSourceInput<T> {
    config: T;
}
export interface IDataSourceOutput {
    compType: EnumComponentType[];
}
