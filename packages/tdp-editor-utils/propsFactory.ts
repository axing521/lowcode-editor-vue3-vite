import { customRef, reactive } from 'vue';
import type { Ref } from 'vue';
import type { IPropsRenderFactory } from 'tdp-editor-types/interface/designer';
import type { IComponentState } from 'tdp-editor-types/interface/components';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';

const PropsFactory: IPropsRenderFactory = {
    getPropsValue: (state, propertyName) => {
        if (state && state.props) {
            if (Object.prototype.hasOwnProperty.call(state.props, propertyName)) {
                return state.props[propertyName].value;
            } else {
                return undefined;
            }
        }
        return undefined;
    },
    setPropsValue: (state, propertyName, value, type = EnumPropsValueType.string) => {
        if (state && propertyName) {
            if (state.props) {
                // @ts-ignore
                state.props[propertyName] = {
                    type,
                    value,
                };
            } else {
                // @ts-ignore
                state.props = {
                    [propertyName]: {
                        type,
                        value,
                    },
                };
            }
        }
    },
    // 数组数据，添加数据
    pushPropsValue: (state, propertyName, value) => {
        if (state) {
            if (state.props) {
                // 如果已经有数据，直接push
                if (Object.prototype.hasOwnProperty.call(state.props, propertyName)) {
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
                newProps[key] = getExpression(prop.value);
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
    if (!propValue) {
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

export default PropsFactory;
