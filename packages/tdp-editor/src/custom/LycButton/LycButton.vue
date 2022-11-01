<template>
    <a-button type="button">{{ prop_text }}</a-button>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { IComponentState } from 'tdp-editor-types/interface/components';
export interface IProps {
    text?: string;
}
const allProps = defineProps<{
    state: IComponentState<IProps>;
    parentId: string;
    props: IProps;
    css: Record<string, any>;
    events: Record<string, any>;
}>();

const prop_text = computed<string>(() => {
    return allProps.props.text || '按钮';
});
</script>
