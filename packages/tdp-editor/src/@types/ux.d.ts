import { IComponentState } from 'tdp-editor-types/interface/app/components';

declare let $state: IComponentState;
declare let $event: Event;
declare class FdComponent {
    constructor(key: string, componentInstance: Vue | undefined);
    private readonly $key?: string;
    private readonly $state?: IComponentState;
    private readonly $$ref?: Vue;
    // 获取组件属性
    public getProps: (name: string) => any;
    // 设置组件属性
    public setProps: (name: string, value: any) => void;
    // 获取组件属性
    public getCss: (name: EnumCssProerty) => string;
    // 设置组件属性
    public setCss: (name: EnumCssProerty, value: string) => void;
}
declare let getComponent: (key: string) => FdComponent;
