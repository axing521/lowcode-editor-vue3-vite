import type { AxiosRequestConfig } from 'axios';
import type { EnumServiceResultStatus } from '../../enum/request';
//接口返回的原始数据结构
export interface IFetchAsyncResult<DATA> {
    status: EnumServiceResultStatus;
    code: string | number;
    data: DATA;
    message?: string;
    timestamp: number;
    success: boolean;
}
export interface IAxiosAsyncResult<DATA = any> extends IBaseAsyncResult<IFetchAsyncResult<DATA>> {}
// 请求返回结果结构体
export interface IBaseAsyncResult<BODY = any> {
    success: boolean;
    httpStatus: number /*http状态码*/;
    body: BODY;
    headers: any;
    error?: Error & { response: any };
}
// axios请求参数
export interface IFetchOptions extends AxiosRequestConfig {
    postType?: 'form-data' | 'json';
}

// service的返回结构
export interface IServiceResult<DATA = any> {
    status: EnumServiceResultStatus;
    message: string; // 错误信息
    data: DATA; // 处理后的数据
    code?: number | string; // http状态码
    timestamp?: number;
}
