import { customRef, reactive } from 'vue';
import type { Ref } from 'vue';
import type { IPropsRenderFactory } from 'tdp-editor-types/src/interface/designer';
import type {
    IComponentProps,
    IComponentState,
} from 'tdp-editor-types/src/interface/app/components';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/src/enum/components';

const PropsFactory: IPropsRenderFactory = {
    getPropsValue: (state, propertyName) => {
        if (state && state.props) {
            if (state.props[propertyName]) {
                return state.props[propertyName].value;
            } else {
                return undefined;
            }
        }
        return undefined;
    },
    setPropsValue: (state, propertyName, value, type = EnumPropsValueType.string) => {
        if (state && propertyName) {
            // 如果原本没有props集合
            if (!state.props) {
                state.props = {
                    [propertyName]: {
                        type,
                        value,
                    },
                } as unknown as IComponentProps<any>;
            }
            // 有props集合，但是没有当前属性
            else if (!state.props[propertyName]) {
                state.props[propertyName] = {
                    value: value as any,
                    type,
                };
            }
            // 之前设置过当前属性
            else if (state.props[propertyName]) {
                state.props[propertyName].value = value as any;
                state.props[propertyName].type = type;
            }
        }
    },
    // 数组数据，添加数据
    pushPropsValue: (state, propertyName, value) => {
        if (state) {
            if (state.props) {
                // 如果已经有数据，直接push
                if (state.props[propertyName]) {
                    // @ts-ignore
                    state.props[propertyName].value.push(value);
                } else {
                    // @ts-ignore
                    state.props[propertyName] = {
                        value: [value],
                        type: EnumPropsValueType.array,
                    };
                }
            } else {
                // @ts-ignore
                state.props = {
                    [propertyName]: {
                        value: [value],
                        selector: EnumSelectorName.select,
                    },
                };
            }
        }
    },
    // 数组数据，删除数据
    removePropsValue(state, propertyName, index) {
        if (state) {
            const data = this.getPropsValue(state, propertyName) as any[] | undefined;
            if (data) {
                data.splice(index, 1);
            }
        }
    },
    formatProps(props, getExpression, getFunction) {
        if (!props) return {};
        const _props = props!;
        const newProps: any = {};
        for (const key in _props) {
            const prop = _props[key];
            // 处理绑定数据
            if (prop.type === EnumPropsValueType.expression) {
                newProps[key] = getExpression(prop.bindValue);
            } else if (prop.type === EnumPropsValueType.function) {
                newProps[key] = getFunction(prop.value as any);
            } else {
                newProps[key] = prop.value;
            }
        }
        return {
            ...newProps,
        };
    },
};

/**
 * 创建组件属性的响应式变量
 * @param state 组件state
 * @param propertyName 属性名
 * @param defaultValue 默认属性，当组件本身没有此属性时创建默认值
 * @param type 属性值的类型，EnumPropsValueType
 * @returns 返回一个Ref对象
 */
export function usePropsProxy<T = unknown>(
    state: IComponentState,
    propertyName: string,
    defaultValue: T,
    type = EnumPropsValueType.string
): Ref<T> {
    const propValue = PropsFactory.getPropsValue(state, propertyName) as T;
    let value: unknown = propValue;
    if (propValue === undefined) {
        if (typeof defaultValue === 'object') {
            value = reactive(defaultValue as unknown as object);
        } else if (Array.isArray(defaultValue)) {
            value = reactive(defaultValue as T[]);
        } else {
            value = defaultValue;
        }
    }
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return value as T;
            },
            set(newValue) {
                value = newValue;
                PropsFactory.setPropsValue(state, propertyName, newValue, type);
                trigger();
            },
        };
    });
}

// 获取指定props中的属性值
export function getPropValue<P, PK extends keyof P>(state: IComponentState<P>, key: PK) {
    return PropsFactory.getPropsValue(state, key);
}

// 获取指定props中的属性值
export function setPropValue<P, PK extends keyof P>(
    state: IComponentState<P>,
    key: PK,
    value: unknown,
    type = EnumPropsValueType.string
) {
    PropsFactory.setPropsValue(state, key, value, type);
}

// 设置属性的表达式
export function setPropExpression<P, PK extends keyof P>(
    state: IComponentState<P>,
    propKey: PK,
    expression: string
) {
    if (!state) return;
    // 如果原本没有props集合
    if (!state.props) {
        state.props = {
            [propKey]: {
                type: EnumPropsValueType.expression,
                bindValue: expression,
                value: '',
            },
        } as unknown as IComponentProps<any>;
    }
    // 有props集合，但是没有当前属性
    else if (!state.props[propKey]) {
        state.props[propKey] = {
            value: '' as any,
            type: EnumPropsValueType.expression,
            bindValue: expression,
        };
    }
    // 之前设置过当前属性
    else if (state.props[propKey]) {
        state.props[propKey].bindValue = expression;
        state.props[propKey].type = EnumPropsValueType.expression;
    }
}

// 获取属性的表达式
export function getPropExpression<P, PK extends keyof P>(state: IComponentState<P>, propKey: PK) {
    if (state && state.props && state.props[propKey]) {
        return state.props[propKey].bindValue || '';
    }
    return '';
}

// 更改属性值类型
export function setPropValueType<P, PK extends keyof P>(
    state: IComponentState<P>,
    propKey: PK,
    type: EnumPropsValueType
) {
    if (!state) return;
    // 如果原本没有props集合
    if (!state.props) {
        state.props = {
            [propKey]: {
                type,
                bindValue: undefined,
            },
        } as unknown as IComponentProps<any>;
    }
    // 有props集合，但是没有当前属性
    else if (!state.props[propKey]) {
        state.props[propKey] = {
            value: undefined as any,
            type,
            bindValue: undefined,
        };
    }
    // 之前设置过当前属性
    else if (state.props[propKey]) {
        state.props[propKey].type = type;
    }
}

export default PropsFactory;
