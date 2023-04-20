<template>
    <div class="page-function-designer">
        <div class="action">
            <a-button type="primary" @click="saveFunctions">保存</a-button>
        </div>
        <div class="monaco">
            <monaco-editor :value="pageFunctions" language="javascript" ref="monacoRef" />
        </div>
    </div>
</template>
<style lang="less" scoped>
.page-function-designer {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    .action {
        height: 40px;
        line-height: 40px;
        text-align: right;
    }
    .monaco {
        flex: 1;
    }
}
</style>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { IPageState } from 'tdp-editor-types/src/interface/app/components';
import MonacoEditor from '../../components/MonacoEditor.vue';
import { message } from 'ant-design-vue';

const props = defineProps<{
    selectedPage: IPageState;
}>();
const monacoRef = ref<any>(null);
// 页面样式
const pageFunctions = computed(() => {
    if (props.selectedPage && props.selectedPage.functions) {
        return props.selectedPage.functions;
    } else {
        return '';
    }
});
const saveFunctions = () => {
    if (monacoRef.value) {
        const newFunction = monacoRef.value.getValue();
        const page = props.selectedPage;
        page.functions = newFunction;
        message.success('函数保存成功');
    }
};
</script>
