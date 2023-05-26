<template>
    <a-rate class="fd-rate" v-bind="allProps.props" v-on="eventsMap"></a-rate>
</template>

<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-rate {
    position: relative;
}
</style>

<script lang="ts">
export default defineComponent({
    name: EnumComponentType.rate,
});
</script>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import type { ICompBaseProps } from 'tdp-editor-types/src/interface/app/components';
import type { IRateProps, IRateState } from './interface';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { useBaseLifecycle, useBaseEvents } from '../../composables/base';

const allProps = defineProps<ICompBaseProps<IRateProps, IRateState>>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
// 注册事件
const { eventsMap } = useBaseEvents(allProps);
</script>
