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
