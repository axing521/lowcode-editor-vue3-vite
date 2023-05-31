<template>
    <div class="fd-card" :class="flexCardClass" :id="state.key" :style="css">
        <ComponentWrapper
            v-for="child in state.list"
            :key="child.key + '_wrapper'"
            :state="child"
            :parentId="state.key"
        ></ComponentWrapper>
        <!-- <fd-layout :state="state" :designerClass="flexCardClass"></fd-layout> -->
    </div>
</template>
<script lang="ts">
export default defineComponent({
    name: EnumComponentType.card,
});
</script>
<script lang="ts" setup>
import { defineComponent, computed } from 'vue';
import { useBaseLifecycle } from '../../composables/base';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';

import type { ICompBaseProps } from 'tdp-editor-types/src/interface/app/components';
import type { ICardProps, ICardState } from './interface';
import ComponentWrapper from '../componentWrapper.vue';

const allProps = defineProps<ICompBaseProps<ICardProps, ICardState>>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
const flexCardClass = computed(() => {
    const result: string[] = [];
    if (allProps.props.flexCard) {
        result.push('card-flex');
    } else {
        return result;
    }
    // 布局方向
    if (allProps.props.layout === 'row') {
        result.push('card-flex-row');
    } else if (allProps.props.layout === 'column') {
        result.push('card-flex-column');
    }
    // 是否可以换行
    if (allProps.props.wrap) {
        result.push('card-flex-wrap');
    }
    return result;
});
</script>
<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-card {
    position: relative;
    text-align: left;
}
.@{prefixName}-card,
.@{prefixName}-card > .layout-drag {
    &.card-flex {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-items: center;
        > .@{prefixName}-card {
            flex: 1;
        }
    }
    &.card-flex-row {
        flex-direction: row;
    }
    &.card-flex-column {
        flex-direction: column;
        > .@{prefixName}-card {
            width: 100%;
        }
    }
    &.card-flex-wrap {
        flex-wrap: wrap;
    }
}
</style>
