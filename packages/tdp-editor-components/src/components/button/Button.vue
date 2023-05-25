<template>
    <a-button
        class="fd-button"
        :id="allProps.state.key"
        v-bind="allProps.props"
        :style="allProps.css"
        v-on="eventsMap"
    >
        {{ allProps.props.text || '按钮' }}
    </a-button>
</template>
<script lang="ts" setup>
import { defineComponent } from 'vue';
import type { ICompBaseProps } from 'tdp-editor-types/src/interface/app/components';
import type { IButtonProps } from './interface';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { useBaseEvents, useBaseLifecycle } from '../../composables/base';

// 接收prop
const allProps = defineProps<ICompBaseProps<IButtonProps>>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
// 获取事件对象
const { eventsMap } = useBaseEvents(allProps, () => ({
    click: {
        text: allProps.props.text,
    },
}));
</script>
<script lang="ts">
export default defineComponent({
    name: EnumComponentType.button,
});
</script>
<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-button {
    position: relative;
}
.@{prefixName}-button.large {
    height: @button-large-height;
    line-height: @button-large-height;
}
.@{prefixName}-button.mini {
    height: @button-mini-height;
    line-height: @button-mini-height;
}
</style>
