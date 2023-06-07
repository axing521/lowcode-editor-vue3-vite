<script setup lang="ts">
// import { getPropValue, setPropValue } from '@/tdp-editor-common/src/factory/propsFactory';
import { EnumPropsValueType } from '../../../../../tdp-editor-types/src/enum/components/index';
import type { IDesignerComponent } from '@/tdp-editor-types/src/interface/designer';
import PropSelectorWrapper from '../../../selectors/propSelectors/PropSelectorWrapper.vue';
import { ref } from 'vue';

const props = defineProps<{
    element?: IDesignerComponent;
}>();

const valueType = EnumPropsValueType.string;

const loop = ref([
    { label: '循环数据', key: 'loopData', loopData: '', enableExpression: true },
    { label: '迭代变量名', key: 'itemName', itemName: '', enableExpression: false },
    { label: '索引变量名', key: 'indexName', indexName: '', enableExpression: false },
    { label: '循环 Key', key: 'loopKey', loopKey: '', enableExpression: true },
]);

/* const inputValue = computed<string>({
    get() {
        const propValue = getPropValue(props.element, _props.prop.key);
        if (propValue !== undefined) {
            return propValue;
        } else {
            return '';
        }
    },
    set(value) {
        setPropValue(_props.state, _props.prop.key, value, valueType);
    },
}); */
// 绑定的循环数据处理。。。
</script>

<template>
    <div class="loop-panel">
        <a-collapse expandIconPosition="right">
            <a-collapse-panel key="loop" header="循环">
                <template v-if="props.element">
                    <div class="section panel" v-for="(item, index) in loop" :key="item.key">
                        <prop-selector-wrapper
                            :enable-expression="item.enableExpression"
                            :state="props.element"
                            :prop="(loop[index] as any)"
                            :defualt-value-type="valueType"
                        >
                            <template #label />
                            <template #value>
                                <a-input
                                    v-if="item.key == 'loopData'"
                                    v-model:value="item.loopData"
                                ></a-input>
                                <a-input
                                    v-else-if="item.key == 'itemName'"
                                    v-model:value="item.itemName"
                                ></a-input>
                                <a-input
                                    v-else-if="item.key == 'indexName'"
                                    v-model:value="item.indexName"
                                ></a-input>
                                <a-input v-else v-model:value="item.loopKey"></a-input>
                            </template>
                        </prop-selector-wrapper>
                    </div>
                </template>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<style scoped lang="less"></style>
