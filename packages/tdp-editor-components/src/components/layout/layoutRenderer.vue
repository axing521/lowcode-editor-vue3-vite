<template>
    <template v-if="c_isDesignMode">
        <!--设计时渲染拖拽组件-->
        <Draggable
            class="fd-layout layout-drag"
            :class="{
                'fd-page-layout': props.state.type === EnumComponentType.page,
            }"
            :data-drag-id="props.state.key"
            :data-drag-type="props.state.type"
            :itemKey="getDragableItemKey"
            group="componentDesigner"
            :list="props.state.list"
            chosen-class="chosen"
            animation="300"
            :delay="200"
            @add="dragAddHandler"
            @change="dragChangeHandler"
        >
            <template #item="{ element }">
                <ComponentWrapper
                    :key="props.state.key + 'wrapper'"
                    :state="element"
                    :parentId="props.state.key"
                ></ComponentWrapper>
            </template>
        </Draggable>
    </template>
    <template v-else>
        <!--运行时渲染实际组件-->
        <ComponentWrapper
            v-for="child in props.state.list"
            :key="child.key + 'wrapper'"
            :state="child"
            :parentId="props.state.key"
        ></ComponentWrapper>
    </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnumComponentType } from 'tdp-editor-types/enum/components';

export default defineComponent({
    name: EnumComponentType.layout,
});
</script>

<script lang="ts" setup>
import { inject } from 'vue';
import { useBase } from '../../composables/base';
import Draggable from 'vuedraggable';

import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import type { IComponentState } from 'tdp-editor-types/interface/components';
import ComponentWrapper from '../componentWrapper.vue';

const props = defineProps<{
    state: IComponentState;
    parentId: string;
}>();

const { c_isDesignMode } = useBase(props);
const dragAddComponent = inject(
    'dragAddComponent',
    (component: IDesignerComponent, parent: IDesignerComponent) => {}
);
// const layoutType = EnumComponentType.layout;
let dragComponent: IDesignerComponent | undefined = undefined;

// const _isPage = computed(() => {
//     return props.state.type === EnumComponentType.page;
// });
// const _Css = computed(() => {
//     const combieCss: any = {};
//     // 显示阴影
//     if (c_Props.value.showShadow === true) {
//         combieCss.boxShadow = '0 0 10px 0 #888888';
//         combieCss.margin = '10px';
//     }
//     return {
//         ...{},
//         ...props.state.css,
//         ...combieCss,
//     };
// });

const dragAddHandler = () => {
    console.log('layout dragAddHandler');
    const targetComponent = props.state;
    if (targetComponent) {
        const isLayoutType =
            targetComponent.group === EnumComponentGroup.layout ||
            targetComponent.type === EnumComponentType.row ||
            targetComponent.type === EnumComponentType.col;
        if (isLayoutType) {
            // @ts-ignore
            dragAddComponent(dragComponent!, targetComponent!);
        }
    }
};
const dragChangeHandler = (e: any) => {
    console.log('layout dragChangeHandler');
    if (e && e.added) {
        dragComponent = e.added.element;
    }
};

const getDragableItemKey = (a: IComponentState) => {
    return a.key + '_wrapper';
};
</script>
