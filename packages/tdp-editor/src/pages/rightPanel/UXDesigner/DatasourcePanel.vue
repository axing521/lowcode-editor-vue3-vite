<template>
    <div class="datasource-panel" v-if="show">
        <div class="section">
            <h3>选择数据源</h3>
            <div class="item">
                <a-button type="primary" @click="showDsList = true">
                    {{ checkedDatasource ? checkedDatasource.name : '选择' }}
                </a-button>
            </div>
        </div>
        <a-modal
            v-model:visible="showDsList"
            style="width: 80%"
            :bodyStyle="{ height: '700px' }"
            :footer="null"
        >
            <DatasourceList style="height: 100%" @check="onDatasourceCheck"></DatasourceList>
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
import type { IDataSource } from 'tdp-editor-types/src/interface/app/datasource';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import DatasourceList from '../../../components/DatasourceList.vue';
import { useDatasourceControler } from 'tdp-editor-common/src/controller';

const props = defineProps<{
    element?: IDesignerComponent;
}>();

const show = computed(() => {
    return props.element && props.element.type !== EnumComponentType.page;
});

const showDsList = ref(false);

const checkedDatasource = computed(() => {
    if (props.element && props.element.dsKey) {
        const ds = useDatasourceControler().getDSByKey(props.element.dsKey);
        return ds.item;
    } else {
        return undefined;
    }
});

const onDatasourceCheck = (datasource: IDataSource) => {
    showDsList.value = false;
    if (props.element && datasource) {
        const elment = props.element;
        elment.dsKey = datasource.key;
    }
};
</script>
