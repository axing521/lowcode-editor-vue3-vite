import type { EnumAppMode } from '../../enum';
import type { IDesignerComponent } from '../designer';
import type { IPageForm } from '../designer/pageForm';

// page Module对象定义
export interface IPageStore extends IDesignerComponent {
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
    globalVars: Record<string, any>; // { 变量名：变量值 }
    pageVars: Record<string, Record<string, any>>; // { 页面名: { 变量名：变量值 } }
}

export interface IEditorStore {
    // selectedPageComponentList: IDesignerComponent[]; // 当前页面所有组件列表
    selectedComponent?: IDesignerComponent; // 当前页面所选择的组件
    dragComponent?: IDesignerComponent;
    componentList: IDesignerComponent[]; // 所有组件列表，用于左侧拖动面板展示
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
