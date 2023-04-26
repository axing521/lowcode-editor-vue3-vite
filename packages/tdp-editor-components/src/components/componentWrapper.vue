<template>
    <component
        :is="allProps.state.type"
        :class="classNames"
        :key="allProps.state.key"
        :state="allProps.state"
        :parentId="allProps.parentId"
        :id="allProps.state.key"
        :data-id="allProps.state.key"
        :data-type="allProps.state.type"
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
}>();

const { c_Props, c_Css, c_isDesignMode } = useBase(allProps);
const classNames = computed(() => {
    const classNames = [];
    if (c_isDesignMode.value) {
        classNames.push('editor-designer-comp');
    }
    (allProps.state.classNames || []).forEach(name => {
        classNames.push(name);
    });
    return classNames;
});
// useBaseWatch(allProps);
</script>
