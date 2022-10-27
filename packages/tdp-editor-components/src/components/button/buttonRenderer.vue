<template>
    <a-button
        class="fd-button"
        :id="allProps.state.key"
        v-bind="allProps.props"
        :style="allProps.css"
        v-on="allProps.events"
    >
        {{ allProps.props.text }}
    </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/enum/components';

export default defineComponent({
    name: EnumComponentType.button,
});
</script>

<script lang="ts" setup>
import type { IComponentState } from 'tdp-editor-types/interface/components';
import type { IButtonProps } from './interface';

const allProps = defineProps<{
    state: IComponentState<IButtonProps>;
    parentId: string;
    props: IButtonProps;
    css: Record<string, any>;
    events: Record<string, any>;
}>();
</script>
