import type { EnumAppVarType, EnumAppVarScope } from '../../enum/app/vars';

type IAppVarValue = any;
export interface IAppVarConstructor {
    key?: string;
    name: string;
    scope: EnumAppVarScope;
    data: IAppVarValue;
    type: EnumAppVarType;
    pageKey?: string;
}

export interface IAppVarJson {
    key: string;
    name: string;
    type: EnumAppVarType;
    scope: EnumAppVarScope;
    initData: IAppVarValue;
    pageKey?: string;
}
