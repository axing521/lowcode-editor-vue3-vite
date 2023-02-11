<template>
    <div id="preview_box"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { createRuntime } from 'tdp-app-runtime/src/runtime/runtime';
import { getDataAsync, openDBAsync } from 'tdp-editor-utils/indexDBUtil';
const html = document.querySelector('html');
const body = document.body;
html?.classList.add('app-type-admin');
body?.classList.add('app-type-admin');
onMounted(async () => {
    const tdpRuntime = createRuntime({
        container: '#preview_box',
    });
    const db = await openDBAsync().catch(e => console.error(e));
    if (!db) return;
    // 如果有本地数据，则使用本地数据渲染，如果没有，则初始化一个空的editor
    const localData = await getDataAsync(db, 'local').catch();
    if (localData) {
        tdpRuntime.setRuntimeJson(localData.data);
    }
});
</script>
<style lang="less">
#preview_box {
    width: 100%;
    height: 100%;
}
</style>
