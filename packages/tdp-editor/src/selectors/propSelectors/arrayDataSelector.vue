<template>
    <div class="selector-array-data">
        <ul>
            <li class="data-item" v-for="(d, index) in arrayData" :key="'i_' + index">
                <a-input v-model:value="d.key" placeholder="key"></a-input>
                <a-input v-model:value="d.label" placeholder="label"></a-input>
                <DeleteFilled @click="onDeleteItem(index)"></DeleteFilled>
            </li>
        </ul>
        <a-button type="primary" @click="onAddItem"> 添加 </a-button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: EnumSelectorName.arrayData,
});
</script>
<script lang="ts" setup>
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import { usePropsProxy } from 'tdp-editor-utils/propsFactory';
import { DeleteFilled } from '@ant-design/icons-vue';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';

type TItem = { key: string; label: string };
const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
}>();

// 创建属性数据
const arrayData = usePropsProxy<TItem[]>(
    _props.element,
    _props.prop.key as string,
    [],
    EnumPropsValueType.array
);

// 添加选项
const onAddItem = () => {
    const newData = {
        key: `item${arrayData.value.length}`,
        label: `item${arrayData.value.length}`,
    };
    arrayData.value.push(newData);
};

// 删除选项
const onDeleteItem = (index: number) => {
    arrayData.value.splice(index, 1);
};
</script>
