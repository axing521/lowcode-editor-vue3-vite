<template>
    <div class="item">
        <div class="label">{{ prop.label }}</div>
        <div class="value">
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
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
export default defineComponent({
    name: EnumSelectorName.arrayData,
});
</script>
<script lang="ts" setup>
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';
import { EnumPropsValueType } from 'tdp-editor-types/src/enum/components';
import { getPropValue, setPropValue } from 'tdp-editor-common/src/factory/propsFactory';
import { DeleteFilled } from '@ant-design/icons-vue';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';

type TItem = { key: string; label: string };
const _props = defineProps<{
    state: IDesignerComponent;
    prop: IPropsConfig;
}>();

const arrayData = computed<TItem[]>({
    get() {
        const propValue = getPropValue(_props.state, _props.prop.key);
        if (propValue !== undefined) {
            return propValue;
        } else {
            return [];
        }
    },
    set(value) {
        setPropValue(_props.state, _props.prop.key, value, EnumPropsValueType.array);
    },
});

// 添加选项
const onAddItem = () => {
    const newData = {
        key: `item${arrayData.value.length}`,
        label: `item${arrayData.value.length}`,
    };
    arrayData.value = [...arrayData.value, ...[newData]];
};

// 删除选项
const onDeleteItem = (index: number) => {
    arrayData.value = arrayData.value.filter((c, i) => i !== index);
};
</script>
