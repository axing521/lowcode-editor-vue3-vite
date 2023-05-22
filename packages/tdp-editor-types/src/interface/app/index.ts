import type { IComponentState } from './components';
import type { IDataSource } from './datasource';
import type { IAppVarJson } from './vars';

type TLayoutItem = {
    show: boolean;
    content: IComponentState;
};

// 应用保存时的数据结构
export interface IAppSaveStruct {
    defaultPageKey: string;
    pages: IComponentState[];
    layout?: {
        headers: TLayoutItem[];
        footers: TLayoutItem[];
        lefts: TLayoutItem[];
        rights: TLayoutItem[];
    };
    globalVars?: IAppVarJson[];
    pageVars?: IAppVarJson[];
    globalDS?: IDataSource[];
    pageDS?: IDataSource[];
}
