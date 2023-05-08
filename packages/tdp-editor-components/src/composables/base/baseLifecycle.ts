import type { ISetupBaseProps } from 'tdp-editor-types/src/interface/app/components';
import { onMounted, getCurrentInstance } from 'vue';
import useInject from './baseInject';

export default function useBaseLifecycle(props: ISetupBaseProps) {
    const { addComponent } = useInject();
    onMounted(() => {
        const internalInstance = getCurrentInstance();
        // 组件挂载后向页面中注册组件实例
        if (internalInstance && internalInstance.proxy) {
            addComponent(props.state.key, internalInstance.proxy);
        }
    });
}
