<template>
    <div class="datasource-list-box">
        <div>
            <a-button type="primary" @click="onAddBtnClick">添加</a-button>
        </div>
        <ul class="ds-list">
            <li v-for="item in dsList" :key="item.key">
                <div class="info">
                    <span class="name">{{ item.name }}</span>
                    <a-switch v-model:checked="item.enable"></a-switch>
                </div>
                <div class="action">
                    <a-button type="link" @click="onCheckBtnClick(item)">选择</a-button>
                </div>
            </li>
        </ul>
        <a-modal
            v-model:visible="showAddModal"
            :footer="null"
            wrapClassName="add-ds-modal"
            :width="1200"
        >
            <div class="add-modal-body">
                <AddDatasource
                    @create="onDatasourceCreate"
                    @cancel="onDatasourceCancel"
                ></AddDatasource>
            </div>
        </a-modal>
    </div>
</template>
<style lang="less">
.add-ds-modal {
    .ant-modal-body {
        width: 1200px;
        height: 700px;
        overflow: auto;
    }
}

.datasource-list-box {
    position: relative;
    ul.ds-list {
        position: relative;
        margin: 10px;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: baseline;
        > li {
            display: block;
            width: 260px;
            height: 150px;
            flex: 0 0 auto;
            background-color: #fff;
            border: 1px solid #aaa;
            border-radius: 5px;
            padding: 10px;
            .info {
                height: 150px - 32px;
                overflow: hidden;
            }
            .action {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-end;
                align-items: center;
            }
        }
    }
}
</style>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { IDataSource } from 'tdp-editor-types/src/interface/app/datasource';
import { useDatasourceControler } from 'tdp-editor-common/src/controller';
import AddDatasource from './AddDatasource.vue';
import { $log } from 'tdp-editor-common/src/utils';

const emits = defineEmits<{
    (e: 'check', datasource: IDataSource): void;
}>();
const dsController = useDatasourceControler();
const showAddModal = ref(false);

const dsList = reactive<IDataSource[]>(
    dsController.getGlobalDSLIst().concat(dsController.getCurrentPageDSList())
);

// 选择按钮单击事件
const onCheckBtnClick = (datasource: IDataSource) => {
    emits('check', datasource);
};

// 添加按钮单击事件
const onAddBtnClick = () => {
    showAddModal.value = true;
};

// 数据源创建事件
const onDatasourceCreate = (datasource: IDataSource) => {
    $log('datasource', datasource);
    dsController.add(datasource);
    dsList.push(datasource);
    showAddModal.value = false;
};

// 数据源取消创建事件
const onDatasourceCancel = () => {
    showAddModal.value = false;
};
</script>
