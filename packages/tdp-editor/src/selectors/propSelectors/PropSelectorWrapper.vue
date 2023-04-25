<template>
    <div class="item">
        <template v-if="$slots.label">
            <div class="label"><slot name="label"></slot></div>
        </template>
        <template v-if="$slots.value">
            <div class="value">
                <template v-if="status === 'normal'">
                    <slot name="value"></slot>
                </template>
                <template v-else-if="status === 'expression'">
                    <var-prop-bind-input @change="expressionChange" />
                </template>
            </div>
        </template>
        <template v-if="enableExpression">
            <div class="action">
                <a-button
                    shape="circle"
                    :type="status === 'expression' ? 'primary' : ''"
                    @click="changeStatus"
                >
                    <template #icon><ApiOutlined /></template>
                </a-button>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { ApiOutlined } from '@ant-design/icons-vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';
import { setPropExpression } from 'tdp-editor-common/src/factory/propsFactory';
import VarPropBindInput from '../../components/VarPropBindInput.vue';

type TStatus = 'normal' | 'expression' | 'datasource'; // selector状态：普通，表达式，数据源

const props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
    enableExpression?: boolean;
    status?: TStatus;
}>();

const status = ref<TStatus>('normal');

// 更改状态
const changeStatus = () => {
    // 设置成表达式状态
    if (status.value === 'normal') {
        status.value = 'expression';
    } else {
        status.value = 'normal';
    }
};

// 表达式改变事件
const expressionChange = (expression: string) => {
    if (!props.state) return;
    setPropExpression(props.state, props.prop.key, expression);
};
watchEffect(() => {
    // 监听status状态变化
    status.value = props.status || 'normal';
});
</script>
