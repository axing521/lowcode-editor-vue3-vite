import { isReactive } from 'vue';
import type { IAppVarConstructor, IAppVarJson } from 'tdp-editor-types/src/interface/app/vars';
import {
    EnumAppVarDataType,
    EnumAppVarScope,
    EnumAppVarType,
} from 'tdp-editor-types/src/enum/app/vars';
import { $getUUID } from '../utils';

const NumberRegx = /^[+-]?\d*[.]?\d*$/gi;
// 根据数据获取数据类型
export const getDataTypeByInputData = (data: string) => {
    const stringRegx = /^\\"(.+)\\"$/gi;
    if (stringRegx.test(data)) {
        return EnumAppVarDataType.String;
    }
    const filterData = data.replace(stringRegx, '$1');
    if (filterData === 'true' || filterData === 'false') {
        return EnumAppVarDataType.Boolean;
    } else if (/^\[.+]$/gi.test(filterData)) {
        return EnumAppVarDataType.Array;
    } else if (NumberRegx.test(filterData)) {
        return EnumAppVarDataType.Number;
    } else if (/^\{.+}$/gi.test(filterData)) {
        return EnumAppVarDataType.Json;
    } else {
        return EnumAppVarDataType.String;
    }
};

// 根据数据获取数据类型
export const getDataTypeByData = (data: unknown) => {
    if (typeof data === 'boolean') {
        return EnumAppVarDataType.Boolean;
    } else if (data instanceof Array) {
        return EnumAppVarDataType.Array;
    } else if (typeof data === 'number') {
        return EnumAppVarDataType.Number;
    } else if (typeof data === 'object') {
        return EnumAppVarDataType.Json;
    } else {
        return EnumAppVarDataType.String;
    }
};

export default class AppVar {
    #_key: string;
    #_name: string;
    #_type: EnumAppVarType;
    #_pageKey: string;
    #_scope: EnumAppVarScope;
    #_initData: unknown;
    #_dataType: EnumAppVarDataType;
    // private data: any;
    error: any = null;
    constructor(obj: IAppVarConstructor) {
        this.#_scope = obj.scope || EnumAppVarScope.Page;
        this.#_key = obj.key || `${this.#_scope}_${$getUUID()}`;
        this.#_name = obj.name || 'varName';
        this.#_type = obj.type || EnumAppVarType.Normal;
        this.#_pageKey = obj.pageKey || '';
        this.#_dataType = EnumAppVarDataType.String;
        this.setInitData(obj.data === undefined ? '' : obj.data);
        // this.setData(this.#_initData);
    }

    /**
     * 反序列化变量对象，用于读取json文件数据，初始化变量对象
     */
    static Deserialize(varJson: IAppVarJson) {
        return new AppVar({
            key: varJson.key,
            name: varJson.name,
            data: varJson.initData,
            type: varJson.type,
            scope: varJson.scope,
            pageKey: varJson.pageKey,
        });
    }

    // 所有暴露的可读属性
    get name() {
        return this.#_name;
    }

    get key() {
        return this.#_key;
    }

    get scope() {
        return this.#_scope;
    }

    get dataType() {
        return this.#_dataType;
    }

    get type() {
        return this.#_type;
    }

    get pageKey() {
        return this.#_pageKey;
    }

    get initData() {
        return this.#_initData;
    }

    // 用户通过code编辑器写入data
    // setInputData(value: string) {
    //     const _dataType = getDataTypeByInputData(value);
    //     if (_dataType === EnumAppVarDataType.Number) {
    //         this.data = Number(value);
    //     } else {
    //         this.data = eval('(' + value + ')');
    //     }
    //     this.#_dataType = _dataType;
    // }

    // 通过js变量写入data
    // setData(data: unknown) {
    //     if (typeof data === 'object' || Array.isArray(data)) {
    //         this.data = JSON.parse(JSON.stringify(data));
    //     } else {
    //         this.data = data;
    //     }
    //     this.#_dataType = getDataTypeByData(data);
    // }

    getCloneInitData() {
        if (isReactive(this.#_initData)) {
            return this.#_initData;
        } else if (typeof this.#_initData === 'object' || Array.isArray(this.#_initData)) {
            return JSON.parse(JSON.stringify(this.#_initData));
        } else {
            return this.#_initData;
        }
    }

    setInitData(data: unknown) {
        if (isReactive(data)) {
            this.#_initData = data;
        } else if (typeof data === 'object' || Array.isArray(data)) {
            this.#_initData = JSON.parse(JSON.stringify(data));
        } else {
            this.#_initData = data;
        }
        this.#_dataType = getDataTypeByData(data);
    }

    /**
     * 序列化变量，转变为可存储的json结构
     */
    Serialize(): IAppVarJson {
        const result: IAppVarJson = {
            key: this.#_key,
            name: this.#_name,
            type: this.#_type,
            scope: this.#_scope,
            initData: this.#_initData,
        };
        if (this.#_scope === EnumAppVarScope.Page) {
            result.pageKey = this.pageKey;
        }
        return result;
    }
}
