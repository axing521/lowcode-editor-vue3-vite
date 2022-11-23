<template>
    <a-rate class="fd-rate" v-bind="allProps.props"></a-rate>
</template>

<style lang="less">
@import '/src/styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-rate {
    position: relative;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/enum/components';

export default defineComponent({
    name: EnumComponentType.rate,
});
</script>

<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/interface/components';
import type { IRateProps } from './interface';
const allProps = defineProps<{
    state: IComponentState<IRateProps>;
    parentId: string;
    props: IRateProps;
    css: Record<string, any>;
    events: Record<string, any>;
}>();
</script>
