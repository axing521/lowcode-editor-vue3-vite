<template>
    <div class="datasource-panel" v-if="show">
        <div class="section">
            <h3>选择数据源</h3>
            <div class="item">
                <a-button type="primary" @click="showDsList = true">选择</a-button>
            </div>
        </div>
        <a-modal
            v-model:visible="showDsList"
            style="width: 80%"
            :bodyStyle="{ height: '700px' }"
            :footer="null"
        >
            <DatasourceList style="height: 100%" @check="showDsList = false"></DatasourceList>
        </a-modal>
    </div>
</template>
<style lang="less" scoped>
.datasource-panel {
    position: relative;
    .section {
        .item {
            justify-content: center;
        }
    }
}
</style>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import DatasourceList from '../../../components/DatasourceList.vue';

const props = defineProps<{
    element?: IDesignerComponent;
}>();

const show = computed(() => {
    return props.element && props.element.type !== EnumComponentType.page;
});

const showDsList = ref(false);
</script>
