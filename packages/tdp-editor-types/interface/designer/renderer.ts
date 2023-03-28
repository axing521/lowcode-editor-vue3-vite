import type { VNode } from 'vue';
import type { IComponentState } from '../components';

export type factoryRenderFunc = (
    createElement: any,
    element?: IComponentState
) => VNode | undefined;
export type componentRenderFunc = (
    createElement: any,
    element: IComponentState,
    factory: factoryRenderFunc
) => VNode | undefined;
