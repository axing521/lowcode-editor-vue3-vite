<template>
    <div class="page-css-designer">
        <monaco-editor :value="props.selectedPage.styles || ''" language="css" />
    </div>
</template>
<style lang="less">
.page-css-designer {
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
