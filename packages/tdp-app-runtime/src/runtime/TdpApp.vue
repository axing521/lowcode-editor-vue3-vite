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
html,
body {
    overflow: hidden;
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width: 100%;
        overflow: hidden;
    }
}
</style>
<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import { EnumAppMode } from 'tdp-editor-types/enum';
import RuntimePage from 'tdp-editor-components/src/page.vue';
import { useAppControler } from 'tdp-editor-utils/controller';
onMounted(() => {
    console.log('RuntimeWrapper onMounted');
});
const appController = useAppControler();
// 监听当前页面数据切换
const pageJson = computed(() => {
    return appController.getActivePage();
});
</script>
