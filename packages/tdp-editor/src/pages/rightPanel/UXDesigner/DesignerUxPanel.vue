<template>
    <div class="designer-ux-panel">
        <div class="section ux">
            <h3>事件绑定</h3>
            <div class="item" v-for="group in elementBindEvents" :key="group.groupName">
                <div class="event-group-name">
                    {{ group.groupLabel }}
                </div>
                <div class="event-info">
                    <ul>
                        <li
                            v-for="event in group.events"
                            :key="event.eventId"
                            @click="editEvents(event)"
                        >
                            {{ EventTypeMap[event.eventType] }}
                            <span v-show="event.eventType === EnumEventType.pageFunction">
                                -- {{ event.funcName }}
                            </span>
                            <delete-outlined @click="deleteEvent($event, event.eventId)" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <a-button
            type="primary"
            class="btn-add-event"
            @click="addEvents"
            :disabled="!eventList.length"
        >
            添加
        </a-button>
        <add-event-modal
            v-model:visible="showPm"
            :element="props.element"
            :eventList="eventList"
            :event="checkedEvent"
        />
    </div>
</template>
<style lang="less">
.designer-ux-panel {
    position: relative;
    .btn-add-event {
        margin-top: 10px;
    }
    .section.ux > .item {
        display: block;
        padding: 10px;
        border: 1px solid #aaa;
        border-radius: 6px;
        margin: 2px;
        .event-group-name {
            font-size: 14px;
            font-weight: 600;
        }
        .event-info {
            ul {
                margin: 0;
                padding: 0;
                li {
                    list-style: none;
                    cursor: pointer;
                }
            }
        }
        .anticon {
            margin-left: 10px;
            cursor: pointer;
            &:hover {
                color: red;
            }
        }
    }
}
</style>
<script setup lang="ts">
import { defineComponent, ref, computed } from 'vue';
import type { IComponentEvent } from 'tdp-editor-types/src/interface/app/components';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';

import { DeleteOutlined } from '@ant-design/icons-vue';
import { EnumEventType, type EnumEventName } from 'tdp-editor-types/src/enum/components';
import { eventFactory } from 'tdp-editor-common/src';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import AddEventModal from './AddEventModal.vue';
import { EventNameMap, EventTypeMap } from 'tdp-editor-types/src/constant/component';

type TEventList = {
    key: EnumEventName;
    label: string;
    types: EnumEventType[];
};
const props = defineProps<{
    element?: IDesignerComponent;
}>();
const editorStore = useEditorStore();
const showPm = ref(false);
const checkedEvent = ref<IComponentEvent | undefined>(undefined);
const componentList = editorStore.componentList;
// 计算组件支持的事件
const eventConfigs = computed(() => {
    if (!props.element) return [];
    const comp = componentList.find(c => c.type === props.element!.type);
    return (comp && comp.eventConfigs) || [];
});
// 计算组件可选择的事件列表
const eventList = computed(() => {
    if (props.element && eventConfigs.value) {
        const eventList: TEventList[] = [];
        eventConfigs.value.forEach(config => {
            eventList.push({
                key: config.eventName,
                label: EventNameMap[config.eventName],
                types: config.eventTypes,
            });
        });
        return eventList;
    } else {
        return [];
    }
});
// 计算组件已绑定的事件
const elementBindEvents = computed(() => {
    const eventGroup = [] as {
        groupName: EnumEventName;
        groupLabel: string;
        events: IComponentEvent[];
    }[];
    if (props.element && props.element.events) {
        props.element.events.forEach(e => {
            const group = eventGroup.find(c => c.groupName === e.eventName);
            if (group) {
                group.events.push(e);
            } else {
                eventGroup.push({
                    groupName: e.eventName,
                    groupLabel: EventNameMap[e.eventName],
                    events: [e],
                });
            }
        });
    }
    return eventGroup;
});
// 删除事件
const deleteEvent = ($event: any, eventId: string) => {
    $event.preventDefault();
    $event.stopPropagation();
    eventFactory.removeEventById(props.element!, eventId);
};
const addEvents = (_eventId: string) => {
    checkedEvent.value = undefined;
    showPm.value = true;
};
const editEvents = (event: IComponentEvent) => {
    checkedEvent.value = event;
    showPm.value = true;
};
</script>
<script lang="ts">
export default defineComponent({
    name: 'designer-ux-panel',
});
</script>
