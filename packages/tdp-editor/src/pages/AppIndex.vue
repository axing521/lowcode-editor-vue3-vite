<template>
    <div class="tdp-editor-index">
        <router-view class="tdp-app-content"></router-view>
    </div>
</template>
<style lang="less">
.tdp-editor-index {
    height: 100%;
    width: 100%;
}
</style>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { $log } from 'tdp-editor-common/src/utils';

onMounted(() => {
    $log('路由到editor首页，初始化后进入editor');
});
</script>
