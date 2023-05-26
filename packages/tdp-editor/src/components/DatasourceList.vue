<template>
    <div class="datasource-list-box">
        <div>
            <a-button type="primary" @click="onAddBtnClick">添加</a-button>
        </div>
        <ul class="ds-list">
            <li v-for="item in dsList" :key="item.key">
                <div class="info">
                    <span class="name">{{ item.name }}</span>
                    <span class="enabel" :class="{ 'enabel-true': item.enable }">{{
                        item.enable ? '启用' : '停用'
                    }}</span>
                </div>
                <div class="action">
                    <a-button type="link" @click="onCheckBtnClick(item)">选择</a-button>
                    <a-button type="link" @click="onCloneBtnClick(item)">克隆</a-button>
                    <a-button type="link" @click="onEditBtnClick(item)">编辑</a-button>
                    <a-button type="link" @click="onDeleteBtnClick(item)">删除</a-button>
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
                    :action="addAction"
                    :edit-data="editData"
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
            border-radius: 5px;
            padding: 10px;
            margin: 8px;
            box-shadow: 0 0 10px 5px #ccc;
            .info {
                height: 150px - 32px - 20px;
                overflow: hidden;
                .enabel {
                    color: red;
                    margin-left: 10px;
                    &.enabel-true {
                        color: yellowgreen;
                    }
                }
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
import { ref } from 'vue';
import type { IDataSource } from 'tdp-editor-types/src/interface/app/datasource';
import { useDatasourceControler } from 'tdp-editor-common/src/controller';
import AddDatasource from './AddDatasource.vue';
import { $getUUID, $log } from 'tdp-editor-common/src/utils';

const emits = defineEmits<{
    (e: 'check', datasource: IDataSource): void;
}>();
const dsController = useDatasourceControler();
const showAddModal = ref(false);
const addAction = ref<'add' | 'edit' | 'view'>('add');
const editData = ref<IDataSource | undefined>(undefined);

const dsList = ref<IDataSource[]>(
    dsController.getGlobalDSList().concat(dsController.getCurrentPageDSList())
);

// 选择按钮单击事件
const onCheckBtnClick = (datasource: IDataSource) => {
    emits('check', datasource);
};

// 点击编辑按钮
const onEditBtnClick = (datasource: IDataSource) => {
    addAction.value = 'edit';
    editData.value = datasource;
    showAddModal.value = true;
};

// 添加按钮单击事件
const onAddBtnClick = () => {
    addAction.value = 'add';
    editData.value = undefined;
    showAddModal.value = true;
};

// 克隆按钮单击事件
const onCloneBtnClick = (datasource: IDataSource) => {
    const cloneDS: IDataSource = JSON.parse(JSON.stringify(datasource));
    cloneDS.key = $getUUID('ds', 10);
    cloneDS.name += '_copy';
    dsController.add(cloneDS);
    dsList.value = dsController.getGlobalDSList().concat(dsController.getCurrentPageDSList());
};

// 删除按钮单击事件
const onDeleteBtnClick = (datasource: IDataSource) => {
    dsController.removeDSByKey(datasource.key);
    dsList.value = dsController.getGlobalDSList().concat(dsController.getCurrentPageDSList());
};

// 数据源创建事件
const onDatasourceCreate = (datasource: IDataSource) => {
    $log('create datasource', datasource);
    if (addAction.value === 'add') {
        dsController.add(datasource);
        dsList.value.push(datasource);
        showAddModal.value = false;
        editData.value = undefined;
    } else if (addAction.value === 'edit') {
        dsController.update(datasource);
        dsList.value = dsController.getGlobalDSList().concat(dsController.getCurrentPageDSList());
        showAddModal.value = false;
    }
};

// 数据源取消创建事件
const onDatasourceCancel = () => {
    showAddModal.value = false;
    editData.value = undefined;
};
</script>
