<template>
    <a-rate class="fd-rate" v-bind="allProps.props"></a-rate>
</template>

<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-rate {
    position: relative;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/enum/components';
import { useBaseLifecycle } from '../../composables/base';

export default defineComponent({
    name: EnumComponentType.rate,
});
</script>

<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import type { IRateProps } from './interface';
const allProps = defineProps<{
    state: IComponentState<IRateProps>;
    parentId: string;
    props: IRateProps;
    css: Record<string, any>;
}>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
</script>
