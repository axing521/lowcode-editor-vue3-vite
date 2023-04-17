import type { ComponentPublicInstance } from 'vue';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';

import { propsFactory, cssFactory } from 'tdp-editor-common/src';
export default class FdComponent {
    constructor(key: string, componentInstance: ComponentPublicInstance | undefined) {
        this.$key = key;
        // @ts-ignore
        this.$$ref = componentInstance;
        if (componentInstance && componentInstance.$props) {
            this.$state = (componentInstance.$props as any).state as IComponentState;
        }
    }
    readonly $key?: string;
    readonly $state?: IComponentState;
    readonly $$ref?: ComponentPublicInstance;
    // 获取组件属性
    public getProps = (name: string): any => {
        if (this.$$ref && this.$state) {
            return propsFactory.getPropsValue<any, string>(this.$state, name) || '';
        } else {
            return '';
        }
    };
    // 设置组件属性
    public setProps = (name: string, value: any): void => {
        if (this.$$ref && this.$state) {
            propsFactory.setPropsValue<any, string>(this.$state, name, value);
        }
    };
    // 获取组件属性
    public getCss = (name: TCssStyleName): string => {
        if (this.$$ref && this.$state) {
            return cssFactory.getCssValue(this.$state, name) || '';
        } else {
            return '';
        }
    };
    // 设置组件属性
    public setCss = (name: TCssStyleName, value: string): void => {
        if (this.$$ref && this.$state) {
            cssFactory.setCssValue(this.$state, name, value);
        }
    };
}
