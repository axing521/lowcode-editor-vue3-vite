<template>
    <div class="page-function-designer">
        <monaco-editor :value="props.selectedPage.functions || ''" language="javascript" />
    </div>
</template>
<style lang="less">
.page-function-designer {
    height: 100%;
    overflow: hidden;
}
</style>
<script setup lang="ts">
import MonacoEditor from '../../components/MonacoEditor.vue';
import type { IPageState } from 'tdp-editor-types/src/interface/app/components';

const props = defineProps<{
    selectedPage: IPageState;
}>();
</script>
