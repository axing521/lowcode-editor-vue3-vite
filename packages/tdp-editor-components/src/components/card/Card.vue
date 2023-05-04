<template>
    <form class="fd-card" ref="formRef" :id="allProps.state.key" :style="css">
        <fd-layout :state="allProps.state" parentId=""></fd-layout>
    </form>
</template>
<script lang="ts">
export default defineComponent({
    name: EnumComponentType.card,
});
</script>
<script lang="ts" setup>
import { defineComponent } from 'vue';
import { useBaseLifecycle } from '../../composables/base';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';

import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { ICardProps } from './interface';

const allProps = defineProps<{
    state: IComponentState<ICardProps>;
    parentId: string;
    props: ICardProps;
    css: Record<string, any>;
}>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
</script>
<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-card {
    position: relative;
    text-align: left;
    .fd-card-layout > .layout-drag {
        min-height: 200px;
    }
}
</style>
