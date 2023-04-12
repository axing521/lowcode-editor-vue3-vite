<template>
    <div style="text-align: center; color: #ccc">
        <p>欢迎使用Tdp-App</p>
        <div>输入pageId: <input v-model="inputPageId" /></div>
        <button @click="onPageTo">跳转页面</button>
    </div>
</template>
<script lang="ts" setup>
import { RouterConfig } from 'tdp-editor-common/constants/router';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const inputPageId = ref('');
const router = useRouter();

onMounted(() => {
    console.info('tdp-app-index onMounted');
    // 这个地方可以执行用户的应用初始化方法
});

const onPageTo = () => {
    router.push({ name: RouterConfig.AppPage.name, params: { pageId: inputPageId.value } });
};

// setTimeout(() => {
//     router.push('/app/pages/ccccc');
// }, 3000);
</script>
