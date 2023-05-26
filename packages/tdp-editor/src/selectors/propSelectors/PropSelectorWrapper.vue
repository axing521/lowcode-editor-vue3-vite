<template>
    <div class="item">
        <!-- 属性名称显示 -->
        <template v-if="$slots.label">
            <div class="label">
                <slot name="label">
                    {{ prop.label }}
                </slot>
            </div>
        </template>
        <!-- 普通选择器 -->
        <template v-if="$slots.value">
            <div class="value">
                <template v-if="status === 'normal'">
                    <slot name="value"></slot>
                </template>
                <template v-else-if="status === 'expression'">
                    <var-prop-bind-input
                        :dsKey="state.dsKey"
                        :value="bindValue"
                        @change="expressionChange"
                    />
                </template>
            </div>
        </template>
        <!-- 表达式选择器 -->
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
import { computed } from 'vue';
import { ApiOutlined } from '@ant-design/icons-vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';
import {
    setPropExpression,
    getPropExpression,
    setPropValueType,
} from 'tdp-editor-common/src/factory/propsFactory';
import VarPropBindInput from '../../components/VarPropBindInput.vue';
import { EnumPropsValueType } from 'tdp-editor-types/src/enum/components';

type TStatus = 'normal' | 'expression' | 'datasource'; // selector状态：普通，表达式，数据源

const props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
    defualtValueType: EnumPropsValueType;
    enableExpression?: boolean;
}>();

const status = computed<TStatus>(() => {
    const propInfo = props.state.props && props.state.props[props.prop.key as any];
    const propType = propInfo?.type;
    // 监听status状态变化
    return propType === EnumPropsValueType.expression ? 'expression' : 'normal';
});

const bindValue = computed(() => {
    if (status.value === 'expression') {
        return getPropExpression(props.state, props.prop.key);
    }
    return '';
});

// 更改状态
const changeStatus = () => {
    // 设置成表达式状态
    if (status.value === 'normal') {
        setPropValueType(props.state, props.prop.key, EnumPropsValueType.expression);
    } else {
        setPropValueType(props.state, props.prop.key, props.defualtValueType);
    }
};

// 表达式改变事件
const expressionChange = (expression: string) => {
    if (!props.state) return;
    setPropExpression(props.state, props.prop.key, expression);
};
</script>
