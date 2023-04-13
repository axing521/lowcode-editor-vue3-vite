import type { IMenusStore, ILeftMenuStore } from 'tdp-editor-types/src/interface/store';
import { defineStore } from 'pinia';

export const useLeftMenuStore = defineStore('leftMenuStore', {
    state(): ILeftMenuStore {
        return {
            menus: [
                {
                    level: 1,
                    key: 'pageList',
                    title: '页面列表',
                    icon: 'yemianguanli',
                    selected: true,
                    list: [
                        {
                            level: 2,
                            key: 'pagelist_index',
                            title: '页面列表',
                            icon: 'Parallel_Nutrients',
                            selected: true,
                        },
                        {
                            level: 2,
                            key: 'pagelist_tree',
                            title: '组件结构',
                            icon: 'Parallel_Nutrients',
                            selected: false,
                        },
                    ],
                },
                {
                    level: 1,
                    key: 'componentList',
                    title: '组件列表',
                    icon: 'zujian',
                    selected: false,
                },
            ],
            selectedMenuId: 'pageList',
        };
    },
    getters: {
        // 选中的一级菜单
        selectedMenu: state => {
            // 选中一级菜单
            const menu = state.menus.find(c => c.selected === true);
            if (menu) {
                return menu;
            } else {
                return null;
            }
        },
    },
    actions: {
        setSelectMenu(payload: { menu: IMenusStore }) {
            const menu = payload.menu;
            this.menus.forEach(c => {
                // 将当前菜单selected属性设为true
                c.selected = c.key === menu.key;
                if (c.key === menu.key) {
                    // 并修改选中id列表
                    this.selectedMenuId = menu.key;
                }
            });
        },
    },
});
