<template>
    <div class="designer-ux-panel">
        <div class="section ux">
            <h3>事件绑定</h3>
            <div class="item" v-for="group in elementBindEvents" :key="group.groupName">
                <div class="event-group-name">
                    {{ group.groupName }}
                </div>
                <div class="event-info">
                    <ul>
                        <li v-for="event in group.events" :key="event.eventId">
                            {{ event.eventType }}
                            <delete-outlined @click="deleteEvent(event.eventId)" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <a-button
            type="primary"
            class="btn-add-event"
            @click="showEventsModal"
            :disabled="!eventList.length"
        >
            添加
        </a-button>
        <add-event-modal
            v-model:visible="showPm"
            :element="props.element"
            :eventId="eventId"
            :eventList="eventList"
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
        > .label {
            width: 120px;
            .ant-select {
                width: 90%;
            }
        }
        .value {
            .anticon {
                margin-left: 10px;
                cursor: pointer;
                &:hover {
                    color: red;
                }
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
import type { EnumEventType, EnumEventName } from 'tdp-editor-types/src/enum/components';
import { eventFactory } from 'tdp-editor-common/src';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import AddEventModal from './AddEventModal.vue';
import { EventNameMap } from 'tdp-editor-types/src/constant/component';

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
const eventId = ref('');
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
    const eventGroup = [] as { groupName: EnumEventName; events: IComponentEvent[] }[];
    if (props.element && props.element.events) {
        props.element.events.forEach(e => {
            const group = eventGroup.find(c => c.groupName === e.eventName);
            if (group) {
                group.events.push(e);
            } else {
                eventGroup.push({ groupName: e.eventName, events: [e] });
            }
        });
    }
    return eventGroup;
});
// 删除事件
const deleteEvent = (eventId: string) => {
    eventFactory.removeEventById(props.element!, eventId);
};
const showEventsModal = (_eventId: string) => {
    eventId.value = _eventId;
    showPm.value = true;
};
</script>
<script lang="ts">
export default defineComponent({
    name: 'designer-ux-panel',
});
</script>
