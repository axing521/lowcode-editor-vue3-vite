<template>
    <a-input :placeholder="allProps.props.placeholder || 'input something'" />
</template>
<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/interface/app/components';
export interface IProps {
    placeholder?: string;
}
const allProps = defineProps<{
    state: IComponentState<IProps>;
    parentId: string;
    props: IProps;
    css: Record<string, any>;
    events: Record<string, any>;
}>();
</script>
