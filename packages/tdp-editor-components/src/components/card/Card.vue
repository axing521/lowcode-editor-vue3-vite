<template>
    <div class="fd-card" :class="flexCardClass" :id="state.key" :style="css">
        <fd-layout :state="state" :parentId="state.key"></fd-layout>
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
        result.push('card-flex-nowrap');
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
    &.card-flex {
        display: flex;
        > .@{prefixName}-card {
            flex: 1;
        }
        /* 处理编辑时flex样式保持统一 */
        &.editor-designer-comp {
            > .layout-drag {
                display: flex;
                padding: 10px;
                > .@{prefixName}-card {
                    flex: 1;
                }
            }
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
        /* 处理编辑时flex样式保持统一 */
        &.editor-designer-comp {
            > .layout-drag {
                flex-direction: column;
                > .@{prefixName}-card {
                    width: 100%;
                }
            }
        }
    }
    &.card-flex-nowrap {
        flex-wrap: nowrap;
    }
}
</style>
