import type { EnumAppMode } from '../../enum';
import type { IPageState } from '../app/components';
import type { IDesignerComponent } from '../designer';
// import type { IPageForm } from '../designer/pageForm';

type TLayoutItem = {
    show: boolean;
    key: string;
};
// App Module对象定义
export interface IAppStore {
    mode: EnumAppMode;
    // pageForms: Map<string, IPageForm>;
    activePage?: IPageState; // 当前显示页面
    header?: IDesignerComponent;
    leftSide?: IDesignerComponent;
    rightSide?: IDesignerComponent;
    footer?: IDesignerComponent;
    globalVars: Record<string, any>; // 全局变量集合 { 变量名：变量数据 }
    currentPageVars: Record<string, any>; // 当前页面的变量集合 { 变量名：变量数据 }
    globalDS: Record<string, any>;
    currentPageDS: Record<string, any>;
    layout: {
        header: TLayoutItem;
        footer: TLayoutItem;
        left: TLayoutItem;
        right: TLayoutItem;
    };
}

export interface IContentStore {
    pages: IPageState[]; // 所有页面
    headers: IDesignerComponent[]; // 所有头部
    lefts: IDesignerComponent[]; // 所有左侧
    rights: IDesignerComponent[]; // 所有右侧
    footers: IDesignerComponent[]; // 所有页脚
}
export type TPageEditMode = 'content' | 'css' | 'function';
type TContentStatus = {
    [key: string]: {
        submitState: 'unsaved' | 'saved' | 'submited';
    };
};
export interface IEditorStore {
    // selectedPageComponentList: IDesignerComponent[]; // 当前页面所有组件列表
    selectedComponent?: IDesignerComponent; // 当前页面所选择的组件
    dragComponent?: IDesignerComponent;
    componentList: IDesignerComponent[]; // 所有组件列表，用于左侧拖动面板展示
    pageEditMode: TPageEditMode;
    pageStatus: TContentStatus;
    headerStatus: TContentStatus;
    footerStatus: TContentStatus;
    leftStatus: TContentStatus;
    rightStatus: TContentStatus;
}

export interface IMenusStore {
    level: number;
    key: string;
    title: string;
    icon?: string;
    list?: IMenusStore[];
    selected?: boolean;
}
export interface ILeftMenuStore {
    menus: IMenusStore[];
    selectedMenuId: string;
}
