import type { EnumAppMode } from '../../enum';
import type { IPageProps } from '../components/page';
import type { IDesignerComponent } from '../designer';
import type { IPageForm } from '../designer/pageForm';

// page Module对象定义
export interface IPageStoreState extends IDesignerComponent<IPageProps> {
    submitState: 'unsaved' | 'saved' | 'submited';
    selected?: boolean;
}

// App Module对象定义
export interface IAppStoreState {
    mode: EnumAppMode;
    pages: IPageStoreState[]; // 所有页面
    pageForms: Map<string, IPageForm>;
    activePage?: IPageStoreState; // 当前显示页面
}

export interface IEditorStoreState {
    // selectedPageComponentList: IDesignerComponent[]; // 当前页面所有组件列表
    selectedComponent?: IDesignerComponent; // 当前页面所选择的组件
    dragComponent?: IDesignerComponent;
    componentList: IDesignerComponent[]; // 所有组件列表，用于左侧拖动面板展示
}

export interface IMenus {
    level: number;
    key: string;
    title: string;
    icon?: string;
    list?: IMenus[];
    selected?: boolean;
}
export interface ILeftMenuStoreState {
    menus: IMenus[];
    selectedMenuId: string;
}
