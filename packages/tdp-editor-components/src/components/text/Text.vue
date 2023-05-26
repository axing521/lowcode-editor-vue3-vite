<template>
    <span class="fd-text" :id="state.key" v-bind="props" :style="css" v-on="eventsMap">
        {{ props.text }}
    </span>
</template>
<script lang="ts" setup>
import { defineComponent } from 'vue';
import type { ICompBaseProps } from 'tdp-editor-types/src/interface/app/components';
import type { ITextState, ITextProps } from './interface';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { useBaseEvents, useBaseLifecycle } from '../../composables/base';

// 接收prop
const allProps = defineProps<ICompBaseProps<ITextProps, ITextState>>();
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
    name: EnumComponentType.text,
});
</script>
<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-text {
    position: relative;
    min-width: 10px;
}
</style>
