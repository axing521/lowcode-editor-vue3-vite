<template>欢迎使用Tdp-App</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
    console.log('tdp-app-index onMounted');
    // 这个地方可以执行用户的应用初始化方法
});

setTimeout(() => {
    router.push('/app/pages/ccccc');
}, 3000);
</script>
