<template>
    <component
        :is="state.type"
        :class="classNames"
        :key="state.key"
        :state="state"
        :parentId="parentId"
        :id="state.key"
        :data-id="state.key"
        :data-type="state.type"
        :data-index="dataIndex"
        :props="c_Props"
        :css="c_Css"
    ></component>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import { useBase } from '../composables/base';

const allProps = defineProps<{
    state: IComponentState;
    parentId: string;
    dataIndex: number;
}>();

const { c_Props, c_Css, c_isDesignMode } = useBase(allProps);
const classNames = computed(() => {
    const classNames = [];
    if (c_isDesignMode.value) {
        classNames.push(
            allProps.state.box
                ? ['editor-designer-box', 'editor-designer-comp']
                : 'editor-designer-comp'
        );
    }
    (allProps.state.classNames || []).forEach(name => {
        classNames.push(name);
    });

    return classNames;
});
</script>
