<template>
    <a-button
        class="fd-button"
        :id="allProps.state.key"
        v-bind="allProps.props"
        :style="allProps.css"
    >
        {{ allProps.props.text }}
    </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/enum/components';
import { useBaseLifecycle } from '../../composables/base';

export default defineComponent({
    name: EnumComponentType.button,
});
</script>

<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import type { IButtonProps } from './interface';

const allProps = defineProps<{
    state: IComponentState<IButtonProps>;
    parentId: string;
    props: IButtonProps;
    css: Record<string, any>;
}>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
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
