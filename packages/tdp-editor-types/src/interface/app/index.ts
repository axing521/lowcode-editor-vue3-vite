import type { IComponentState } from './components';

// 应用保存时的数据结构
export interface IAppSaveStruct {
    defaultPageKey: string;
    pages: IComponentState[];
    globarVars?: Record<string, any>;
}
