<template>
    <div
        :class="{
            'tdp-editor-runtime-wrapper': true,
        }"
    >
        <RuntimePage :json="pageJson" :appMode="EnumAppMode.runtime"></RuntimePage>
    </div>
</template>
<style lang="less" scoped>
@blueColor: #1890ff;
</style>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { EnumAppMode } from 'tdp-editor-types/enum';
import RuntimePage from 'tdp-editor-components/src/page.vue';
import { getAppController } from '../../controller';
const appController = getAppController();
appController.setMode(EnumAppMode.runtime);
onMounted(() => {
    console.log('RuntimeWrapper onMounted');
});
const pageJson = appController.getActivePage();
</script>
