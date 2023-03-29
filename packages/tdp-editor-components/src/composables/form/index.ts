import { getCurrentInstance, onBeforeUnmount, computed } from 'vue';
import formFactory from 'tdp-editor-utils/factory/formFactory';
import type { IFieldCallbackRule } from 'tdp-editor-types/interface/app/form';
import type { ISetupBaseProps } from 'tdp-editor-types/interface/app/components';
import useFormInject from './formInject';

export { default as useFormInject } from './formInject';

function useFormIndex(props: ISetupBaseProps) {
    const injects = useFormInject();
    // 创建组件时，添加对应的field字段
    const $fields = injects.getFormFields();
    const internalInstance = getCurrentInstance();
    if (internalInstance && internalInstance.proxy) {
        $fields.push({
            key: props.state.key,
            name: props.state.code,
            type: props.state.type as any,
            state: props.state,
            instance: internalInstance.proxy,
            rules: [],
        });
    }
    // 销毁前
    onBeforeUnmount(() => {
        // 销毁前，删除对应的field字段
        const $fields = injects.getFormFields();
        const index = $fields.findIndex(field => field.key === props.state.key);
        if (index > -1) {
            $fields.splice(index, 1);
        }
    });

    // 计算属性
    const fieldRules = computed<IFieldCallbackRule[]>(() => {
        if (!props.state.formInfo) return [];
        return formFactory.formatRules(props.state.formInfo!.rules);
    });

    // // watch
    // watch(props.state.formInfo!, (value: string, oldValue: string) => {
    //     const $fields = injects.$getFormFields();
    //     for (let index = 0; index < $fields.length; index++) {
    //         const field = $fields[index];
    //         if (field.key === props.state.key) {
    //             field.name = value;
    //             break;
    //         }
    //     }
    // });
    return {
        // inject属性
        ...injects,
        // 计算属性
        fieldRules,
    };
}

export const useForm = useFormIndex;
