<template>
    <component
        :is="allProps.state.type"
        :class="{ 'editor-designer-comp': c_isDesignMode }"
        :key="allProps.state.key"
        :state="allProps.state"
        :parentId="allProps.parentId"
        :id="allProps.state.key"
        :data-id="allProps.state.key"
        :data-type="allProps.state.type"
        :props="c_Props"
        :css="c_Css"
        :events="c_Events"
    ></component>
</template>
<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/interface/components';
import useBases from '../composables/base';
import useForms from '../composables/form';
import useBaseLifecycle from '../composables/base/baseLifecycle';
import useBaseWatch from '../composables/base/baseWatch';

const allProps = defineProps<{
    state: IComponentState;
    parentId: string;
}>();

const { c_Props, c_Css, c_Events, c_isDesignMode } = useBases.useBase(allProps);
useBaseLifecycle(allProps);
useBaseWatch(allProps);
if (allProps.state.isFormer) {
    useForms.useForm(allProps);
}
// const componentAllProps = {
//     class: 'editor-designer-comp',
//     key: allProps.state.key,
//     state: allProps.state,
//     parentId: allProps.parentId,
//     id: allProps.state.key,
//     'data-id': allProps.state.key,
//     'data-type': allProps.state.type,
//     props: c_Props.value,
//     css: c_Css.value,
//     events: c_Events,
// };
</script>
