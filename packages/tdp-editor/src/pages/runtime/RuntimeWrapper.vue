<template>
    <div
        :class="{
            'tdp-editor-runtime-wrapper': true,
        }"
    >
        <RuntimePage v-if="pageJson" :json="pageJson" :appMode="EnumAppMode.runtime"></RuntimePage>
    </div>
</template>
<style lang="less" scoped>
@blueColor: #1890ff;
</style>
<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import { EnumAppMode } from 'tdp-editor-types/enum';
import RuntimePage from 'tdp-editor-components/src/page.vue';
import { getAppController } from '../../controller';
const appController = getAppController();
appController.setMode(EnumAppMode.runtime);
onMounted(() => {
    console.log('RuntimeWrapper onMounted');
});
// 监听当前页面数据切换
const pageJson = computed(() => {
    return appController.getActivePage();
});
</script>
