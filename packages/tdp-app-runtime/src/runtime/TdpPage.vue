<template>
    <div
        :class="{
            'tdp-editor-runtime-wrapper': true,
        }"
    >
        <RuntimePage v-if="pageJson" :json="pageJson" :appMode="EnumAppMode.runtime"></RuntimePage>
    </div>
</template>
<style lang="less">
@blueColor: #1890ff;
</style>
<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { EnumAppMode } from 'tdp-editor-types/enum';
import RuntimePage from 'tdp-editor-components/src/page.vue';
import { useAppControler } from 'tdp-editor-utils/controller';
const route = useRoute();
const pageId = route.params.pageId || '';
onMounted(() => {
    console.log(`tdp-app-page ${pageId} onMounted`);
});
const appController = useAppControler();
// 监听当前页面数据切换
const pageJson = computed(() => {
    return appController.getActivePage();
});
</script>
