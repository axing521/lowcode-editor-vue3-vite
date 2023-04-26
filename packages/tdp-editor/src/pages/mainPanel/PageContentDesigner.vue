<template>
    <div class="main-panel-empty" v-if="!componentList.length">
        <h3>tdp editor</h3>
        <h5>请拖入容器组件</h5>
    </div>
    <page-view :json="props.selectedPage" :appMode="props.appMode"></page-view>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { IPageState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumAppMode } from 'tdp-editor-types/src/enum';
import PageView from 'tdp-editor-components/src/components/page';
const props = defineProps<{
    selectedPage?: IPageState;
    appMode: EnumAppMode;
}>();

const componentList = computed(() => {
    if (!props.selectedPage) {
        return [];
    } else {
        return props.selectedPage.list || [];
    }
});
</script>
