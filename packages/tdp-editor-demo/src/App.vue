<template>
    <div id="tdp-editor-demo">
        <header>演示如何引入 tdp-editor</header>
        <div id="demo-body"></div>
    </div>
</template>
<style lang="less">
html,
body {
    overflow: hidden;
    #app {
        height: 100%;
    }
}
#tdp-editor-demo {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    overflow: hidden;
    header {
        height: 50px;
        flex: 0 0 auto;
        font-size: 28px;
    }
    #demo-body {
        flex: 1;
        overflow: hidden;
    }
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'tdp-editor',
});
</script>
