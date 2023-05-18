<template>
    <div class="datasource-list-box">
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
    </div>
</template>
<style lang="less" scoped>
.datasource-list-box {
    position: relative;
    ul.ds-list {
        position: relative;
        margin: 10px;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: baseline;
        li {
            display: block;
            width: 260px;
            height: 150px;
            flex: 0 0 auto;
            background-color: #fff;
            border: 1px solid #aaa;
            border-radius: 5px;
            margin: 10px;
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
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import type { IDataSource } from 'tdp-editor-types/src/interface/app/datasource';
import { reactive } from 'vue';

const emits = defineEmits<{
    (e: 'check', datasource: IDataSource): void;
}>();
const dsList = reactive<IDataSource[]>([]);
dsList.push({
    key: 'a1',
    name: '用户列表',
    sourceType: 'url',
    enable: true,
    input: {
        config: {},
    },
    output: {
        compType: [EnumComponentType.button],
    },
});

// 选择按钮单击事件
const onCheckBtnClick = (datasource: IDataSource) => {
    emits('check', datasource);
};
</script>
