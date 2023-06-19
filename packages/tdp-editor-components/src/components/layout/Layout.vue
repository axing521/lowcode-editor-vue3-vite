<template>
    <div class="fd-layout"></div>
    <!-- <template v-if="c_isDesignMode">
        <Draggable
            class="fd-layout layout-drag"
            :class="c_designerClass"
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
                <ComponentWrapper :state="element" :parentId="props.state.key"></ComponentWrapper>
            </template>
        </Draggable>
    </template>
    <template v-else>
        <ComponentWrapper
            v-for="child in props.state.list"
            :key="child.key + '_wrapper'"
            :state="child"
            :parentId="props.state.key"
        ></ComponentWrapper>
    </template> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    // name: EnumComponentType.layout,
    name: 'fd-layout',
});
</script>

<script lang="ts" setup>
// import { inject, defineComponent, computed, getCurrentInstance, onMounted } from 'vue';
// import { useBase, useBaseInject } from '../../composables/base';
// import Draggable from 'vuedraggable';

// import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
// import type { ILayoutState } from './interface';
// import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';

// import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
// import { EnumComponentGroup } from 'tdp-editor-types/src/enum/components';
// import ComponentWrapper from '../componentWrapper.vue';

// const props = defineProps<{
//     state: ILayoutState;
//     designerClass?: string[]; // 处理设计时需要添加一些class保持和预览效果一致
// }>();

// const { c_isDesignMode } = useBase(props);
// const { addComponent } = useBaseInject();
// onMounted(() => {
//     addComponent('layout_' + props.state.key, getCurrentInstance()!.proxy!);
// });
// const dragAddComponent = inject(
//     'dragAddComponent',
//     (component: IDesignerComponent, parent: IDesignerComponent) => {}
// );

// let dragComponent: IDesignerComponent | undefined = undefined;

// const c_designerClass = computed(() => {
//     const result: string[] = [];
//     if (props.state.type === EnumComponentType.page) {
//         result.push('fd-page-layout');
//     }
//     if (props.designerClass) {
//         props.designerClass.forEach(c => {
//             result.push(c);
//         });
//     }
//     return result;
// });

// const dragAddHandler = () => {
//     const targetComponent = props.state;
//     if (targetComponent) {
//         const isLayoutType = targetComponent.group === EnumComponentGroup.layout;
//         if (isLayoutType) {
//             // @ts-ignore
//             dragAddComponent(dragComponent!, targetComponent!);
//         }
//     }
// };
// const dragChangeHandler = (e: any) => {
//     if (e && e.added) {
//         dragComponent = e.added.element;
//     }
// };

// const getDragableItemKey = (a: IComponentState) => {
//     return a.key + '_wrapper';
// };
</script>
<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-layout {
    position: relative;
    text-align: left;
    background-color: transparent;
    border-radius: 6px;
    &.layout-drag {
        width: 100%;
        height: 100%;
        min-height: 50px;
        padding-bottom: 20px;
        .fd-row {
            margin-top: 0;
        }
        .chosen {
            border-top: solid 2px @primary-color !important;
        }
    }
}
</style>
