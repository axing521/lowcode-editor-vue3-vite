import type { ComponentPublicInstance } from 'vue';
import interact from 'interactjs';
import type { Interactable, InteractEvent } from '@interactjs/types/index';
import type { Rect } from '@interactjs/core/types';
import type { IComponentCommonProps } from 'tdp-editor-types/src/interface/app/components';
import type PageController from 'tdp-editor-common/src/controller/PageController';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';

import { $log } from 'tdp-editor-common/src/utils';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';

export const handleDrag = (pageControler: PageController) => {
    const dragResult = {
        action: '' as '左侧拖拽' | '内容拖拽' | '',
        type: '无变更' as '同级排序' | '跨级排序' | '跨级添加' | '无变更',
        dragSourceComp: undefined as ComponentPublicInstance<IComponentCommonProps> | undefined,
        dropTargetComp: undefined as ComponentPublicInstance<IComponentCommonProps> | undefined,
    };
    // 被拖拽的对象
    const dragElement = {
        newX: 0,
        newY: 0,
        pageX: 0,
        pageY: 0,
        clientX: 0,
        clientY: 0,
        clientX0: 0,
        clientY0: 0,
        rect: {} as Rect,
        element: null as HTMLElement | null,
    };

    // 拖拽目标
    const dropTargetElement = {
        element: null as HTMLElement | null,
    };

    const getElementComp = (element: HTMLElement | string | null) => {
        if (element && typeof element === 'string') {
            return pageControler.getComponentByKey(element);
        } else if (element && typeof element === 'object' && element.id) {
            return pageControler.getComponentByKey(element.id);
        } else {
            return undefined;
        }
    };

    // 取出html元素的下标值
    const getElementIndex = (element?: HTMLElement | null, name = 'data-index') => {
        if (element) {
            const attrValue = element.getAttribute(name);
            if (attrValue) {
                return Number(attrValue);
            }
        }
        return -1;
    };

    const getLiType = (element?: HTMLElement | null) => {
        if (element) {
            return element.getAttribute('data-comptype');
        }
        return '';
    };

    const createNewCompState = (type: EnumComponentType) => {
        const editorStore = useEditorStore();
        return editorStore.createNewCompJson(type);
    };

    const dragElementReset = () => {
        if (dragElement.element) {
            dragElement.element.classList.remove('active');
            dragElement.element.style.transform = '';
            dragElement.element.style.zIndex = '';
        }
        dragElement.element = null;
        dragElement.newX = 0;
        dragElement.newY = 0;
        dragElement.clientX0 = 0;
        dragElement.clientY0 = 0;
        dragElement.clientX = 0;
        dragElement.clientY = 0;
        dragElement.pageX = 0;
        dragElement.pageY = 0;
        dragElement.rect = {} as Rect;
    };

    const dropTargetElementReset = () => {
        if (dropTargetElement.element) {
            dropTargetElement.element.classList.remove('target');
            dropTargetElement.element.classList.remove('sorting');
        }
        dropTargetElement.element = null;
    };
    const dragResultReset = () => {
        dragResult.action = '';
        dragResult.type = '无变更';
        dragResult.dragSourceComp = undefined;
        dragResult.dropTargetComp = undefined;
    };

    // 左侧组件列表拖拽事件
    const leftComps = interact('.li-component');
    leftComps.draggable({
        hold: 200,
        onstart(e) {
            e.preventDefault();
            e.stopPropagation();
            dragResult.action = '左侧拖拽';
            // $log('内容设计器开始拖拽组件', e);
            const target = e.target as HTMLElement;
            if (target) {
                document.querySelectorAll('.tdp-editor-panel-left').forEach(c => {
                    c.classList.add('drag-comp');
                });
                dragElement.element = target;
                dragElement.element.classList.add('active');
            }
        },
        onmove(e: InteractEvent) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target as HTMLElement;
            if (target) {
                dragElement.newX += e.dx;
                dragElement.newY += e.dy;
                dragElement.clientX0 = e.clientX0;
                dragElement.clientY0 = e.clientY0;
                dragElement.clientX = e.clientX;
                dragElement.clientY = e.clientY;
                dragElement.pageX = e.pageX;
                dragElement.pageY = e.pageY;
                dragElement.rect = e.rect;

                target.style.transform = `translate3d(${dragElement.newX}px, ${dragElement.newY}px, 200px)`;
                target.style.zIndex = '11111111';
            }
        },
        onend(e) {
            document.querySelectorAll('.tdp-editor-panel-left').forEach(c => {
                c.classList.remove('drag-comp');
            });
            dragResultReset();
            dropTargetElementReset();
            dragElementReset();

            e.preventDefault();
            e.stopPropagation();
        },
    });
    // 内容区组件拖拽事件
    const contentComps = interact('.editor-designer-comp');
    contentComps.draggable({
        autoScroll: true,
        hold: 200,
        onstart(e) {
            e.preventDefault();
            e.stopPropagation();
            dragResult.action = '内容拖拽';
            // $log('内容设计器开始拖拽组件', e);
            const target = e.target as HTMLElement;
            if (target) {
                dragElement.element = target;
                dragElement.element.classList.add('active');
            }
        },
        onmove(e: InteractEvent) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target as HTMLElement;
            if (target) {
                dragElement.newX += e.dx;
                dragElement.newY += e.dy;
                dragElement.clientX0 = e.clientX0;
                dragElement.clientY0 = e.clientY0;
                dragElement.clientX = e.clientX;
                dragElement.clientY = e.clientY;
                dragElement.pageX = e.pageX;
                dragElement.pageY = e.pageY;
                dragElement.rect = e.rect;

                target.style.transform = `translate3d(${dragElement.newX}px, ${dragElement.newY}px, 200px)`;
                target.style.zIndex = '11111';
            }
        },
        onend(e: InteractEvent) {
            dragResultReset();
            dropTargetElementReset();
            dragElementReset();

            e.preventDefault();
            e.stopPropagation();
        },
    });

    // 容器组件拖拽事件
    const drops: Interactable = interact('.editor-designer-comp');
    drops.dropzone({
        accept: '.editor-designer-comp, .li-component',
        hold: 200,
        ondrop(e) {
            // $log('[ drops dropzone ] ondrop', e);
            $log('ondrop 结果：', dragResult);
            if (dragResult.type === '同级排序') {
                sameLevelSort();
            } else if (dragResult.type === '跨级添加') {
                crossLevelAdd();
            } else if (dragResult.type === '跨级排序') {
                crossLevelSort();
            }

            dropTargetElementReset();
            dragElementReset();

            e.preventDefault();
            e.stopPropagation();
        },
        ondragenter(e: InteractEvent) {
            // $log('[ drops dropzone ] ondragenter', e);
            dropTargetElement.element = e.target as HTMLElement;
            const targetComp = getElementComp(dropTargetElement.element);
            // 设计区域内拖拽
            if (dragResult.action === '内容拖拽' && dragElement.element) {
                const dragedComp = getElementComp(dragElement.element);
                if (targetComp && dragedComp) {
                    // 同级元素排序
                    if (!targetComp.state.box && targetComp.parentId === dragedComp.parentId) {
                        dragResult.type = '同级排序';
                        dragResult.dragSourceComp = dragedComp;
                        dragResult.dropTargetComp = targetComp;
                    }
                    // 跨级排序
                    else if (!targetComp.state.box && targetComp.parentId !== dragedComp.parentId) {
                        dragResult.type = '跨级排序';
                        dragResult.dragSourceComp = dragedComp;
                        dragResult.dropTargetComp = targetComp;
                    }
                    // 目标是容器组件，需要判断不同的情况
                    else if (targetComp.state.box) {
                        dragResult.type = '无变更';
                        dragResult.dragSourceComp = dragedComp;
                        dragResult.dropTargetComp = targetComp;
                    }
                }
            }
            // 左侧组件列表拖拽
            else if (dragResult.action === '左侧拖拽' && dragElement.element && targetComp) {
                dragResult.type = targetComp.state.box ? '跨级添加' : '跨级排序';
                dragResult.dropTargetComp = targetComp;
            }
            if (dropTargetElement.element) {
                dropTargetElement.element.classList.add('target');
            }
        },
        ondragleave() {
            dropTargetElementReset();
        },
        ondropmove() {
            // $log('[ drops dropzone ] ondropmove', dragElement.element);
            // 如果移动的目标是容器元素，需要判断是移动到容器中还是容器的前面
            if (
                dropTargetElement.element &&
                dropTargetElement.element.classList.contains('editor-designer-box')
            ) {
                const rect = dropTargetElement.element.getBoundingClientRect();
                // 如果鼠标在目标容器的上边缘10px之内，则是容器排序
                if (dragElement.clientY - rect.top <= 10) {
                    // $log('是排序');
                    dropTargetElement.element.classList.remove('target');
                    dropTargetElement.element.classList.add('sorting');
                    // 内容区拖拽的容器排序
                    if (
                        dragResult.action === '内容拖拽' &&
                        dragElement.element &&
                        dragResult.dragSourceComp &&
                        dragResult.dropTargetComp
                    ) {
                        dragResult.type =
                            dragResult.dragSourceComp.parentId ===
                            dragResult.dropTargetComp.parentId
                                ? '同级排序'
                                : '跨级排序';
                    }
                    // 左侧拖拽的内容排序
                    else if (
                        dragResult.action === '左侧拖拽' &&
                        dragElement.element &&
                        dragResult.dropTargetComp
                    ) {
                        dragResult.type = '跨级排序';
                    }
                }
                // 否则则是向组件容器添加
                else {
                    // $log('不是排序');
                    dropTargetElement.element.classList.add('target');
                    dropTargetElement.element.classList.remove('sorting');
                    if (
                        dragResult.action === '内容拖拽' &&
                        dragElement.element &&
                        dragResult.dragSourceComp &&
                        dragResult.dropTargetComp &&
                        dragResult.dragSourceComp.parentId !== dragResult.dropTargetComp.state.key
                    ) {
                        dragResult.type = '跨级添加';
                    } else if (
                        dragResult.action === '左侧拖拽' &&
                        dragElement.element &&
                        dragResult.dropTargetComp
                    ) {
                        dragResult.type = '跨级添加';
                    } else {
                        dragResult.type = '无变更';
                    }
                }
            }
        },
    });

    /**
     * 同级排序
     */
    const sameLevelSort = () => {
        // 找到父组件
        const parentComp = getElementComp(dragResult.dragSourceComp!.parentId);
        if (parentComp) {
            // 查找源组件下标
            const sourceIndex = getElementIndex(dragElement.element);
            // 查找目标组件下标
            const targetIndex = getElementIndex(dropTargetElement.element);
            if (sourceIndex > -1 && targetIndex > -1) {
                const sourceState = parentComp.state.list![sourceIndex];
                parentComp.state.list!.splice(sourceIndex, 1);
                parentComp.state.list!.splice(targetIndex, 0, sourceState);
            }
        }
    };
    /**
     * 跨级添加
     */
    const crossLevelAdd = () => {
        if (dragResult.action === '内容拖拽') {
            // 查找源组件父元素
            const sourceParentComp = getElementComp(dragResult.dragSourceComp!.parentId);
            if (sourceParentComp && dragResult.dropTargetComp) {
                // 查找源组件下标
                const sourceIndex = getElementIndex(dragElement.element);
                if (sourceIndex > -1) {
                    // 源组件添加到目标组件列表最后
                    dragResult.dropTargetComp.state.list?.push(
                        sourceParentComp.state.list![sourceIndex]
                    );
                    // 在源组件父组件中删除源组件
                    sourceParentComp.state.list!.splice(sourceIndex, 1);
                }
            }
        } else if (
            dragResult.action === '左侧拖拽' &&
            dragElement.element &&
            dragResult.dropTargetComp
        ) {
            const compType = getLiType(dragElement.element) as EnumComponentType;
            const newCompState = createNewCompState(compType);
            dragResult.dropTargetComp.state.list?.push(newCompState);
        }
    };

    /**
     * 跨级排序
     */
    const crossLevelSort = () => {
        if (dragResult.action === '内容拖拽') {
            // 查找源组件父元素
            const sourceParentComp = getElementComp(dragResult.dragSourceComp!.parentId);
            // 查找目标组件父元素
            const targetParentComp = getElementComp(dragResult.dropTargetComp!.parentId);
            if (sourceParentComp && targetParentComp) {
                // 查找源组件下标
                const sourceIndex = getElementIndex(dragElement.element);
                // 查找目标组件下标
                const targetIndex = getElementIndex(dropTargetElement.element);
                if (sourceIndex > -1 && targetIndex > -1) {
                    // 源组件添加到目标组件之前
                    targetParentComp.state.list?.splice(
                        targetIndex,
                        0,
                        sourceParentComp.state.list![sourceIndex]
                    );
                    // 在源组件父组件中删除源组件
                    sourceParentComp.state.list!.splice(sourceIndex, 1);
                }
            }
        } else if (
            dragResult.action === '左侧拖拽' &&
            dragResult.dropTargetComp &&
            dragElement.element
        ) {
            const compType = getLiType(dragElement.element) as EnumComponentType;
            const newCompState = createNewCompState(compType);

            // 查找目标组件父元素
            const targetParentComp = getElementComp(dragResult.dropTargetComp!.parentId);
            // 查找目标组件下标
            const targetIndex = getElementIndex(dropTargetElement.element);
            if (targetParentComp && targetIndex > -1) {
                targetParentComp.state.list?.splice(targetIndex, 0, newCompState);
            }
        }
    };
};
