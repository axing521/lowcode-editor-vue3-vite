export interface IDataSource {
    key: string;
    name: string;
    enable: boolean; // 是否启用
    des?: string;
    detail: IDataSourceDetail;
}

export interface IDataSourceDetail {
    url: string;
    method: string;
    queryString?: string;
    payload?: any;
}
