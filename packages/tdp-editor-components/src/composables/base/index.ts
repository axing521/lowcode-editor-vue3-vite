import { computed, reactive } from 'vue';
import type { ISetupBaseProps } from 'tdp-editor-types/src/interface/app/components';
import { propsFactory } from 'tdp-editor-common/src';
import { EnumAppMode } from 'tdp-editor-types/src/enum';
import useVars from './baseVars';
import useBaseInject from './baseInject';

export { default as useBaseApi } from './baseApi';
export { default as useBaseEvents } from './baseEvents';
export { default as useBaseInject } from './baseInject';
export { default as useBaseLifecycle } from './baseLifecycle';
export { default as useBaseVars } from './baseVars';
export { default as useBaseWatch } from './baseWatch';

function useBaseIndex(props: ISetupBaseProps) {
    const injects = useBaseInject();
    const { getExpression } = useVars();
    // 处理后的css
    const c_Css = computed<Record<string, string>>(() => {
        return {
            ...{
                margin: 'auto',
                padding: 'auto',
            },
            ...props.state.css,
        };
    });

    // 处理后的组件属性，返回一个reactive对象，用于动态改变组件内部属性
    const c_Props = computed<any>(() => {
        return reactive(
            propsFactory.formatProps(props.state.props!, getExpression, (() => {}) as any)
        );
    });

    // 是否设计模式
    const c_isDesignMode = computed<boolean>(() => {
        return injects.getAppMode() === EnumAppMode.design;
    });

    const c_value = computed({
        get(): string | null {
            return propsFactory.getPropsValue(props.state, 'value') || null;
        },
        set(value: any): void {
            propsFactory.setPropsValue(props.state, 'value', value);
        },
    });

    // 根据key返回包装的component对象，一般提供给代码编辑器使用
    const getComponent = (key: string) => {
        return injects.getComponentByKey(key);
    };

    return {
        // methods
        getComponent,

        // 计算属性
        c_Css,
        c_Props,
        c_isDesignMode,
        c_value,
    };
}

export const useBase = useBaseIndex;
