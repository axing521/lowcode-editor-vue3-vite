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
import { computed } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';
import { DeleteFilled } from '@ant-design/icons-vue';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';

type TItem = { key: string; label: string };
const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
}>();
// 数组数据选择器
const arrayData = computed({
    get(): TItem[] {
        const data: TItem[] = propsFactory.getPropsValue(_props.element, _props.prop.key);
        if (data && data instanceof Array) {
            return data;
        } else {
            return [];
        }
    },
    set(items) {
        propsFactory.setPropsValue(_props.element, _props.prop.key, items);
    },
});

const onAddItem = () => {
    const data = (propsFactory.getPropsValue(_props.element, _props.prop.key) || []) as TItem[];
    console.log('data', data);
    const newData = {
        key: `item${data.length}`,
        label: `item${data.length}`,
    };
    data.push(newData);
    arrayData.value = data;
};

const onDeleteItem = (index: number) => {
    propsFactory.removePropsValue(_props.element, _props.prop.key, index);
};
</script>
