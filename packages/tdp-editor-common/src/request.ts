import axios from 'axios';
import type {
    IAxiosAsyncResult,
    IFetchOptions,
    IFetchAsyncResult,
} from 'tdp-editor-types/src/interface/request';

import { EnumContentTypeValue, EnumRequestHeadersKey } from 'tdp-editor-types/src/enum/request';
import { $warn } from './utils';

/**
 * fetch请求，并处理返回数据
 * @param options 请求参数
 * @returns 返回处理过的结构数据
 */
export const $fetch = async <DATA = any>(options: IFetchOptions) => {
    const result: IFetchAsyncResult<DATA> = {
        code: 500,
        data: {} as DATA,
        success: false,
        timestamp: 0,
    };
    const response = await _fetch<DATA>(options);
    if (response.success) {
        result.success = true;
        result.code = response.httpStatus;
        result.data = response.body.data;
        result.timestamp = response.body.timestamp;
    } else {
        // @ts-ignore
        result.code = response.httpStatus;
        result.timestamp = Date.now();
    }
    return result;
};

/**
 * fetch请求，返回原始数据
 * @param options 请求参数
 * @returns 返回接口返回的原始数据
 */
export const _fetch = async <DATA = any>(options: IFetchOptions) => {
    const result: IAxiosAsyncResult<DATA> = {
        success: false,
        httpStatus: 500,
        body: { code: '500', data: {} as DATA, timestamp: 0, success: false },
        headers: undefined,
        error: undefined,
    };
    const headers = $getBaseHeaders(options.headers);
    // formData的请求数据处理
    if (options.postType === 'form-data') {
        headers[EnumRequestHeadersKey.contentType] = EnumContentTypeValue.formData;
        options.transformRequest = [
            data => {
                return $parseUrlParmas(data);
            },
        ];
    } else if (options.postType === 'json') {
        headers[EnumRequestHeadersKey.contentType] = EnumContentTypeValue.json;
    }
    options.headers = headers;
    return await axios(options)
        .then(res => {
            result.success = true;
            result.httpStatus = res.status;
            result.body = {
                code: res.status,
                data: res.data,
                success: true,
                timestamp: Date.now(),
            };
            result.headers = res.headers;
            return result;
        })
        .catch(error => {
            const errorLog = '接口：[  ' + options.url + '  ]报错了：';
            $warn('%c %s', 'color: red', errorLog, error);
            result.success = false;
            result.httpStatus = (error.response && error.response.status) || 500;
            result.headers = error.response && error.response.headers;
            result.error = error;
            return result;
        });
};

/**
 * 格式化json对象为a=1&b=2的格式
 * @param urlParams json对象
 * @returns {string}
 */
export const $parseUrlParmas = (urlParams: any) => {
    if (!urlParams || typeof urlParams !== 'object') {
        return '';
    }
    const keys = Object.keys(urlParams);
    if (keys.length === 0) {
        return '';
    }

    let result = '';
    keys.forEach(key => {
        if (!urlParams[key] && typeof urlParams[key] !== 'number') {
            delete urlParams[key];
        } else {
            result += `&${key}=${encodeURIComponent(urlParams[key])}`;
        }
    });
    result = result.replace('&', '');
    return result;
};

export const $getBaseHeaders = (headers = {}) => {
    const more: any = {
        tenantId: '25',
    };
    if (headers) {
        return Object.assign({}, headers, more);
    } else {
        return more;
    }
};
