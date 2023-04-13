<template>
    <div class="tdp-app">
        <router-view name="header" class="tdp-app-header"></router-view>
        <div class="tdp-app-middle">
            <router-view name="leftSide" class="tdp-app-left-side"></router-view>
            <router-view class="tdp-app-content"></router-view>
            <router-view name="rightSide" class="tdp-app-right-side"></router-view>
        </div>
        <router-view name="footer" class="tdp-app-footer"></router-view>
    </div>
</template>
<style lang="less">
@import '../styles/index.less';
.tdp-app {
    position: relative;
    display: flex;
    flex-flow: column;
    /* 页头 */
    .tdp-app-header {
        position: relative;
        overflow: hidden;
        flex: 0 0 auto;
        width: 100%;
        height: 64px;
        background-color: aqua;
    }
    /* 中心 */
    .tdp-app-middle {
        position: relative;
        overflow: hidden;
        flex: 1;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        /* 左侧导航 */
        .tdp-app-left-side {
            width: 300px;
            flex: 0 0 auto;
            overflow: auto;
            display: none;
            background-color: cornflowerblue;
            transition: all 0.3s;
        }
        /* 内容区域 */
        .tdp-app-content {
            flex: 1;
            overflow: auto;
            background-color: antiquewhite;
        }
        /* 右侧导航 */
        .tdp-app-right-side {
            width: 300px;
            flex: 0 0 auto;
            overflow: auto;
            display: none;
            background-color: goldenrod;
            transition: all 0.3s;
        }
    }
    /* 页脚 */
    .tdp-app-footer {
        position: relative;
        overflow: hidden;
        flex: 0 0 auto;
        width: 100%;
        height: 64px;
        background-color: aquamarine;
    }
}
@import '../styles/appTypeAdmin.less';
</style>
<script lang="ts" setup>
import { $log } from 'tdp-editor-common/src/utils';
import { onMounted } from 'vue';

onMounted(() => {
    $log('tdp-app onMounted');
    // 这个地方可以执行用户的应用初始化方法
});
</script>
