<template>
    <div class="tdp-app">
        <router-view></router-view>
    </div>
</template>
<style lang="less">
.tdp-app {
    position: relative;
}
</style>
<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
    console.log('tdp-app onMounted');
    // 这个地方可以执行用户的应用初始化方法
});
</script>
