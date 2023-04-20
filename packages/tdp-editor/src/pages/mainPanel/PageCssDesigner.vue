<template>
    <div class="page-css-designer">
        <div class="action">
            <a-button type="primary" @click="saveStyles">保存</a-button>
        </div>
        <div class="monaco">
            <monaco-editor :value="pageStyles" language="css" ref="monacoRef" />
        </div>
    </div>
</template>
<style lang="less" scoped>
.page-css-designer {
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
const pageStyles = computed(() => {
    if (props.selectedPage && props.selectedPage.styles) {
        return props.selectedPage.styles;
    } else {
        return '';
    }
});
const saveStyles = () => {
    if (monacoRef.value) {
        const newStyles = monacoRef.value.getValue();
        const page = props.selectedPage;
        page.styles = newStyles;
        message.success('样式保存成功');
    }
};
</script>
