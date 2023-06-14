<template>
    <span class="fd-text" :id="state.key" v-bind="props" :style="css" v-on="eventsMap">
        {{ bindValue }}
    </span>
</template>
<script lang="ts" setup>
import { defineComponent, inject, computed } from 'vue';
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

// 文本组件绑定值类型是表达式 且 组件存在上下文itemName和indexName
const loopItem = computed(() => {
    return inject(`${allProps.itemName}`, undefined);
});
const loopIndex = computed(() => {
    return inject(`${allProps.indexName}`, undefined);
});

/* eslint-disable */
let bindValue = computed(() => {
    return allProps.state.props?.text?.type == 'expression'
        ? new Function(
              `let ${allProps.itemName} = ${JSON.stringify(loopItem.value)} \n let ${
                  allProps.indexName
              } = ${JSON.stringify(loopIndex.value)} \n` +
                  `return ${allProps.state.props.text.bindValue}`
          )()
        : allProps.props.text;
});
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
