<template>
    <div class="tdp-app">
        <router-view></router-view>
    </div>
</template>
<style lang="less">
.tdp-app-page {
    position: relative;
}
</style>
<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { RouterConfig } from 'tdp-editor-utils/constants/router';

const router = useRouter();
const route = router.currentRoute;
watch(route, (newPage, oldPage) => {
    // 新跳转的路由是页面
    const pushToPage = newPage.name === RouterConfig.AppPage.name && oldPage.name !== newPage.name;
    // 不同页面间的跳转
    const pageChange =
        newPage.name === RouterConfig.AppPage.name &&
        oldPage.name === newPage.name &&
        newPage.params !== oldPage.params;
    if (pushToPage || pageChange) {
        console.log('应该要切换页面数据了');
        // 1.检查缓存数据有没有，有的话直接切换到缓存数据
        // 2.没有的话，发送接口，请求当前页面得数据，并缓存
    }
});
onMounted(() => {
    console.log('tdp-app onMounted');
});

setTimeout(() => {
    router.push('/app/pages/ccccc');
}, 3000);
</script>
