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
import { $log } from 'tdp-editor-common/src/utils';
import { onMounted } from 'vue';

onMounted(() => {
    $log('tdp-editor-index onMounted');
    // 这个地方可以执行用户的应用初始化方法
});
</script>
