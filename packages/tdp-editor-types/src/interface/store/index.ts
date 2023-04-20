import type { EnumAppMode } from '../../enum';
import type { IPageState } from '../app/components';
import type { IDesignerComponent } from '../designer';
import type { IPageForm } from '../designer/pageForm';

// page Module对象定义
export interface IPageStore extends IPageState {
    submitState: 'unsaved' | 'saved' | 'submited';
    selected?: boolean;
}

// App Module对象定义
export interface IAppStore {
    mode: EnumAppMode;
    pages: IPageStore[]; // 所有页面
    pageForms: Map<string, IPageForm>;
    activePage?: IPageStore; // 当前显示页面
    header?: IDesignerComponent;
    leftSide?: IDesignerComponent;
    rightSide?: IDesignerComponent;
    footer?: IDesignerComponent;
    globalVars: Record<string, any>; // 全局变量集合 { 变量名：变量数据 }
    currentPageVars: Record<string, any>; // 当前页面的变量集合 { 变量名：变量数据 }
    currentPageFuncs: Record<string, Function>;
}
export type TPageEditMode = 'content' | 'css' | 'function';
export interface IEditorStore {
    // selectedPageComponentList: IDesignerComponent[]; // 当前页面所有组件列表
    selectedComponent?: IDesignerComponent; // 当前页面所选择的组件
    dragComponent?: IDesignerComponent;
    componentList: IDesignerComponent[]; // 所有组件列表，用于左侧拖动面板展示
    pageEditMode: TPageEditMode;
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
