<template>
    <component
        :is="allProps.state.type"
        :class="classes"
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
import { watchEffect, reactive } from 'vue';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import { useBase } from '../composables/base';

const allProps = defineProps<{
    state: IComponentState;
    parentId: string;
}>();

const { c_Props, c_Css, c_isDesignMode } = useBase(allProps);
const classes: any = reactive({
    'editor-designer-comp': c_isDesignMode,
});
(allProps.state.classNames || []).forEach(name => {
    classes[name] = true;
});
watchEffect(() => {
    (allProps.state.classNames || []).forEach(name => {
        classes[name] = true;
    });
});
// useBaseWatch(allProps);
</script>
