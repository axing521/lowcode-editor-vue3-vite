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
    ></component>
</template>
<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import { useBase, useBaseWatch } from '../composables/base';

const allProps = defineProps<{
    state: IComponentState;
    parentId: string;
}>();

const { c_Props, c_Css, c_isDesignMode } = useBase(allProps);
useBaseWatch(allProps);
</script>
